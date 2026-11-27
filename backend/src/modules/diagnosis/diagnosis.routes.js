import { Router } from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createDiagnosisSchema } from "./diagnosis.validation.js";
import * as diagnosisController from "./diagnosis.controller.js";

export const diagnosisRouter = Router();

// Apply auth middleware to all routes
diagnosisRouter.use(protect);

// Configure multer for file uploads
const upload = multer({
  dest: "backend/uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    }
  },
});

// Routes
diagnosisRouter.post(
  "/diagnose",
  upload.single("image"),
  validate(createDiagnosisSchema),
  diagnosisController.diagnose
);

diagnosisRouter.get("/diagnoses", diagnosisController.getAllDiagnoses);
diagnosisRouter.get("/diagnoses/:id", diagnosisController.getDiagnosisByIdHandler);
diagnosisRouter.delete("/diagnoses/:id", diagnosisController.deleteDiagnosisHandler);
diagnosisRouter.get("/stats", diagnosisController.getDiagnosisStatsHandler);

export default diagnosisRouter;
