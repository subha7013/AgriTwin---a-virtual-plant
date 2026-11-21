import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { User } from "../../models/User.js";
import { RefreshToken } from "../../models/RefreshToken.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getTokenExpiry,
} from "../../utils/jwt.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getTokenExpiry(refreshToken),
  });

  return { accessToken, refreshToken };
}

export async function registerUser({ username, email, password }) {
  const existing = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existing) {
    throw ApiError.conflict(
      existing.username === username
        ? "Username already exists"
        : "Email already exists",
      "USER_EXISTS"
    );
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  const user = await User.create({
    username,
    email,
    passwordHash,
    role: "user",
  });

  return user;
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({
    $or: [{ username }, { email: username.toLowerCase() }],
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid username or password");
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    throw ApiError.unauthorized("Invalid username or password");
  }

  const tokens = await issueTokens(user);

  return { user, ...tokens };
}

export async function refreshSession(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);

  if (payload.type !== "refresh") {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken),
  });

  if (!stored) {
    throw ApiError.unauthorized("Refresh token has been revoked");
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw ApiError.unauthorized("User for this token no longer exists");
  }

  await RefreshToken.deleteOne({ _id: stored._id });
  const tokens = await issueTokens(user);

  return { user, ...tokens };
}

export async function logoutUser(userId) {
  await RefreshToken.deleteMany({ userId });
}

export function sanitizeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}