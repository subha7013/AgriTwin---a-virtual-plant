import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    diseaseAlerts: {
      type: Boolean,
      default: true,
    },
    sensorAlerts: {
      type: Boolean,
      default: true,
    },
    weeklyReports: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ["Light", "Dark", "System"],
      default: "Light",
    },
    telemetryRefreshRateSeconds: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
