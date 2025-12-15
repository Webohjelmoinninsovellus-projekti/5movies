import {
  getFavoritesByUsername,
  findFavorite,
  insertFavorite,
  deleteFavorite,
} from "../models/favoriteModel.js";

export async function getFavorites(req, res, next) {
  try {
    const { username } = req.params;
    const rows = await getFavoritesByUsername(username);

    return res.status(200).json(rows);
  } catch (e) {
    next(e);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const { type, tmdbId, title, releaseYear, posterPath } = req.body;
    const userId = req.user.user_id;
    const existing = await findFavorite(tmdbId, userId);
    if (existing)
      return res
        .status(409)
        .json({ message: "This item is already in your favorites." });
    const created = await insertFavorite(
      type,
      tmdbId,
      title,
      posterPath,
      releaseYear,
      userId
    );

    return res.status(201).json({
      message: "Added item to favorites successfully.",
      favoriteId: created.id || created.id_favorite,
    });
  } catch (e) {
    next(e);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user.user_id;
    const removed = await deleteFavorite(parseInt(itemId), userId);
    if (!removed)
      return res.status(404).json({ message: "Item not found in favorites." });

    return res.status(200).json({
      message: "Item successfully removed from favorites.",
      favoriteId: removed.id || removed.id_favorite,
    });
  } catch (e) {
    next(e);
  }
}
