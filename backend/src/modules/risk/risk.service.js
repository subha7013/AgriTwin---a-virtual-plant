import mongoose from "mongoose";
import { RiskAssessment, Diagnosis, Telemetry } from "../../models/index.js";

/**
 * Assess risk for a plant using:
 *   - latest diagnosis (disease pressure)
 *   - latest environmental telemetry (temperature/humidity/soil/leaf wetness)
 *
 * Produces a document that conforms to the RiskAssessment schema:
 *   riskScore (0-100), riskCategory (Low/Moderate/High Risk),
 *   inputTelemetry {temperature_c, relative_humidity_pct, soil_moisture_pct, leaf_wetness_pct}
 */
export async function assessRisk({ plantId, diagnosisId, user }) {
  // Latest diagnosis (explicit id, else most recent for this plant)
  let diagnosis = null;
  if (diagnosisId) {
    diagnosis = await Diagnosis.findById(diagnosisId);
  } else if (plantId) {
    diagnosis = await Diagnosis.findOne({ plant: plantId }).sort({ diagnosedAt: -1 });
  }

  // Latest telemetry readings for the plant
  const rows = await Telemetry.aggregate([
    { $match: { plant: plantId ? toObjectId(plantId) : null } },
    { $sort: { recordedAt: -1 } },
    { $group: { _id: "$sensorType", value: { $first: "$value" } } },
  ]);
  const reading = {};
  rows.forEach((r) => {
    reading[r._id] = r.value;
  });

  const temperature = numOr(reading["temperature"], 25);
  const humidity = numOr(reading["humidity"], 60);
  const soilMoisture = numOr(reading["soil_moisture"], 45);
  const leafWetness = numOr(reading["leaf_wetness"], 0);

  const { score, factors } = computeRisk({
    diagnosis,
    temperature,
    humidity,
    soilMoisture,
    leafWetness,
  });

  const riskCategory = categoryFromScore(score);
  const recommendations = buildRecommendations(diagnosis, {
    temperature,
    humidity,
    soilMoisture,
  });

  const assessment = await RiskAssessment.create({
    user: user._id,
    plant: plantId || null,
    riskScore: Math.round(score),
    riskCategory,
    inputTelemetry: {
      temperature_c: temperature,
      relative_humidity_pct: humidity,
      soil_moisture_pct: soilMoisture,
      leaf_wetness_pct: leafWetness,
    },
    probabilities: {
      High: Math.round(score) / 100,
      Moderate: Math.round(100 - Math.abs(score - 50) * 2) / 100,
      Low: Math.round(100 - score) / 100,
    },
    factors,
    recommendations,
  });

  return assessment;
}

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

function numOr(v, fallback) {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

function computeRisk({ diagnosis, temperature, humidity, soilMoisture, leafWetness }) {
  let score = 0;
  const factors = [];

  // Disease pressure (up to 50 points)
  if (diagnosis && !diagnosis.isHealthy) {
    const diseasePoints = Math.min(50, diagnosis.confidence * 50);
    score += diseasePoints;
    factors.push({
      name: "Disease Pressure",
      value: diagnosis.disease,
      severity: diagnosis.confidence > 0.85 ? "High" : "Moderate",
      desc: `Model confidence ${(diagnosis.confidence * 100).toFixed(1)}%`,
    });
  }

  // Temperature (up to 15 points)
  if (temperature > 35 || temperature < 10) {
    score += 15;
    factors.push({
      name: "Temperature",
      value: `${temperature}°C`,
      severity: "High",
      desc: "Outside optimal 10–35°C range",
    });
  } else if (temperature > 30) {
    score += 7;
    factors.push({
      name: "Temperature",
      value: `${temperature}°C`,
      severity: "Moderate",
      desc: "Approaching upper optimal limit",
    });
  }

  // Humidity (up to 15 points)
  if (humidity > 85 || humidity < 30) {
    score += 15;
    factors.push({
      name: "Humidity",
      value: `${humidity}%`,
      severity: "High",
      desc: "Outside optimal 30–85% range",
    });
  } else if (humidity > 80) {
    score += 8;
    factors.push({
      name: "Humidity",
      value: `${humidity}%`,
      severity: "Moderate",
      desc: "High humidity favours fungal disease",
    });
  }

  // Soil moisture (up to 10 points)
  if (soilMoisture < 15) {
    score += 10;
    factors.push({
      name: "Soil Moisture",
      value: `${soilMoisture}%`,
      severity: "High",
      desc: "Below 15% — water stress",
    });
  } else if (soilMoisture < 25) {
    score += 5;
    factors.push({
      name: "Soil Moisture",
      value: `${soilMoisture}%`,
      severity: "Moderate",
      desc: "Low soil moisture",
    });
  }

  // Leaf wetness (up to 10 points)
  if (leafWetness > 60) {
    score += 10;
    factors.push({
      name: "Leaf Wetness",
      value: `${leafWetness}%`,
      severity: "Moderate",
      desc: "Prolonged leaf wetness increases infection risk",
    });
  }

  return { score: Math.min(100, score), factors };
}

function categoryFromScore(score) {
  if (score >= 67) return "High Risk";
  if (score >= 34) return "Moderate Risk";
  return "Low Risk";
}

function buildRecommendations(diagnosis, env) {
  const recs = [];
  if (diagnosis && !diagnosis.isHealthy) {
    recs.push(`Monitor ${diagnosis.disease} closely and consider treatment.`);
    if (diagnosis.disease.toLowerCase().includes("blight")) {
      recs.push("Reduce leaf wetness and improve air circulation.");
    }
  }
  if (env.temperature > 35) recs.push("Provide shade to reduce heat stress.");
  if (env.humidity > 85) recs.push("Improve ventilation to reduce humidity.");
  if (env.soilMoisture < 15) recs.push("Increase watering frequency.");
  if (recs.length === 0) recs.push("Conditions are within normal range — continue routine monitoring.");
  return recs;
}

/**
 * Get risk assessments for a user.
 */
export async function getRiskAssessments(userId, options = {}) {
  const { limit = 20, skip = 0, plantId = null } = options;
  const query = { user: userId };
  if (plantId) query.plant = plantId;

  return await RiskAssessment.find(query)
    .populate(["plant"])
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
}

/**
 * Get a single risk assessment.
 */
export async function getRiskAssessmentById(assessmentId, userId) {
  return await RiskAssessment.findOne({ _id: assessmentId, user: userId }).populate("plant");
}

/**
 * Latest risk assessment for a plant.
 */
export async function getLatestRiskAssessment(userId, plantId) {
  return await RiskAssessment.findOne({ user: userId, plant: plantId }).sort({
    createdAt: -1,
  });
}

/**
 * Risk statistics for a user.
 */
export async function getRiskStats(userId) {
  const total = await RiskAssessment.countDocuments({ user: userId });
  const high = await RiskAssessment.countDocuments({ user: userId, riskCategory: "High Risk" });
  const moderate = await RiskAssessment.countDocuments({ user: userId, riskCategory: "Moderate Risk" });
  const low = await RiskAssessment.countDocuments({ user: userId, riskCategory: "Low Risk" });

  const avg = await RiskAssessment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, avgScore: { $avg: "$riskScore" } } },
  ]);

  return {
    total,
    high,
    moderate,
    low,
    averageScore: avg[0]?.avgScore || 0,
  };
}

export default {
  assessRisk,
  getRiskAssessments,
  getRiskAssessmentById,
  getLatestRiskAssessment,
  getRiskStats,
};