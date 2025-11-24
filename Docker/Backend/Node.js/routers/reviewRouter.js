import { Router } from "express";
import { pool } from "../helper/db.js";

const reviewRouter = Router();

reviewRouter.get("/", async (req, res) => {});

reviewRouter.post("/add", async (req, res) => {
  try {
    const { comment } = req.body;
    const query = `
      INSERT INTO user_review (comment)
      VALUES ($1)
      RETURNING reviewid
    `;
    const values = [comment];

    const { rows } = await pool.query(query, values);
    res.status(201).json({
      message: "Review saved successfully",
      reviewId: rows[0].reviewid,
    });
  } catch (error) {
    console.error("Error while saving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;

/*  try {
    const { ismovie, movieshowId, userId, rating, comment } = req.body;
    if (rating <= 0 || rating >= 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }
    if (!userId || !movieshowId) {
      return res
        .status(400)
        .json({ message: "userId and movieshowId are required" });
    } 

    const query = `
      INSERT INTO reviews (comment)
      VALUES ($1)
      RETURNING reviewid
    `;

    const values = [ ismovie, movieshowId, userId, rating, comment];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "Rating saved successfully",
      reviewId: rows[0].reviewid,
    });
  } catch (error) {
    console.error("Error while saving rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;*/
