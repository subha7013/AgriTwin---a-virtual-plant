import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Critical", "Warning", "Info"],
      default: "Info",
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Temperature",
        "Soil Moisture",
        "Humidity",
        "Disease Risk",
        "Plant Health",
        "Sensor Node",
        "General",
      ],
      default: "General",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ user: 1, read: 1, resolved: 1 });
alertSchema.index({ user: 1, createdAt: -1 });

export const Alert = mongoose.model("Alert", alertSchema);
