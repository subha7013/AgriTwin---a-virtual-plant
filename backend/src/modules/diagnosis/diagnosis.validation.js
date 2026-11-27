import { z } from "zod";

export const createDiagnosisSchema = z.object({
  plantId: z.string().optional(),
});

export const updateDiagnosisSchema = z.object({
  plantId: z.string().optional(),
  disease: z.string().optional(),
  confidence: z.number().optional(),
  riskLevel: z.string().optional(),
});

export default { createDiagnosisSchema, updateDiagnosisSchema };
