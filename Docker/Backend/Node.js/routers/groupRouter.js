import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const groupRouter = Router();

groupRouter.get("/", verifyToken, (req, res) => {
  if (req.query.my === "true") {
    pool.query(
      `SELECT DISTINCT "group".*
       FROM "group"
       LEFT JOIN user_group ON user_group.group_id = "group".id_group
       WHERE (user_group.user_id = $1 AND user_group.active = true) OR "group".owner_id = $1
       ORDER BY "group".name`,
      [req.user.user_id],
      (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(result.rows);
      }
    );
  } else {
    pool.query(`SELECT * FROM "group" ORDER BY name`, (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(result.rows);
    });
  }
});

groupRouter.get("/:name", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "group".*,
              (SELECT json_agg(group_item.* ORDER BY date_added DESC)
               FROM group_item
               WHERE group_item.group_id = "group".id_group) AS items
       FROM "group"
       WHERE name = $1`,
      [req.params.name]
    );
    if (result.rows.length === 0)
      res.status(404).json({ message: "Group not found." });
    else res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/members/:name", (req, res) => {
  pool.query(
    `SELECT "user".username, "user".avatar_path
     FROM "user"
     JOIN "group" ON "group".user_id = "user".id_user
     JOIN user_group ON user_group.group_id = "group".id_group
     WHERE "group".name = $1
     ORDER BY ("user".id_user = "group".owner_id) DESC, "user".username`,
    [req.params.name],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(result.rows);
    }
  );
});

groupRouter.post("/create", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const result = await pool.query(
      `INSERT INTO "group" (name, date_created, description, active, owner_id)
       VALUES ($1, CURRENT_DATE, $2, true, $3)
       RETURNING *`,
      [req.body.name, req.body.description, userId]
    );
    await pool.query(
      `INSERT INTO user_group (active, user_id, group_id)
       VALUES (true, $1, $2)`,
      [userId, result.rows[0].id_group]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505")
      res.status(409).json({ message: "Group name already exists." });
    else res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/add-item", verifyToken, async (req, res) => {
  try {
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
      [
        req.params.name,
        req.body.type,
        req.body.tmdbId,
        req.body.title,
        req.body.posterPath,
        req.body.releaseYear,
      ]
    );
    if (result.rows.length === 0)
      res.status(409).json({ message: "Item exists or group missing." });
    else res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.delete("/:name/remove-item", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM group_item
       USING "group"
       WHERE "group".id_group = group_item.group_id
         AND "group".name = $1
         AND group_item.type = $2
         AND group_item.tmdb_id = $3
         AND "group".owner_id = $4
       RETURNING group_item.*`,
      [req.params.name, req.user.user_id, req.body.type, req.body.title]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or not found." });
    else res.json({ message: "Item removed.", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + "/uploads"),
  filename: (req, file, cb) => {
    if (whitelist.includes(file.mimetype))
      cb(null, "group-" + Date.now() + path.extname(file.originalname));
    else cb(new Error("Invalid file"));
  },
});
const upload = multer({ storage });

groupRouter.post(
  //icon
  "/:name/icon",
  verifyToken,
  upload.single("icon"),
  async (req, res) => {
    try {
      if (!req.file) res.status(400).json({ message: "No file uploaded." });
      else {
        const result = await pool.query(
          `UPDATE "group" SET icon_path = $1 WHERE name = $2 AND owner_id = $3 RETURNING *`,
          [req.file.filename, req.params.name, req.user.user_id]
        );
        if (result.rows.length === 0)
          res.status(403).json({ message: "Not allowed." });
        else res.json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

groupRouter.delete("/:name", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM "group" WHERE name = $1 AND owner_id = $2 RETURNING *`,
      [req.params.name, req.user.user_id]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or not found." });
    else res.json({ message: "Group deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/join/:groupId", verifyToken, async (req, res) => {
  try {
    const check = await pool.query(
      `SELECT id_group,
              (SELECT COUNT(*) FROM user_group WHERE user_id = $2 AND group_id = $1) AS is_member,
              (SELECT COUNT(*) FROM group_join_request WHERE user_id = $2 AND group_id = $1 AND status = 'pending') AS has_request
       FROM "group"
       WHERE ig_group = $1`,
      [parseInt(req.params.groupId), req.user.user_id]
    );
    if (check.rows.length === 0)
      res.status(404).json({ message: "Group not found." });
    else if (check.rows[0].is_member > 0)
      res.status(409).json({ message: "Already a member." });
    else if (check.rows[0].has_request > 0)
      res.status(409).json({ message: "Request already sent." });
    else {
      const result = await pool.query(
        `INSERT INTO group_join_request (status, user_id, group_id) VALUES ('pending', $1, $2) RETURNING *`,
        [req.user.user_id, parseInt(req.params.groupId)]
      );
      res
        .status(201)
        .json({ message: "Join request sent.", request: result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/requests/:groupId", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT group_join_request.*, "user".username, "user".avatar_path
       FROM group_join_request
       JOIN "group" ON "group".id_group = group_join_request.group_id
       JOIN "user" ON "user".id_user = group_join_request.user_id
       WHERE group_join_request.group_id = $1 AND "group".owner_id = $2 AND group_join_request.status = 'pending'
       ORDER BY group_join_request.request_date DESC`,
      [parseInt(req.params.groupId), req.user.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/accept/:requestId", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `WITH updated AS (
        UPDATE group_join_request SET status = 'accepted', response_date = CURRENT_TIMESTAMP
        WHERE request_id = $1 AND status = 'pending'
        RETURNING user_id, group_id
      )
      INSERT INTO user_group (active, user_id, group_id)
      SELECT true, user_id, group_id FROM updated
      RETURNING *`,
      [parseInt(req.params.requestId)]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or request processed." });
    else res.json({ message: "Request accepted.", added: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/reject/:requestId", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE group_join_request SET status = 'rejected', response_date = CURRENT_TIMESTAMP
       WHERE request_id = $1 AND status = 'pending'
       RETURNING *`,
      [parseInt(req.params.requestId)]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or request processed." });
    else res.json({ message: "Request rejected.", request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT group_join_request.*, "group".name AS group_name, "group".icon_path AS group_icon
       FROM group_join_request
       JOIN "group" ON "group".id_group = group_join_request.group_id
       WHERE group_join_request.user_id = $1
       ORDER BY group_join_request.request_date DESC`,
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/leave", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM user_group
       USING "group"
       WHERE "group".id_group = user_group.group_id
         AND "group".name = $1
         AND user_group.user_id = $2
         AND "group".owner_id <> $2
       RETURNING user_group.*`,
      [req.params.name, req.user.user_id]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Cannot leave group or not a member." });
    else res.json({ message: "Left group successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
