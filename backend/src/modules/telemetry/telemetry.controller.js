import {
  submitTelemetry,
  getTelemetry,
  getLatestTelemetry,
  getTelemetryStats,
  getRecentAlerts,
  getPlantTelemetrySummary,
} from "./telemetry.service.js";

/**
 * POST /api/v1/telemetry
 * Submit sensor/telemetry data
 */
export async function submitTelemetryHandler(req, res, next) {
  try {
    const { plantId, sensorType, value, timestamp, location } = req.body;

    const telemetry = await submitTelemetry({
      plantId,
      sensorType,
      value,
      timestamp,
      location,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      data: telemetry,
      message: "Telemetry data recorded successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/telemetry
 * Get telemetry data with optional filters
 */
export async function getTelemetryHandler(req, res, next) {
  try {
    const { plantId, sensorType, limit, skip, startDate, endDate } = req.query;

    const telemetry = await getTelemetry(req.user._id, {
      plantId,
      sensorType,
      limit: parseInt(limit) || 50,
      skip: parseInt(skip) || 0,
      startDate,
      endDate,
    });

    res.json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/telemetry/latest
 * Get latest telemetry for a specific plant
 */
export async function getLatestTelemetryHandler(req, res, next) {
  try {
    const { plantId } = req.query;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: { message: "plantId query parameter is required" },
      });
    }

    const telemetry = await getLatestTelemetry(req.user._id, plantId);

    if (!telemetry) {
      return res.status(404).json({
        success: false,
        error: { message: "No telemetry data found for this plant" },
      });
    }

    res.json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/telemetry/stats
 * Get aggregated telemetry statistics
 */
export async function getTelemetryStatsHandler(req, res, next) {
  try {
    const { plantId, sensorType } = req.query;

    const stats = await getTelemetryStats(req.user._id, plantId, sensorType);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/telemetry/alerts
 * Get recent alerts from telemetry
 */
export async function getRecentAlertsHandler(req, res, next) {
  try {
    const { limit, type } = req.query;

    const alerts = await getRecentAlerts(req.user._id, {
      limit: parseInt(limit) || 10,
      type,
    });

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/telemetry/summary
 * Get telemetry summary for a plant
 */
export async function getPlantTelemetrySummaryHandler(req, res, next) {
  try {
    const { plantId } = req.query;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: { message: "plantId query parameter is required" },
      });
    }

    const summary = await getPlantTelemetrySummary(req.user._id, plantId);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  submitTelemetryHandler,
  getTelemetryHandler,
  getLatestTelemetryHandler,
  getTelemetryStatsHandler,
  getRecentAlertsHandler,
  getPlantTelemetrySummaryHandler,
};
