import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const infoRouter = Router();

infoRouter.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!type || !id) return new Error("Type or ID is not defined");
  else {
    const response = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    if (response) return response.data;
  }
});

export default infoRouter;
