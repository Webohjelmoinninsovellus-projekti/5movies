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
      WHERE "user".deactivation_date IS NULL AND user_review.is_movie = $1 AND user_review.item_id = $2
      ORDER BY user_review.id_review DESC LIMIT 6;`,
      [type === "movie" ? true : false, id],
      (err, result) => {
        console.log(result);

        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(result.rows);
      }
    );
  }
});

reviewRouter.post("/add", verifyToken, async (req, res) => {
  try {
    console.log(req.user);
    const { isMovie, itemId, rating, comment } = req.body;
    const { userId } = req.user;

    if (rating > 5 || rating < 0)
      throw new Error("Rating is outside of allowed range.");
    else {
      const { rows } = await pool.query(
        `INSERT INTO user_review (is_movie, item_id, rating, comment, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_review
      `,
        [isMovie, itemId, rating, comment, userId]
      );
      res.status(201).json({
        message: "Review saved successfully",
        reviewId: rows[0].id_review,
      });
    }
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;
