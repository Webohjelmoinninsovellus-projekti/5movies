import { findReviews, insertReview } from "../models/reviewModel.js";

export async function getReviews(req, res, next) {
  try {
    const { type, id } = req.params;
    if (!type || !id) return next(new Error("Type or ID is not defined."));
    const rows = await findReviews(type, id);

    return res.status(200).json(rows);
  } catch (e) {
    next(e);
  }
}

export async function addReview(req, res, next) {
  try {
    const { type, tmdbId, rating, comment } = req.body;
    const userId = req.user.user_id;

    if (rating > 5 || rating < 0)
      throw new Error("Rating is outside of allowed range.");
    const added = await insertReview(type, tmdbId, rating, comment, userId);
    if (!added)
      return res.status(409).json({ message: "Review already exists." });

    return res.status(201).json({ message: "Review saved successfully." });
  } catch (error) {
    next(error);
  }
}
