import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { routes } from "./routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

export const app = express();

const rawOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/+$/, ""));
const allowedOrigins = Array.from(new Set([
  ...rawOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000"
]));

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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