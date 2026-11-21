import { Plant } from "../../models/Plant.js";
import { ApiError } from "../../utils/ApiError.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ownerFilter(user) {
  return user.role === "admin" ? {} : { owner: user._id };
}

async function findOwnedPlant(user, id) {
  const plant = await Plant.findById(id);

  if (!plant) {
    throw ApiError.notFound("Plant not found");
  }

  const isOwner = plant.owner.toString() === user._id.toString();

  if (user.role !== "admin" && !isOwner) {
    throw ApiError.forbidden("You can only access your own plants");
  }

  return plant;
}

export async function listPlants(user, query = {}) {
  const filter = ownerFilter(user);

  if (query.search) {
    filter.name = { $regex: escapeRegex(query.search.trim()), $options: "i" };
  }

  if (query.health) {
    filter.health = query.health;
  }

  return Plant.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getPlantSummary(user) {
  const filter = ownerFilter(user);

  const [total, healthy, diseased] = await Promise.all([
    Plant.countDocuments(filter),
    Plant.countDocuments({ ...filter, health: "healthy" }),
    Plant.countDocuments({ ...filter, health: "diseased" }),
  ]);

  return {
    total,
    healthy,
    diseased,
    unknown: Math.max(total - healthy - diseased, 0),
  };
}

export async function getPlant(user, id) {
  return findOwnedPlant(user, id);
}

export async function createPlant(user, payload) {
  return Plant.create({ ...payload, owner: user._id });
}

export async function updatePlant(user, id, payload) {
  const plant = await findOwnedPlant(user, id);

  Object.assign(plant, payload);
  await plant.save();

  return plant;
}

export async function deletePlant(user, id) {
  const plant = await findOwnedPlant(user, id);
  await plant.deleteOne();
}