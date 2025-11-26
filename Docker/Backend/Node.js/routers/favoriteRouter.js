import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const favoriteRouter = Router();

favoriteRouter.get("/:username", async (req, res) => {
  const { username } = req.params;

  pool.query(
    "SELECT user_favorite.movieshowid, user_favorite.user_id FROM user_favorite INNER JOIN user ON user_favorite.user_id = user.userid WHERE user.username = $1 ORDER BY date DESC LIMIT 5",
    [username],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    }
  );
});

favoriteRouter.post("/add", verifyToken, async (req, res) => {
  try {
    const { ismovie, movieshowid } = req.body;
    const userid = req.user.id;
    const query = `
      INSERT INTO user_favorite (userid, ismovie, movieshowid)
      VALUES ($1, $2, $3)
        RETURNING *`;

    const { rows } = await pool.query(query, [userid, ismovie, movieshowid]);
    res.status(201).json({
      message: "favorite added successfully",
      reviewId: rows[0].reviewid,
    });
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default favoriteRouter;
