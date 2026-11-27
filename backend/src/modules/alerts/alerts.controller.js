import {
  getAlerts,
  getAlertById,
  markAlertRead,
  resolveAlert,
  deleteAlert,
  getAlertStats,
} from "./alerts.service.js";

/**
 * GET /api/v1/alerts
 */
export async function getAllAlerts(req, res, next) {
  try {
    const { limit = 20, skip = 0, type, category, read, resolved, plantId, startDate, endDate } =
      req.query;

    const alerts = await getAlerts(req.user._id, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      type,
      category,
      read,
      resolved,
      plantId,
      startDate,
      endDate,
    });

    res.json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/alerts/stats
 */
export async function getAlertStatsHandler(req, res, next) {
  try {
    const stats = await getAlertStats(req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/alerts/:id
 */
export async function getAlertByIdHandler(req, res, next) {
  try {
    const alert = await getAlertById(req.params.id, req.user._id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: { message: "Alert not found" },
      });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/alerts/:id/read
 */
export async function markAlertReadHandler(req, res, next) {
  try {
    const alert = await markAlertRead(req.params.id, req.user._id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: { message: "Alert not found" },
      });
    }
    res.json({ success: true, data: alert, message: "Alert marked as read" });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/alerts/:id/resolve
 */
export async function resolveAlertHandler(req, res, next) {
  try {
    const { resolution } = req.body;
    const alert = await resolveAlert(req.params.id, req.user._id, resolution);
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: { message: "Alert not found" },
      });
    }
    res.json({ success: true, data: alert, message: "Alert resolved" });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/alerts/:id
 */
export async function deleteAlertHandler(req, res, next) {
  try {
    const result = await deleteAlert(req.params.id, req.user._id);
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: { message: "Alert not found" },
      });
    }
    res.json({ success: true, message: "Alert deleted" });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllAlerts,
  getAlertStatsHandler,
  getAlertByIdHandler,
  markAlertReadHandler,
  resolveAlertHandler,
  deleteAlertHandler,
};