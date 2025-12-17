import { pool } from "../helper/db.js";

export async function findGroupsForUser(userId, my) {
  if (my && userId != -1)
    return (
      await pool.query(
        `SELECT *
        FROM "group"
        WHERE owner_id = $1
        ORDER BY name`,
        [userId]
      )
    ).rows;
  return (await pool.query(`SELECT * FROM "group" ORDER BY name`)).rows;
}

export async function findGroupByName(name) {
  const result = await pool.query(
    `SELECT "group".*,
        (SELECT json_agg(group_item.* ORDER BY date_added ASC)
        FROM group_item
        WHERE group_item.group_id = "group".id_group) AS items
     FROM "group"
     WHERE name = $1`,
    [name]
  );

  return result.rows[0] || null;
}

export async function findMembersByGroupName(name) {
  const result = await pool.query(
    `SELECT "user".username, "user".avatar_path
     FROM "group"
     JOIN user_group
     ON user_group.group_id = "group".id_group
     JOIN "user"
     ON "user".id_user = user_group.user_id
     WHERE "group".name = $1
     ORDER BY ("user".id_user = "group".owner_id) DESC, user_group.id_user_group`,
    [name]
  );

  return result.rows;
}

export async function createNewGroup(name, description, ownerId) {
  const result = await pool.query(
    `INSERT INTO "group" (name, date_created, description, active, owner_id)
    VALUES ($1, CURRENT_DATE, $2, true, $3)
    RETURNING *`,
    [name, description, ownerId]
  );

  await pool.query(
    `INSERT INTO user_group (active, user_id, group_id)
    VALUES (true, $1, $2)`,
    [ownerId, result.rows[0].id_group]
  );

  return result.rows[0];
}

export async function insertGroupItem(
  groupName,
  type,
  tmdbId,
  title,
  posterPath,
  releaseYear
) {
  const result = await pool.query(
    `INSERT INTO group_item (type, tmdb_id, title, poster_path, release_year, group_id)
    SELECT $2, $3, $4, $5, $6, "group".id_group
    FROM "group"
    WHERE "group".name = $1
        AND NOT EXISTS (
            SELECT 1 FROM group_item
            WHERE group_id = "group".id_group AND type = $2 AND tmdb_id = $3
        )
    RETURNING *`,
    [groupName, type, tmdbId, title, posterPath, releaseYear]
  );
  return result.rows[0] || null;
}

export async function deleteGroupItem(tmdbId, userId) {
  const result = await pool.query(
    `DELETE FROM group_item
    USING "group"
    WHERE "group".id_group = group_item.group_id
        AND group_item.tmdb_id = $1
        AND "group".owner_id = $2
     RETURNING group_item.*`,
    [tmdbId, userId]
  );

  return result.rows[0] || null;
}

export async function updateGroupIcon(name, filename, ownerId) {
  const result = await pool.query(
    `UPDATE "group" SET icon_path = $1
    WHERE name = $2 AND owner_id = $3 RETURNING *`,
    [filename, name, ownerId]
  );

  return result.rows[0] || null;
}

export async function removeGroup(name, ownerId) {
  const result = await pool.query(
    `DELETE FROM "group" WHERE name = $1 AND owner_id = $2 RETURNING *`,
    [name, ownerId]
  );

  return result.rows[0] || null;
}

export async function checkJoinState(groupId, userId) {
  const result = await pool.query(
    `SELECT id_group,
        (SELECT COUNT(*) FROM user_group WHERE user_id = $2 AND group_id = $1) AS is_member,
        (SELECT COUNT(*) FROM group_join_request WHERE user_id = $2 AND group_id = $1 AND status = 'pending') AS has_request
    FROM "group"
    WHERE id_group = $1`,
    [groupId, userId]
  );

  return result.rows[0] || null;
}

export async function insertJoinRequest(userId, groupId) {
  const result = await pool.query(
    `INSERT INTO group_join_request (status, user_id, group_id)
    VALUES ('pending', $1, $2) RETURNING *`,
    [userId, groupId]
  );

  return result.rows[0];
}

export async function findRequestsForGroup(groupId, ownerId) {
  const result = await pool.query(
    `SELECT group_join_request.*, "user".username, "user".avatar_path
    FROM group_join_request
    JOIN "group" ON "group".id_group = group_join_request.group_id
    JOIN "user" ON "user".id_user = group_join_request.user_id
    WHERE group_join_request.group_id = $1 AND "group".owner_id = $2 AND group_join_request.status = 'pending'
    ORDER BY group_join_request.request_date DESC`,
    [groupId, ownerId]
  );

  return result.rows;
}

export async function acceptJoinRequest(requestId) {
  const result = await pool.query(
    `WITH updated AS (
      UPDATE group_join_request SET status = 'accepted', response_date = CURRENT_TIMESTAMP
      WHERE request_id = $1 AND status = 'pending'
      RETURNING user_id, group_id
    )
    INSERT INTO user_group (active, user_id, group_id)
    SELECT true, user_id, group_id FROM updated
    RETURNING *`,
    [requestId]
  );

  return result.rows;
}

export async function rejectJoinRequest(requestId) {
  const result = await pool.query(
    `UPDATE group_join_request SET status = 'rejected', response_date = CURRENT_TIMESTAMP
     WHERE request_id = $1 AND status = 'pending'
     RETURNING *`,
    [requestId]
  );

  return result.rows[0] || null;
}

export async function findMyRequests(userId) {
  const result = await pool.query(
    `SELECT group_join_request.*, "group".name AS group_name, "group".icon_path AS group_icon
     FROM group_join_request
     JOIN "group" ON "group".id_group = group_join_request.group_id
     WHERE group_join_request.user_id = $1
     ORDER BY group_join_request.request_date DESC`,
    [userId]
  );

  return result.rows;
}

export async function leaveGroupByName(name, userId) {
  const result = await pool.query(
    `DELETE FROM user_group
    USING "group"
    WHERE "group".id_group = user_group.group_id
        AND "group".name = $1
        AND user_group.user_id = $2
        AND "group".owner_id <> $2
    RETURNING user_group.*`,
    [name, userId]
  );

  return result.rows[0] || null;
}
