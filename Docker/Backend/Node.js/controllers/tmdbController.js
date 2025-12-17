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
    const page = Number(req.query.page) || 1;

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
      )}&language=en-US&page=${page}`
    );

    const BLOCKED_REGEX =
      /\b(porn|xxx|gayniggers|nigger|sexy|erotic|hentai|sex|nude|nudity|pornography|porno|breast|breasts|breasted|tits|tit|pussy|vagina|vaginas|cock|penis|dick|cum|semen|masturbate|masturbation|orgasm|slut|whore|fap|rape|incest|anal|asshole|bukkake|bdsm|fetish|milf|shemale|transsexual|prostitute|hooker|blowjob|handjob|bj|gangbang|cumshot|coochie|clitoris|clit|g-spot|ejaculate|dildo|vibrator|sex toy|stripper|oral|deepthroat|pornos|pornhub|redtube|xhamster|bangbros|sexually|fetishes|sexually explicit|voyeur|peep|gangrape|rape fantasy|raping|rape scene|childporn|child sexual abuse|cp|underage sex|bestiality|zoophilia|necrophilia|rape porn|orgy|threesome|fisting|spanking|bondage|bdsm|dominatrix|dominant|submissive|squirting|lesbian sex|gay sex|gay porn|anal sex|sex tape|sex video|sex movie|hardcore sex|softcore sex|nsfw|pornographic|sexually suggestive|adult film|adult movie|adult content|sexploitation|sexploitation film|exhibitionism|voyeurism|masturbatory|pornstar|pornstars|grope|groper|groping)\b/i;

    const filteredResults = (searchData.results || []).filter((item) => {
      const title = item.title || item.name || "";
      const overview = item.overview || "";

      return !BLOCKED_REGEX.test(title) && !BLOCKED_REGEX.test(overview);
    });

    return res.status(200).json({ ...searchData, results: filteredResults });
  } catch (error) {
    next(error);
  }
}
