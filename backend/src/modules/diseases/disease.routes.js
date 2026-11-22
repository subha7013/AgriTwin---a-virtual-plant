import { Router } from "express";
import multer from "multer";
import path from "path";
import os from "os";
import fs from "fs";
import {
  getAllDiseases,
  getOneDisease,
  detectDisease,
  predictRisk,
} from "./disease.controller.js";
import { optionalAuth } from "../../middlewares/auth.js";

const uploadDir = path.join(os.tmpdir(), "agritwin_uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max file size
});

export const diseaseRouter = Router();

diseaseRouter.get("/", getAllDiseases);
diseaseRouter.post("/detect", optionalAuth, upload.single("image"), detectDisease);
diseaseRouter.post("/predict-risk", predictRisk);
diseaseRouter.get("/risk-status", predictRisk);
diseaseRouter.get("/:slug", getOneDisease);
