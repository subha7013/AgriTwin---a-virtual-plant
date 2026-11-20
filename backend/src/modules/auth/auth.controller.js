import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  sanitizeUser,
} from "./auth.service.js";

export async function register(req, res) {
  const user = await registerUser(req.body);

  res.status(201).json({
    success: true,
    data: { user: sanitizeUser(user) },
    message: "Registration successful",
  });
}

export async function login(req, res) {
  const { user, accessToken, refreshToken } = await loginUser(req.body);

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
}

export async function refresh(req, res) {
  const { user, accessToken, refreshToken } = await refreshSession(
    req.body.refreshToken
  );

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
}

export async function logout(req, res) {
  await logoutUser(req.user._id);

  res.json({
    success: true,
    data: null,
    message: "Logged out successfully",
  });
}

export async function me(req, res) {
  res.json({
    success: true,
    data: { user: sanitizeUser(req.user) },
  });
}