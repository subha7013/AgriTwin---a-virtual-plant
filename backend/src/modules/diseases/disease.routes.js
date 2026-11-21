import { Router } from "express";
import { getAllDiseases, getOneDisease } from "./disease.controller.js";

export const diseaseRouter = Router();

diseaseRouter.get("/", getAllDiseases);
diseaseRouter.get("/:slug", getOneDisease);