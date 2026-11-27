import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createRiskSchema } from "./risk.validation.js";
import * as riskController from "./risk.controller.js";

export const riskRouter = Router();

// Apply auth middleware to all routes
riskRouter.use(protect);

// Routes (specific paths must precede the "/:id" catch-all)
riskRouter.post("/", validate(createRiskSchema), riskController.assessRiskHandler);
riskRouter.get("/", riskController.getRiskAssessmentsHandler);
riskRouter.get("/latest", riskController.getLatestRiskAssessmentHandler);
riskRouter.get("/stats", riskController.getRiskStatsHandler);
riskRouter.get("/:id", riskController.getRiskAssessmentByIdHandler);

export default riskRouter;
