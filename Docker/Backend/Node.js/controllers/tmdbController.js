import dotenv from "dotenv";
import fetchTmdb from "../models/tmdbModel.js";

dotenv.config();

export async function getInfo(req, res, next) {
  try {
    const { type, id } = req.params;
    if (!type || !id) return res.status(404).json("Type or ID is not defined.");
    const data = await fetchTmdb(`${type}/${id}?language=en-US`);

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getDiscovery(req, res, next) {
  try {
    const { type, pageId } = req.params;
    if (!type || !pageId)
      return res.status(404).json("Type or ID is not defined");

    const data = await fetchTmdb(
      `discover/${type}?language=en-US&sort_by=popularity.desc&page=${pageId}`
    );

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getPopular(req, res, next) {
  try {
    const data = await fetchTmdb(
      "movie/popular?language=en-US&page=1&region=fi"
    );

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getInTheaters(req, res, next) {
  try {
    const data = await fetchTmdb(
      "movie/now_playing?language=en-US&page=1&region=fi"
    );

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function searchMulti(req, res, next) {
  try {
    const { query } = req.params;
    const page = Number(req.query.page) || 1; // ton lisäsin kokeilen et saako hakuun toista sivua:)
    if (!query) return res.status(404).json("Query is not defined");

    const data = await fetchTmdb(
      `search/multi?include_adult=false&query=${encodeURIComponent(
        query
      )}&language=en-US&page=${page}` // lisäsin ton page-parametrin toho
    );

    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}
