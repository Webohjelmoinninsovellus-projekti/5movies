import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const reviewRouter = Router();

reviewRouter.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!type || !id) return new Error("Type or ID is not defined");
  else {
    pool.query(
      `SELECT user_review.user_id, user_review.date_created, user_review.comment, user_review.rating, "user".username, "user".avatar_path
      FROM user_review
      INNER JOIN "user" ON user_review.user_id = "user".id_user
      WHERE "user".deactivation_date IS NULL AND user_review.type = $1 AND user_review.tmdb_id = $2
      ORDER BY user_review.id_review DESC LIMIT 6`,
      [type === "movie" ? true : false, id],
      (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(result.rows);
      }
    );
  }
});

reviewRouter.post("/add", verifyToken, async (req, res) => {
  try {
    const { type, tmdbId, rating, comment } = req.body;
    const userId = req.user.user_id;

    if (rating > 5 || rating < 0)
      throw new Error("Rating is outside of allowed range.");
    else {
      pool.query(
        `INSERT INTO user_review (type, tmdb_id, rating, comment, user_id)
        SELECT $1, $2, $3, $4, $5
        WHERE NOT EXISTS (SELECT 1 FROM user_review WHERE type = $1 AND tmdb_id = $2 AND user_id = $5)
      `,
        [type, tmdbId, rating, comment, userId],
        (err, result) => {
          if (result)
            res.status(201).json({
              message: "Review saved successfully.",
            });
        }
      );
    }
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default reviewRouter;
