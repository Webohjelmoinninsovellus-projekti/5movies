import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const reviewRouter = Router();

/* reviewRouter.get("/", async (req, res) => {
  pool.query("SELECT * FROM user_review"),
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows[0]);
    };
}); */

reviewRouter.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!type || !id) return new Error("Type or ID is not defined");
  else {
    pool.query(
      "SELECT user_review.userid, user_review.date, user_review.comment, user_review.rating FROM user_review WHERE ismovie = $1 AND movieshowid = $2 ORDER BY reviewid DESC LIMIT 5",
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
    const { ismovie, comment, movieshowid, rating } = req.body;
    const { userid } = req.user;

    if (rating > 5 || rating < 0)
      throw new Error("Rating is outside of allowed range.");
    else {
      const query = `
        INSERT INTO user_review (ismovie, comment, movieshowid, userid, rating)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING reviewid
      `;

      const { rows } = await pool.query(query, [
        ismovie,
        comment,
        movieshowid,
        userid,
        rating,
      ]);
      res.status(201).json({
        message: "Review saved successfully",
        reviewId: rows[0].reviewid,
      });
    }
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;
