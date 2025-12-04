import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const favoriteRouter = Router();

favoriteRouter.get("/:username", async (req, res) => {
  const { username } = req.params;

  pool.query(
    `SELECT user_favourite.is_movie, user_favourite.item_id, user_favourite.item_title, user_favourite.date_added, user_favourite.release_year, user_favourite.poster_path
    FROM user_favourite
    INNER JOIN "user" ON user_favourite.user_id = "user".id_user
    WHERE "user".username = $1 AND "user".deactivation_date IS NULL
    ORDER BY user_favourite.id_favorite DESC LIMIT 10`,
    [username],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    }
  );
});

favoriteRouter.post("/add", verifyToken, async (req, res) => {
  try {
    const { isMovie, itemId, itemTitle, releaseYear, posterPath } = req.body;
    const userId = req.user.user_id;

    const existing = await pool.query(
      `
      SELECT * FROM user_favourite
      WHERE item_id = $1 AND user_id = $2`,
      [itemId, userId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "This item is already in your favorites.",
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO user_favourite (is_movie, item_id, item_title, poster_path, release_year, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
      [isMovie, itemId, itemTitle, posterPath, releaseYear, userId]
    );
    res.status(201).json({
      message: "Added item to favorites successfully.",
      favoriteId: rows[0].id,
    });
  } catch (error) {
    console.error("Error while adding to favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

favoriteRouter.delete("/remove/:item_id", verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.userid;

    console.log("Removing item from favorites:", { userId, itemId });

    const { rows } = await pool.query(
      `
      DELETE FROM user_favourite
      WHERE item_id = $1 AND user_id = $2
      RETURNING *`,
      [parseInt(itemId), userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Item not found in favorites.",
      });
    }

    res.status(200).json({
      message: "Item successfully removed from favorites.",
      favoriteId: rows[0].id,
    });
  } catch (error) {
    console.error("Error while removing item from favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default favoriteRouter;
