import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createTelemetrySchema } from "./telemetry.validation.js";
import * as telemetryController from "./telemetry.controller.js";

export const telemetryRouter = Router();

// Apply auth middleware to all routes
telemetryRouter.use(protect);

// Routes
telemetryRouter.post("/", validate(createTelemetrySchema), telemetryController.submitTelemetryHandler);
telemetryRouter.get("/", telemetryController.getTelemetryHandler);
telemetryRouter.get("/latest", telemetryController.getLatestTelemetryHandler);
telemetryRouter.get("/stats", telemetryController.getTelemetryStatsHandler);
telemetryRouter.get("/alerts", telemetryController.getRecentAlertsHandler);
telemetryRouter.get("/summary", telemetryController.getPlantTelemetrySummaryHandler);

export default telemetryRouter;
