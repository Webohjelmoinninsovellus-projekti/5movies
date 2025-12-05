import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const reviewRouter = Router();

reviewRouter.get("/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  if (!type || !id) return new Error("Type or ID is not defined");
  else {
    pool.query(
      `SELECT user_review.userid, user_review.date, user_review.comment, user_review.rating, public.user.username, public.user.avatar_url
      FROM user_review
      INNER JOIN public.user ON user_review.userid = public.user.userid
      WHERE public.user.active = true AND user_review.ismovie = $1 AND user_review.movieshowid = $2
      ORDER BY user_review.reviewid DESC LIMIT 5;`,
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
    console.log(req.user);
    const { ismovie, comment, movieshowid, rating } = req.body;
    const { userid } = req.user;

    if (rating > 5 || rating < 0)
      throw new Error("Rating is outside of allowed range.");
    else {
      pool.query(
        `INSERT INTO user_review (ismovie, comment, movieshowid, userid, rating)
        SELECT $1, $2, $3, $4, $5
        WHERE NOT EXISTS (SELECT 1 FROM user_review WHERE ismovie = $1 AND movieshowid = $3 AND userid = $4);`,
        [ismovie, comment, movieshowid, userid, rating],
        (err, result) => {
          res.status(201).json({
            message: "Review saved successfully",
            /* reviewId: result.rows[0].reviewid, */
          });
        }
      );
    }
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;
