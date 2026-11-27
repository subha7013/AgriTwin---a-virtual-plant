import {
  createDiagnosis,
  getDiagnosesForUser,
  getDiagnosisById,
  deleteDiagnosis,
  getDiagnosisStats,
} from "./diagnosis.service.js";

/**
 * POST /api/v1/diagnosis/diagnose
 * Upload image and perform disease diagnosis
 */
export async function diagnose(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: "Image file is required" },
      });
    }

    const diagnosis = await createDiagnosis({
      filePath: req.file.path,
      plantId: req.body.plantId,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      data: diagnosis,
      message: "Diagnosis completed successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/diagnosis/diagnoses
 * Get all diagnoses for current user
 */
export async function getAllDiagnoses(req, res, next) {
  try {
    const { limit = 20, skip = 0, plantId } = req.query;

    const diagnoses = await getDiagnosesForUser(req.user._id, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      plantId,
    });

    res.json({
      success: true,
      data: diagnoses,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/diagnosis/diagnoses/:id
 * Get single diagnosis by ID
 */
export async function getDiagnosisByIdHandler(req, res, next) {
  try {
    const { id } = req.params;

    const diagnosis = await getDiagnosisById(id, req.user._id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        error: { message: "Diagnosis not found" },
      });
    }

    res.json({
      success: true,
      data: diagnosis,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/diagnosis/diagnoses/:id
 * Delete a diagnosis
 */
export async function deleteDiagnosisHandler(req, res, next) {
  try {
    const { id } = req.params;

    const result = await deleteDiagnosis(id, req.user._id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: { message: "Diagnosis not found" },
      });
    }

    res.json({
      success: true,
      message: "Diagnosis deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/diagnosis/stats
 * Get diagnosis statistics for current user
 */
export async function getDiagnosisStatsHandler(req, res, next) {
  try {
    const stats = await getDiagnosisStats(req.user._id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  diagnose,
  getAllDiagnoses,
  getDiagnosisByIdHandler,
  deleteDiagnosisHandler,
  getDiagnosisStatsHandler,
};
