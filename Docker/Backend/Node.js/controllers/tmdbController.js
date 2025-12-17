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

    const yearMatch = query.match(/\b(19|20)\d{2}\b$/);
    const year = yearMatch?.[0];

    if (year && query.replace(year, "").trim() === "") {
      const [movies, tvShows] = await Promise.all([
        fetchTmdb(
          `discover/movie?primary_release_year=${year}&language=en-US&page=${page}`
        ).then((d) =>
          (d.results || []).map((r) => ({ ...r, media_type: "movie" }))
        ),
        fetchTmdb(
          `discover/tv?first_air_date_year=${year}&language=en-US&page=${page}`
        ).then((d) =>
          (d.results || []).map((r) => ({ ...r, media_type: "tv" }))
        ),
      ]);
      return res.status(200).json({ results: [...movies, ...tvShows] });
    }

    const searchData = await fetchTmdb(
      `search/multi?include_adult=false&query=${encodeURIComponent(
        query
      )}&language=en-US&page=${page}` // lisäsin ton page-parametrin toho aikane oli vaan 1
    );
    return res.status(200).json(searchData);
  } catch (error) {
    next(error);
  }
}
