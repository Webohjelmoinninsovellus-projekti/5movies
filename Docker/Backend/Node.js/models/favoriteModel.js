import { pool } from "../helper/db.js";

export async function getFavoritesByUsername(username) {
  const result = await pool.query(
    `SELECT user_favourite.type, user_favourite.tmdb_id, user_favourite.title, user_favourite.date_added, user_favourite.release_year, user_favourite.poster_path
    FROM user_favourite
    INNER JOIN "user" ON user_favourite.user_id = "user".id_user
    WHERE "user".username = $1 AND "user".deactivation_date IS NULL
    ORDER BY user_favourite.id_favorite DESC`,
    [username]
  );
  return result.rows;
}

export async function findFavorite(tmdbId, userId) {
  const result = await pool.query(
    `SELECT * FROM user_favourite WHERE tmdb_id = $1 AND user_id = $2`,
    [tmdbId, userId]
  );

  return result.rows[0] || null;
}

export async function insertFavorite(
  type,
  tmdbId,
  title,
  posterPath,
  releaseYear,
  userId
) {
  const result = await pool.query(
    `INSERT INTO user_favourite (type, tmdb_id, title, poster_path, release_year, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [type, tmdbId, title, posterPath, releaseYear, userId]
  );

  return result.rows[0];
}

export async function deleteFavorite(tmdbId, userId) {
  const result = await pool.query(
    `DELETE FROM user_favourite WHERE tmdb_id = $1 AND user_id = $2 RETURNING *`,
    [tmdbId, userId]
  );
  return result.rows[0] || null;
}
