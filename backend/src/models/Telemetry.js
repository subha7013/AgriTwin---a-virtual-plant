import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      default: null,
      index: true,
    },
    nodeId: {
      type: String,
      default: "ESP32_NODE_01",
      trim: true,
      index: true,
    },
    sensorType: {
      type: String,
      required: true,
      enum: ["temperature", "humidity", "soil_moisture", "light", "ph", "ec"],
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    temperature: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    soilMoisture: {
      type: Number,
    },
    lightIntensity: {
      type: Number,
    },
    leafWetness: {
      type: Number,
      default: 0,
    },
    batteryLevel: {
      type: Number,
      default: 98,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

telemetrySchema.index({ plant: 1, recordedAt: -1 });
telemetrySchema.index({ nodeId: 1, recordedAt: -1 });

export const Telemetry = mongoose.model("Telemetry", telemetrySchema);
