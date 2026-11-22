import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw ApiError.unauthorized("Access token is required");
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-passwordHash");

    if (!user) {
      throw ApiError.unauthorized("User for this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub).select("-passwordHash");
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Continue unauthenticated if token invalid or expired
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission for this action"));
    }
    next();
  };
}