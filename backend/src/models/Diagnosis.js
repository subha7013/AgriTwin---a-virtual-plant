import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      default: null,
      index: true,
    },
    disease: {
      type: String,
      required: true,
      trim: true,
    },
    diseaseSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    rawClass: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      required: true,
    },
    isHealthy: {
      type: Boolean,
      default: false,
      index: true,
    },
    riskLevel: {
      type: String,
      default: "Low",
    },
    model: {
      type: String,
      default: "MobileNetV2",
    },
    modelVersion: {
      type: String,
      default: "1.0",
    },
    imageStoragePath: {
      type: String,
      default: "",
    },
    probabilities: {
      type: Map,
      of: Number,
      default: {},
    },
    diagnosedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

diagnosisSchema.index({ plant: 1, diagnosedAt: -1 });
diagnosisSchema.index({ user: 1, diagnosedAt: -1 });

export const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
