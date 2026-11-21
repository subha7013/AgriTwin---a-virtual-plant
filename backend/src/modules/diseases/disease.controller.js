import { listDiseases, getDiseaseBySlug } from "./disease.service.js";

export async function getAllDiseases(req, res) {
  const diseases = await listDiseases();

  res.json({
    success: true,
    data: { diseases, count: diseases.length },
  });
}

export async function getOneDisease(req, res) {
  const disease = await getDiseaseBySlug(req.params.slug);

  res.json({
    success: true,
    data: { disease },
  });
}