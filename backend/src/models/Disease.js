import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    symptoms: { type: [String], default: [] },
    causes: { type: [String], default: [] },
    prevention: { type: [String], default: [] },
    referenceImage: { type: String, default: "" },
    isHealthy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Disease = mongoose.model("Disease", diseaseSchema);