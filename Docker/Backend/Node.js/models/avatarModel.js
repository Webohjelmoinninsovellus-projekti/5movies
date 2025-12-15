import { pool } from "../helper/db.js";

export async function updateAvatar(filename, username) {
  const result = await pool.query(
    `UPDATE "user" SET avatar_path = $1 WHERE username = $2 RETURNING *`,
    [filename, username]
  );
  return result.rows[0] || null;
}
