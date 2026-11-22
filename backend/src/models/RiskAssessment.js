import mongoose from "mongoose";

const riskAssessmentSchema = new mongoose.Schema(
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
    riskScore: {
      type: Number,
      required: true, // 0 - 100
    },
    riskCategory: {
      type: String,
      enum: ["Low Risk", "Moderate Risk", "High Risk"],
      required: true,
      index: true,
    },
    inputTelemetry: {
      temperature_c: { type: Number, required: true },
      relative_humidity_pct: { type: Number, required: true },
      soil_moisture_pct: { type: Number, required: true },
      leaf_wetness_pct: { type: Number, required: true },
    },
    probabilities: {
      High: { type: Number, default: 0 },
      Moderate: { type: Number, default: 0 },
      Low: { type: Number, default: 0 },
    },
    factors: [
      {
        name: String,
        value: String,
        severity: String,
        desc: String,
      },
    ],
    recommendations: {
      type: [String],
      default: [],
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

riskAssessmentSchema.index({ plant: 1, evaluatedAt: -1 });

export const RiskAssessment = mongoose.model("RiskAssessment", riskAssessmentSchema);
