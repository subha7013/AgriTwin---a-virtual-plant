import {
  listPlants,
  getPlantSummary,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
} from "./plant.service.js";

export async function getAllPlants(req, res) {
  const plants = await listPlants(req.user, req.query);

  res.json({
    success: true,
    data: { plants, count: plants.length },
  });
}

export async function getSummary(req, res) {
  const summary = await getPlantSummary(req.user);

  res.json({
    success: true,
    data: summary,
  });
}

export async function getOnePlant(req, res) {
  const plant = await getPlant(req.user, req.params.id);

  res.json({
    success: true,
    data: { plant },
  });
}

export async function addPlant(req, res) {
  const plant = await createPlant(req.user, req.body);

  res.status(201).json({
    success: true,
    data: { plant },
    message: "Plant created successfully",
  });
}

export async function editPlant(req, res) {
  const plant = await updatePlant(req.user, req.params.id, req.body);

  res.json({
    success: true,
    data: { plant },
    message: "Plant updated successfully",
  });
}

export async function removePlant(req, res) {
  await deletePlant(req.user, req.params.id);

  res.json({
    success: true,
    data: null,
    message: "Plant deleted successfully",
  });
}