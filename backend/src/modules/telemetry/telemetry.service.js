import mongoose from "mongoose";
import { Telemetry, Alert, Plant } from "../../models/index.js";

/**
 * Resolve the Mongo ObjectIds of all plants owned by a user.
 */
async function getUserPlantIds(userId) {
  const plants = await Plant.find({ owner: userId }).select("_id").lean();
  return plants.map((p) => p._id);
}

/**
 * Submit telemetry/sensor data.
 * Telemetry is linked to a plant (which is owned by the user). There is no
 * user field on the Telemetry schema; ownership flows through the plant.
 */
export async function submitTelemetry({ plantId, sensorType, value, timestamp, location, user }) {
  const doc = {
    plant: plantId || null,
    sensorType,
    value,
    location: location || "",
    recordedAt: timestamp ? new Date(timestamp) : new Date(),
  };

  // Mirror into the legacy numeric fields for backward compatibility.
  if (sensorType === "temperature") doc.temperature = value;
  else if (sensorType === "humidity") doc.humidity = value;
  else if (sensorType === "soil_moisture") doc.soilMoisture = value;
  else if (sensorType === "light") doc.lightIntensity = value;

  const telemetry = await Telemetry.create(doc);

  await checkAlerts(telemetry, user);

  return telemetry;
}

/**
 * Get telemetry data scoped to the user's plants.
 */
export async function getTelemetry(userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    plantId = null,
    sensorType = null,
    startDate = null,
    endDate = null,
  } = options;

  const plantIds = await getUserPlantIds(userId);
  const query = { plant: { $in: plantIds } };
  if (plantId) query.plant = plantId;
  if (sensorType) query.sensorType = sensorType;

  if (startDate || endDate) {
    query.recordedAt = {};
    if (startDate) query.recordedAt.$gte = new Date(startDate);
    if (endDate) query.recordedAt.$lte = new Date(endDate);
  }

  return await Telemetry.find(query)
    .sort({ recordedAt: -1 })
    .limit(limit)
    .skip(skip);
}

/**
 * Get latest telemetry reading for a plant.
 */
export async function getLatestTelemetry(userId, plantId) {
  return await Telemetry.findOne({ plant: plantId }).sort({ recordedAt: -1 });
}

/**
 * Get aggregated telemetry statistics for a user/plant.
 */
export async function getTelemetryStats(userId, plantId, sensorType) {
  const plantIds = await getUserPlantIds(userId);
  const query = { plant: { $in: plantIds } };
  if (plantId) query.plant = plantId;
  if (sensorType) query.sensorType = sensorType;

  return await Telemetry.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$sensorType",
        avgValue: { $avg: "$value" },
        minVal: { $min: "$value" },
        maxVal: { $max: "$value" },
        count: { $sum: 1 },
        latestTimestamp: { $max: "$recordedAt" },
      },
    },
  ]);
}

/**
 * Latest reading per sensor type for a plant (used by risk assessment).
 */
export async function getLatestReadingsByType(userId, plantId) {
  const plantIds = await getUserPlantIds(userId);
  const query =
    plantId && plantId !== "null"
      ? { plant: plantId }
      : { plant: { $in: plantIds } };

  const rows = await Telemetry.aggregate([
    { $match: query },
    { $sort: { recordedAt: -1 } },
    { $group: { _id: "$sensorType", value: { $first: "$value" } } },
  ]);

  const map = {};
  rows.forEach((r) => {
    map[r._id] = r.value;
  });
  return map;
}

/**
 * Check whether a telemetry reading triggers alerts, creating Alert documents
 * that conform to the Alert schema (title/message/type/category/metadata).
 */
export async function checkAlerts(telemetry, user) {
  if (!user || !user._id) return;

  const alerts = [];

  if (telemetry.sensorType === "temperature") {
    if (telemetry.value > 35) {
      alerts.push({
        title: "High temperature detected",
        message: `Temperature is ${telemetry.value}°C, above the 35°C safe threshold.`,
        type: telemetry.value > 40 ? "Critical" : "Warning",
        category: "Temperature",
      });
    } else if (telemetry.value < 10) {
      alerts.push({
        title: "Low temperature detected",
        message: `Temperature is ${telemetry.value}°C, below the 10°C safe threshold.`,
        type: telemetry.value < 5 ? "Critical" : "Warning",
        category: "Temperature",
      });
    }
  }

  if (telemetry.sensorType === "humidity") {
    if (telemetry.value > 85) {
      alerts.push({
        title: "High humidity detected",
        message: `Humidity is ${telemetry.value}%, favouring fungal disease development.`,
        type: "Warning",
        category: "Humidity",
      });
    } else if (telemetry.value < 30) {
      alerts.push({
        title: "Low humidity detected",
        message: `Humidity is ${telemetry.value}%, below the 30% safe threshold.`,
        type: "Warning",
        category: "Humidity",
      });
    }
  }

  if (telemetry.sensorType === "soil_moisture" && telemetry.value < 15) {
    alerts.push({
      title: "Low soil moisture",
      message: `Soil moisture is ${telemetry.value}%, below the 15% safe threshold.`,
      type: telemetry.value < 10 ? "Critical" : "Warning",
      category: "Soil Moisture",
    });
  }

  if (telemetry.sensorType === "ph" && (telemetry.value < 5.5 || telemetry.value > 7.5)) {
    alerts.push({
      title: "pH out of optimal range",
      message: `Soil pH is ${telemetry.value}, outside the 5.5–7.5 optimal range.`,
      type: "Warning",
      category: "Soil Moisture",
    });
  }

  if (alerts.length === 0) return;

  const docs = alerts.map((a) => ({
    user: user._id,
    plant: telemetry.plant || null,
    title: a.title,
    message: a.message,
    type: a.type,
    category: a.category,
    metadata: {
      sensorType: telemetry.sensorType,
      value: telemetry.value,
      telemetryId: telemetry._id,
    },
  }));

  await Alert.insertMany(docs);
}

/**
 * Get recent alerts for a user.
 */
export async function getRecentAlerts(userId, options = {}) {
  const { limit = 10, type = null } = options;

  const query = { user: userId };
  if (type) query.type = type;

  return await Alert.find(query).sort({ createdAt: -1 }).limit(limit);
}

/**
 * Telemetry summary (latest reading per sensor type) for a plant.
 */
export async function getPlantTelemetrySummary(userId, plantId) {
  const rows = await Telemetry.aggregate([
    { $match: { plant: new mongoose.Types.ObjectId(plantId) } },
    { $sort: { recordedAt: -1 } },
    { $group: { _id: "$sensorType", data: { $first: "$$ROOT" } } },
  ]);

  const summary = {};
  rows.forEach((item) => {
    summary[item._id] = item.data;
  });

  return summary;
}

export default {
  submitTelemetry,
  getTelemetry,
  getLatestTelemetry,
  getTelemetryStats,
  getLatestReadingsByType,
  getRecentAlerts,
  getPlantTelemetrySummary,
};