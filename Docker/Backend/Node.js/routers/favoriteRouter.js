import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";

const favoriteRouter = Router();

favoriteRouter.get("/:username", getFavorites);
favoriteRouter.post("/add", verifyToken, addFavorite);
favoriteRouter.delete("/remove/:itemId", verifyToken, removeFavorite);

export default favoriteRouter;
