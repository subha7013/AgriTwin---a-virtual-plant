import api from "./api";

export async function getPlants(params = {}) {
  const { data } = await api.get("/plants", { params });
  return data.data;
}

export async function getPlantSummary() {
  const { data } = await api.get("/plants/summary");
  return data.data;
}

export async function getPlant(id) {
  const { data } = await api.get(`/plants/${id}`);
  return data.data.plant;
}

export async function createPlant(payload) {
  const { data } = await api.post("/plants", payload);
  return data.data.plant;
}

export async function updatePlant(id, payload) {
  const { data } = await api.patch(`/plants/${id}`, payload);
  return data.data.plant;
}

export async function deletePlant(id) {
  await api.delete(`/plants/${id}`);
}

export async function getDiseases() {
  const { data } = await api.get("/diseases");
  return data.data.diseases;
}

export async function getDisease(slug) {
  const { data } = await api.get(`/diseases/${slug}`);
  return data.data.disease;
}