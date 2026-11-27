import { Router } from "express";
import mongoose from "mongoose";
import { authRouter } from "./modules/auth/auth.routes.js";
import { plantRouter } from "./modules/plants/plant.routes.js";
import { diseaseRouter } from "./modules/diseases/disease.routes.js";
import { diagnosisRouter } from "./modules/diagnosis/diagnosis.routes.js";
import { telemetryRouter } from "./modules/telemetry/telemetry.routes.js";
import { alertsRouter } from "./modules/alerts/alerts.routes.js";
import { riskRouter } from "./modules/risk/risk.routes.js";

export const routes = Router();

routes.get("/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState] || "unknown";

  res.json({
    success: true,
    data: {
      status: dbState === "connected" ? "ok" : "degraded",
      database: dbState,
      uptime: Math.round(process.uptime()),
    },
  });
});

routes.use("/auth", authRouter);
routes.use("/plants", plantRouter);
routes.use("/diseases", diseaseRouter);
routes.use("/diagnosis", diagnosisRouter);
routes.use("/telemetry", telemetryRouter);
routes.use("/alerts", alertsRouter);
routes.use("/risk", riskRouter);