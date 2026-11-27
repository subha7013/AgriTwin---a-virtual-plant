import { z } from "zod";

export const createRiskSchema = z.object({
  plantId: z.string(),
  diagnosisId: z.string().optional(),
  severityFactors: z.object({
    hasDisease: z.boolean().optional(),
    diagnosisConfidence: z.number().optional(),
    weatherRisk: z.number().optional(),
    historicalIssues: z.number().optional(),
  }).optional(),
});

export const updateRiskSchema = z.object({
  riskLevel: z.enum(["Low", "Medium", "High"]).optional(),
  riskScore: z.number().optional(),
  recommendations: z.array(z.string()).optional(),
});

export default { createRiskSchema, updateRiskSchema };
