import mongoose from "mongoose";
import { Alert } from "../../models/index.js";

/**
 * Map an internal severity to the Alert.type enum.
 */
function severityToType(severity) {
  if (severity === "high") return "Critical";
  if (severity === "medium") return "Warning";
  return "Info";
}

/**
 * Get all alerts for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - List of alerts
 */
export async function getAlerts(userId, options = {}) {
  const {
    limit = 20,
    skip = 0,
    type = null,
    category = null,
    read = null,
    resolved = null,
    plantId = null,
    startDate = null,
    endDate = null,
  } = options;

  const query = { user: userId };
  if (type) query.type = type;
  if (category) query.category = category;
  if (read !== null && read !== undefined) query.read = read === "true" || read === true;
  if (resolved !== null && resolved !== undefined) query.resolved = resolved === "true" || resolved === true;
  if (plantId) query.plant = plantId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  return await Alert.find(query)
    .populate("plant")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
}

/**
 * Get single alert by ID
 */
export async function getAlertById(alertId, userId) {
  return await Alert.findOne({ _id: alertId, user: userId }).populate("plant");
}

/**
 * Mark alert as read
 */
export async function markAlertRead(alertId, userId) {
  return await Alert.findOneAndUpdate(
    { _id: alertId, user: userId },
    { read: true },
    { new: true }
  );
}

/**
 * Mark alert as resolved
 */
export async function resolveAlert(alertId, userId, resolution = "") {
  return await Alert.findOneAndUpdate(
    { _id: alertId, user: userId },
    {
      resolved: true,
      read: true,
      ...(resolution ? { "metadata.resolution": resolution } : {}),
    },
    { new: true }
  );
}

/**
 * Delete an alert
 */
export async function deleteAlert(alertId, userId) {
  return await Alert.deleteOne({ _id: alertId, user: userId });
}

/**
 * Get alert statistics
 */
export async function getAlertStats(userId) {
  const total = await Alert.countDocuments({ user: userId });
  const unread = await Alert.countDocuments({ user: userId, read: false });
  const resolved = await Alert.countDocuments({ user: userId, resolved: true });
  const critical = await Alert.countDocuments({ user: userId, type: "Critical" });

  const byCategory = await Alert.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  return {
    total,
    unread,
    resolved,
    critical,
    byCategory,
  };
}

/**
 * Generate ML-based alert from a diagnosis.
 * Uses the Alert schema: title/message/type/category/metadata.
 */
export async function generateDiagnosisAlert(diagnosis, userId) {
  if (diagnosis.isHealthy || diagnosis.confidence < 0.8) {
    return null;
  }

  let type = "Info";
  if (diagnosis.confidence > 0.9) type = "Critical";
  else if (diagnosis.confidence > 0.85) type = "Warning";

  return await Alert.create({
    user: userId,
    plant: diagnosis.plant || null,
    title: `Disease detected: ${diagnosis.disease}`,
    message: `High confidence detection of ${diagnosis.disease} (${Math.round(
      diagnosis.confidence * 100
    )}%).`,
    type,
    category: "Disease Risk",
    metadata: {
      diagnosisId: diagnosis._id,
      disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      riskLevel: diagnosis.riskLevel,
    },
  });
}

/**
 * Create an alert from a telemetry-driven condition.
 * @param {Object} params
 */
export async function createTelemetryAlert({
  userId,
  plantId,
  title,
  message,
  severity = "low",
  category = "General",
  metadata = {},
}) {
  return await Alert.create({
    user: userId,
    plant: plantId || null,
    title,
    message,
    type: severityToType(severity),
    category,
    metadata,
  });
}

export default {
  getAlerts,
  getAlertById,
  markAlertRead,
  resolveAlert,
  deleteAlert,
  getAlertStats,
  generateDiagnosisAlert,
  createTelemetryAlert,
};