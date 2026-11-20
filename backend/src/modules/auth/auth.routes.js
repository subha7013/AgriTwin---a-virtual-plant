import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validation.js";
import {
  register,
  login,
  refresh,
  logout,
  me,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", validate(refreshSchema), refresh);
authRouter.post("/logout", protect, logout);
authRouter.get("/me", protect, me);