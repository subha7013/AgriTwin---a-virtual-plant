import { z } from "zod";

const username = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_.\s-]+$/, "Username may only contain letters, numbers, spaces, dot, dash or underscore");

const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(128, "Password must be at most 128 characters");

export const registerSchema = z.object({
  username,
  email: z.string().trim().email("A valid email is required").toLowerCase(),
  password,
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});