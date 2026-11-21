import { app } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function start() {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(`AgriTwin API listening on http://localhost:${env.PORT}`);
    });

    async function shutdown(signal) {
      logger.info(`${signal} received, shutting down`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", reason);
});

start();