import {
  listDiseases,
  getDiseaseBySlug,
  detectDiseaseService,
  predictRiskService,
} from "./disease.service.js";

export async function getAllDiseases(req, res, next) {
  try {
    const diseases = await listDiseases();
    res.json({
      success: true,
      data: { diseases, count: diseases.length },
    });
  } catch (err) {
    next(err);
  }
}

export async function getOneDisease(req, res, next) {
  try {
    const disease = await getDiseaseBySlug(req.params.slug);
    res.json({
      success: true,
      data: { disease },
    });
  } catch (err) {
    next(err);
  }
}

export async function detectDisease(req, res, next) {
  try {
    const file = req.file;
    const { image, plantId } = req.body;

    const result = await detectDiseaseService({
      file,
      imageBase64: image,
      plantId,
      user: req.user,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function predictRisk(req, res, next) {
  try {
    const { temperature, humidity, soilMoisture, leafWetness } = req.body;

    const result = await predictRiskService({
      temperature,
      humidity,
      soilMoisture,
      leafWetness,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
