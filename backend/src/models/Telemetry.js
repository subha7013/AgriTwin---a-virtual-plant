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
    temperature: {
      type: Number,
      required: true, // in Celsius
    },
    humidity: {
      type: Number,
      required: true, // Relative humidity %
    },
    soilMoisture: {
      type: Number,
      required: true, // %
    },
    lightIntensity: {
      type: Number,
      default: 850, // in Lux
    },
    leafWetness: {
      type: Number,
      default: 0, // %
    },
    batteryLevel: {
      type: Number,
      default: 98, // %
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
