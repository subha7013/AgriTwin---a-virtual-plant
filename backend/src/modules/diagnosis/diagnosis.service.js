import mongoose from "mongoose";
import { Diagnosis } from "../../models/index.js";
import { mlClient } from "../../utils/ml-client.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

/**
 * Perform disease diagnosis from uploaded image
 * @param {Object} params - Diagnosis parameters
 * @param {string} params.filePath - Local path to uploaded image
 * @param {string} params.plantId - Associated plant ID
 * @param {Object} params.user - User object
 * @returns {Promise<Object>} - Created diagnosis
 */
export async function createDiagnosis({ filePath, plantId, user }) {
  try {
    // Check ML service availability
    const mlAvailable = await mlClient.isAvailable();
    if (!mlAvailable) {
      throw new Error("ML service is unavailable. Please try again later.");
    }

    // Call ML service for prediction
    const mlResult = await mlClient.predict(filePath);

    if (!mlResult.success) {
      throw new Error(mlResult.error || "Prediction failed");
    }

    // Derive health state from the predicted class (ML service returns the
    // disease label only; "healthy" appears in that label for healthy plants).
    const isHealthy = /healthy/i.test(mlResult.disease || "");

    // Calculate risk level based on diagnosis
    const riskLevel = calculateRiskLevel(
      mlResult.confidence,
      mlResult.disease,
      isHealthy
    );

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(filePath, {
      folder: "agritwin/diagnoses",
      public_id: `diagnosis_${Date.now()}`,
    });

    // Create diagnosis record
    const diagnosis = await Diagnosis.create({
      user: user._id,
      plant: plantId || null,
      disease: mlResult.disease,
      diseaseSlug: mlResult.disease.toLowerCase().replace(/\s+/g, "_"),
      rawClass: mlResult.class_raw || "",
      confidence: mlResult.confidence,
      isHealthy,
      riskLevel,
      model: mlResult.model,
      modelVersion: mlResult.model_version,
      imageStoragePath: cloudinaryUrl,
      probabilities: mlResult.probabilities,
    });

    return diagnosis;
  } catch (error) {
    console.error("[Diagnosis Service] Error:", error.message);
    throw error;
  }
}

/**
 * Calculate risk level based on multiple factors
 * @param {number} confidence - ML confidence score
 * @param {string} disease - Disease name
 * @param {boolean} isHealthy - Whether plant is healthy
 * @returns {string} - Risk level
 */
function calculateRiskLevel(confidence, disease, isHealthy) {
  if (isHealthy) return "Low";

  // Base risk from confidence
  let riskScore = confidence;

  // Add severity modifiers
  const severityDiseases = [
    "late blight",
    "mosaic virus",
    "yellow leaf curl virus",
  ];

  if (severityDiseases.some((d) => disease.toLowerCase().includes(d))) {
    riskScore += 0.15; // High severity
  } else if (disease.toLowerCase().includes("early blight")) {
    riskScore += 0.1; // Medium severity
  }

  // Normalize to 0-1 range
  riskScore = Math.min(1, riskScore);

  if (riskScore > 0.7) return "High";
  if (riskScore > 0.4) return "Medium";
  return "Low";
}

/**
 * Get all diagnoses for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - List of diagnoses
 */
export async function getDiagnosesForUser(userId, options = {}) {
  const { limit = 20, skip = 0, plantId = null } = options;

  const query = { user: userId };
  if (plantId) query.plant = plantId;

  return await Diagnosis.find(query)
    .populate("plant")
    .sort({ diagnosedAt: -1 })
    .limit(limit)
    .skip(skip);
}

/**
 * Get single diagnosis by ID
 * @param {string} diagnosisId - Diagnosis ID
 * @param {string} userId - User ID (for ownership check)
 * @returns {Promise<Object>} - Diagnosis object
 */
export async function getDiagnosisById(diagnosisId, userId) {
  const diagnosis = await Diagnosis.findOne({
    _id: diagnosisId,
    user: userId,
  }).populate("plant");

  return diagnosis;
}

/**
 * Delete a diagnosis
 * @param {string} diagnosisId - Diagnosis ID
 * @param {string} userId - User ID (for ownership check)
 * @returns {Promise<Object>} - Delete result
 */
export async function deleteDiagnosis(diagnosisId, userId) {
  const result = await Diagnosis.deleteOne({
    _id: diagnosisId,
    user: userId,
  });

  return result;
}

/**
 * Get statistics for diagnoses
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Statistics
 */
export async function getDiagnosisStats(userId) {
  const pipeline = [
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$disease",
        count: { $sum: 1 },
        avgConfidence: { $avg: "$confidence" },
      },
    },
    { $sort: { count: -1 } },
  ];

  const stats = await Diagnosis.aggregate(pipeline);
  const total = await Diagnosis.countDocuments({ user: userId });
  const healthyCount = await Diagnosis.countDocuments({
    user: userId,
    isHealthy: true,
  });

  return {
    total,
    healthy: healthyCount,
    unhealthy: total - healthyCount,
    breakdown: stats,
  };
}

export default {
  createDiagnosis,
  getDiagnosesForUser,
  getDiagnosisById,
  deleteDiagnosis,
  getDiagnosisStats,
};
