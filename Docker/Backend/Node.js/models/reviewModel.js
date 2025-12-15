import { pool } from "../helper/db.js";

export async function findReviews(type, id) {
  const result = await pool.query(
    `SELECT user_review.user_id, user_review.date_created, user_review.comment, user_review.rating, "user".username, "user".avatar_path
    FROM user_review
    INNER JOIN "user" ON user_review.user_id = "user".id_user
    WHERE "user".deactivation_date IS NULL AND user_review.type = $1 AND user_review.tmdb_id = $2
    ORDER BY user_review.id_review DESC LIMIT 6`,
    [type === "movie" ? true : false, id]
  );

  return result.rows;
}

export async function insertReview(type, tmdbId, rating, comment, userId) {
  const result = await pool.query(
    `INSERT INTO user_review (type, tmdb_id, rating, comment, user_id)
    SELECT $1, $2, $3, $4, $5
    WHERE NOT EXISTS (SELECT 1 FROM user_review WHERE type = $1 AND tmdb_id = $2 AND user_id = $5)
    RETURNING *`,
    [type, tmdbId, rating, comment, userId]
  );

  return result.rows[0] || null;
}
