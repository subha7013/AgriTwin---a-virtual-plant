import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { updateAlertSchema } from "./alerts.validation.js";
import * as alertsController from "./alerts.controller.js";

export const alertsRouter = Router();

alertsRouter.use(protect);

// Specific routes must be declared before the "/:id" catch-all
alertsRouter.get("/", alertsController.getAllAlerts);
alertsRouter.get("/stats", alertsController.getAlertStatsHandler);

alertsRouter.get("/:id", alertsController.getAlertByIdHandler);
alertsRouter.post("/:id/read", alertsController.markAlertReadHandler);
alertsRouter.post("/:id/resolve", validate(updateAlertSchema), alertsController.resolveAlertHandler);
alertsRouter.delete("/:id", alertsController.deleteAlertHandler);

export default alertsRouter;