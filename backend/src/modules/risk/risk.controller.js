import {
  assessRisk,
  getRiskAssessments,
  getRiskAssessmentById,
  getLatestRiskAssessment,
  getRiskStats,
} from "./risk.service.js";

/**
 * POST /api/v1/risk
 * Assess risk for a plant
 */
export async function assessRiskHandler(req, res, next) {
  try {
    const { plantId, diagnosisId } = req.body;

    const riskAssessment = await assessRisk({
      plantId,
      diagnosisId,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      data: riskAssessment,
      message: "Risk assessment completed successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/risk
 * Get all risk assessments for current user
 */
export async function getRiskAssessmentsHandler(req, res, next) {
  try {
    const { limit = 20, skip = 0, plantId } = req.query;

    const assessments = await getRiskAssessments(req.user._id, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      plantId,
    });

    res.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/risk/:id
 * Get single risk assessment by ID
 */
export async function getRiskAssessmentByIdHandler(req, res, next) {
  try {
    const { id } = req.params;

    const assessment = await getRiskAssessmentById(id, req.user._id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: { message: "Risk assessment not found" },
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/risk/latest
 * Get latest risk assessment for a plant
 */
export async function getLatestRiskAssessmentHandler(req, res, next) {
  try {
    const { plantId } = req.query;

    if (!plantId) {
      return res.status(400).json({
        success: false,
        error: { message: "plantId query parameter is required" },
      });
    }

    const assessment = await getLatestRiskAssessment(req.user._id, plantId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: { message: "No risk assessment found for this plant" },
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/risk/stats
 * Get risk statistics for current user
 */
export async function getRiskStatsHandler(req, res, next) {
  try {
    const stats = await getRiskStats(req.user._id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  assessRiskHandler,
  getRiskAssessmentsHandler,
  getRiskAssessmentByIdHandler,
  getLatestRiskAssessmentHandler,
  getRiskStatsHandler,
};
