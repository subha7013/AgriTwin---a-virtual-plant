import { Disease } from "../../models/Disease.js";
import { ApiError } from "../../utils/ApiError.js";

export async function listDiseases() {
  return Disease.find().sort({ displayName: 1 }).lean();
}

export async function getDiseaseBySlug(slug) {
  const disease = await Disease.findOne({ slug }).lean();

  if (!disease) {
    throw ApiError.notFound("Disease not found");
  }

  return disease;
}