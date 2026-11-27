import { z } from "zod";

export const createTelemetrySchema = z.object({
  plantId: z.string(),
  sensorType: z.enum([
    "temperature",
    "humidity",
    "soil_moisture",
    "light",
    "ph",
    "ec",
  ]),
  value: z.number(),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
  location: z.string().optional(),
});

export const updateTelemetrySchema = z.object({
  value: z.number().optional(),
  location: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

export default { createTelemetrySchema, updateTelemetrySchema };
