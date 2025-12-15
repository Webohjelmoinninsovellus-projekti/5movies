import { pool } from "../helper/db.js";

export async function getAvatarFromUsername(username) {
  const result = await pool.query(
    `SELECT avatar_path FROM "user" WHERE username = $1`,
    [username]
  );

  return result.rows[0] || null;
}

export async function getProfileByUsername(username) {
  const result = await pool.query(
    `SELECT username, bio, date_created, avatar_path FROM "user" WHERE username = $1 AND deactivation_date IS NULL`,
    [username]
  );
  return result.rows[0] || null;
}

export async function getGroupsByUsername(username) {
  const result = await pool.query(
    `SELECT "group".name, "group".id_group, "group".icon_path,
      (SELECT COUNT("user_group".user_id) FROM "user_group" WHERE "user_group".group_id = "group".id_group) AS member_count
     FROM user_group
     INNER JOIN "user" ON user_group.user_id = "user".id_user
     INNER JOIN "group" ON user_group.group_id = "group".id_group
     WHERE "user".username = $1`,
    [username]
  );
  return result.rows;
}

export async function insertUser(username, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING *`,
    [username, hashedPassword]
  );
  return result.rows[0];
}

export async function findUserForAuth(username) {
  const result = await pool.query(
    `SELECT id_user, username, password, deactivation_date FROM "user" WHERE username = $1`,
    [username]
  );
  return result.rows[0] || null;
}

export async function reactivateUser(username, password) {
  const result = await pool.query(
    `UPDATE "user" SET deactivation_date = NULL
     WHERE deactivation_date IS NOT NULL AND username = $1 AND password = $2
     RETURNING *`,
    [username, password]
  );
  return result.rows[0] || null;
}

export async function deactivateUserModel(username, password) {
  const result = await pool.query(
    `UPDATE "user" SET deactivation_date = CURRENT_DATE
     WHERE deactivation_date IS NULL AND username = $1 AND password = $2
     RETURNING *`,
    [username, password]
  );
  return result.rows[0] || null;
}

export async function deleteUserByCredentials(username, password) {
  const result = await pool.query(
    `DELETE FROM "user" WHERE username = $1 AND password = $2 RETURNING *`,
    [username, password]
  );
  return result.rows[0] || null;
}
