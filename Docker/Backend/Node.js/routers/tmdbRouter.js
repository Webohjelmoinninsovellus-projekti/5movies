import { Router } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const tmdbRouter = Router();

tmdbRouter.get("/info/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  if (!type || !id) {
    res.status(404).json("Type or ID is not defined");
    return;
  } else {
    try {
      const response = await axios({
        method: "get",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        url: `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
      });

      if (response) res.status(200).json(response.data);
      else res.status(500).json({ error: "No response." });
    } catch (e) {
      console.log(e);
    }
  }
});

tmdbRouter.get("/discovery/:type/:pageId", async (req, res) => {
  const { type, pageId } = req.params;

  if (!type || !pageId) {
    res.status(404).json("Type or ID is not defined");
    return;
  } else {
    try {
      const response = await axios({
        method: "get",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        url: `https://api.themoviedb.org/3/discover/${type}?language=en-US&sort_by=popularity.desc&page=${pageId}`,
      });

      if (response) res.status(200).json(response.data);
      else res.status(500).json({ error: "No response." });
    } catch (e) {
      console.log(e);
    }
  }
});

tmdbRouter.get("/popular", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    });

    if (response) res.status(200).json(response.data);
    else res.status(500).json({ error: "No response." });
  } catch (e) {
    console.log(e);
  }
});

tmdbRouter.get("/in-theaters", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      url: "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    });

    if (response) res.status(200).json(response.data);
    else res.status(500).json({ error: "No response." });
  } catch (e) {
    console.log(e);
  }
});

tmdbRouter.get("/search/:query", async (req, res) => {
  const { query } = req.params;
  if (!query) {
    res.status(404).json("Query is not defined");
    return;
  } else {
    try {
      const response = await axios({
        method: "get",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        url: `https://api.themoviedb.org/3/search/multi?include_adult=false&query=${query}&language=en-US&page=1`,
      });

      if (response) res.status(200).json(response.data);
      else res.status(500).json({ error: "No response." });
    } catch (e) {
      console.log(e);
    }
  }
});

export default tmdbRouter;
