import { Router } from "express";
import dotenv from "dotenv";
import {
  getInfo,
  getDiscovery,
  getPopular,
  getInTheaters,
  searchMulti,
} from "../controllers/tmdbController.js";

dotenv.config();

const tmdbRouter = Router();

tmdbRouter.get("/info/:type/:id", getInfo);
tmdbRouter.get("/discovery/:type/:pageId", getDiscovery);
tmdbRouter.get("/popular", getPopular);
tmdbRouter.get("/in-theaters", getInTheaters);
tmdbRouter.get("/search/:query", searchMulti);

export default tmdbRouter;
