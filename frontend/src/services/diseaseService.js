import api from "./api";

/**
 * Runs deep learning vision diagnosis on a leaf image.
 * Accepts either:
 *  - { imageFile: File, plantId?: string } (as multipart/form-data)
 *  - { imageBase64: string, plantId?: string } (as JSON)
 */
export async function detectDisease({ imageFile, imageBase64, plantId }) {
  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    if (plantId) {
      formData.append("plantId", plantId);
    }

    const { data } = await api.post("/diseases/detect", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 45000,
    });
    return data.data;
  }

  if (imageBase64) {
    const { data } = await api.post(
      "/diseases/detect",
      { image: imageBase64, plantId },
      { timeout: 45000 }
    );
    return data.data;
  }

  throw new Error("No image file or base64 data provided.");
}

/**
 * Fetches the full disease encyclopedia from MongoDB.
 */
export async function getDiseases() {
  const { data } = await api.get("/diseases");
  return data.data.diseases;
}

/**
 * Fetches clinical profile for a specific disease by slug.
 */
export async function getDisease(slug) {
  const { data } = await api.get(`/diseases/${slug}`);
  return data.data.disease;
}

/**
 * Evaluates environmental microclimatic disease risk.
 */
export async function predictRisk(telemetry = {}) {
  const { data } = await api.post("/diseases/predict-risk", telemetry);
  return data.data;
}
