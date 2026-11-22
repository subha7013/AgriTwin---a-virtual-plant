import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    dbName: "agritwin",
    serverSelectionTimeoutMS: 10000,
  });

  const { host, name } = mongoose.connection;
  logger.info(`MongoDB connected: ${host}/${name}`);

  mongoose.connection.on("error", (error) => {
    logger.error("MongoDB connection error", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDB() {
  await mongoose.disconnect();
}