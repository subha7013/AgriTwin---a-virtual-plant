import { z } from "zod";

const fields = {
  name: z.string().trim().min(1, "Plant name is required").max(120),
  species: z.string().trim().max(60).optional(),
  variety: z.string().trim().max(60).optional(),
  growthStage: z
    .enum(["seedling", "vegetative", "flowering", "fruiting"])
    .optional(),
  plantedAt: z.coerce.date().optional(),
  health: z.enum(["healthy", "diseased", "unknown"]).optional(),
  imageUrl: z.string().trim().url("Image URL must be valid").optional().or(z.literal("")),
};

export const createPlantSchema = z.object(fields);

export const updatePlantSchema = z
  .object(fields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });