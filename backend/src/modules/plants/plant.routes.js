import { Router } from "express";
import { protect } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { createPlantSchema, updatePlantSchema } from "./plant.validation.js";
import {
  getAllPlants,
  getSummary,
  getOnePlant,
  addPlant,
  editPlant,
  removePlant,
} from "./plant.controller.js";

export const plantRouter = Router();

plantRouter.use(protect);

plantRouter.get("/summary", getSummary);
plantRouter.get("/", getAllPlants);
plantRouter.post("/", validate(createPlantSchema), addPlant);
plantRouter.get("/:id", getOnePlant);
plantRouter.patch("/:id", validate(updatePlantSchema), editPlant);
plantRouter.delete("/:id", removePlant);