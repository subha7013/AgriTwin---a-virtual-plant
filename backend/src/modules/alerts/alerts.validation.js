import { z } from "zod";

export const updateAlertSchema = z.object({
  read: z.boolean().optional(),
  resolved: z.boolean().optional(),
  resolution: z.string().optional(),
});

export const createAlertSchema = z.object({
  plantId: z.string().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["Critical", "Warning", "Info"]).optional(),
  category: z
    .enum([
      "Temperature",
      "Soil Moisture",
      "Humidity",
      "Disease Risk",
      "Plant Health",
      "Sensor Node",
      "General",
    ])
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export default { createAlertSchema, updateAlertSchema };