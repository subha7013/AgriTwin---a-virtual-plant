import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    species: { type: String, default: "tomato", trim: true },
    variety: { type: String, trim: true, default: "" },
    growthStage: {
      type: String,
      enum: ["seedling", "vegetative", "flowering", "fruiting"],
      default: "seedling",
    },
    plantedAt: { type: Date, default: Date.now },
    health: {
      type: String,
      enum: ["healthy", "diseased", "unknown"],
      default: "unknown",
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

plantSchema.index({ owner: 1, createdAt: -1 });

export const Plant = mongoose.model("Plant", plantSchema);