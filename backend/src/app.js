import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { routes } from "./routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.debug(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: { name: "AgriTwin API", version: "1.0.0" },
  });
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);