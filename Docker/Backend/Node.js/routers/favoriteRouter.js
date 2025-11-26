import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const favoriteRouter = Router();

favoriteRouter.get("/:username", async (req, res) => {
  const { username } = req.params;

  pool.query(
    'SELECT user_favourite.movieshowid, user_favourite.ismovie, user_favourite.title, user_favourite.poster_path, user_favourite.release_year, user_favourite.date FROM user_favourite INNER JOIN "user" ON user_favourite.user_id = "user".userid WHERE "user".username = $1 ORDER BY date DESC',
    [username],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    }
  );
});

favoriteRouter.post("/add", verifyToken, async (req, res) => {
  try {
    const { ismovie, movieshowid, title, poster_path, release_year } = req.body;
    const userid = req.user.userid;

    // Check if already exists
    const checkQuery = `
      SELECT * FROM user_favourite
      WHERE user_id = $1 AND movieshowid = $2`;

    const existing = await pool.query(checkQuery, [userid, movieshowid]);

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "This item is already in your favorites",
      });
    }
    const query = `
      INSERT INTO user_favourite (user_id, ismovie, movieshowid, title, poster_path, release_year, date)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
        RETURNING *`;

    const { rows } = await pool.query(query, [
      userid,
      ismovie,
      movieshowid,
      title,
      poster_path,
      release_year,
    ]);
    res.status(201).json({
      message: "favorite added successfully",
      reviewId: rows[0].reviewid,
    });
  } catch (error) {
    console.error("Error while removing favorite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default favoriteRouter;
