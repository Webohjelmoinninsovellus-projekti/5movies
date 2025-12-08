import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const groupRouter = Router();

groupRouter.get("/", (req, res) => {
  if (req.query.my === "true") {
    pool.query(
      `SELECT DISTINCT "group".* 
       FROM "group"
       LEFT JOIN user_group ON user_group.group_id = "group".groupid
       WHERE (user_group.user_id = $1 AND user_group.active = true) OR "group".owner_id = $1
       ORDER BY "group".name`,
      [req.user.userid],
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
              (SELECT json_agg(group_item.* ORDER BY dateadded DESC) 
               FROM group_item 
               WHERE group_item.groupid = "group".groupid) AS items
       FROM "group"
       WHERE name = $1`,
      [req.params.name]
    );
    if (result.rows.length === 0)
      res.status(404).json({ message: "Group not found" });
    else res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/members/:name", (req, res) => {
  pool.query(
    `SELECT "user".username, "user".avatar_url
     FROM "group"
     JOIN user_group ON user_group.group_id = "group".groupid
     JOIN "user" ON "user".userid = user_group.user_id
     WHERE "group".name = $1
     ORDER BY ("user".userid = "group".owner_id) DESC, "user".username`,
    [req.params.name],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(result.rows);
    }
  );
});

groupRouter.post("/create", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO "group" (name, "desc", owner_id, datecreated, active)
       VALUES ($1, $2, $3, CURRENT_DATE, true)
       RETURNING *`,
      [req.body.name, req.body.desc, req.user.userid]
    );
    await pool.query(
      `INSERT INTO user_group (user_id, group_id, active)
       VALUES ($1, $2, true)`,
      [req.user.userid, result.rows[0].groupid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505")
      res.status(409).json({ message: "Group name already exists" });
    else res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/additem", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO group_item (groupid, movieshowid, ismovie, title, poster_path, release_year)
       SELECT "group".groupid, $2, $3, $4, $5, $6
       FROM "group"
       WHERE "group".name = $1
         AND NOT EXISTS (
           SELECT 1 FROM group_item 
           WHERE groupid = "group".groupid AND movieshowid = $2
         )
       RETURNING *`,
      [
        req.params.name,
        req.body.movieshowid,
        req.body.ismovie,
        req.body.title,
        req.body.poster_path,
        req.body.release_year,
      ]
    );
    if (result.rows.length === 0)
      res.status(409).json({ message: "Item exists or group missing" });
    else res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/removeitem", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM group_item
       USING "group"
       WHERE "group".groupid = group_item.groupid
         AND "group".name = $1
         AND "group".owner_id = $2
         AND group_item.movieshowid = $3
       RETURNING group_item.*`,
      [req.params.name, req.user.userid, req.body.movieshowid]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or not found" });
    else res.json({ message: "Item removed", item: result.rows[0] });
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
  "/:name/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) res.status(400).json({ message: "No file uploaded" });
      else {
        const result = await pool.query(
          `UPDATE "group" SET avatar_url = $1 WHERE name = $2 AND owner_id = $3 RETURNING *`,
          [req.file.filename, req.params.name, req.user.userid]
        );
        if (result.rows.length === 0)
          res.status(403).json({ message: "Not allowed" });
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
      [req.params.name, req.user.userid]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or not found" });
    else res.json({ message: "Group deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/join/:groupid", verifyToken, async (req, res) => {
  try {
    const check = await pool.query(
      `SELECT groupid, 
              (SELECT COUNT(*) FROM user_group WHERE user_id=$2 AND group_id=$1) AS is_member,
              (SELECT COUNT(*) FROM group_join_request WHERE user_id=$2 AND group_id=$1 AND status='pending') AS has_request
       FROM "group" 
       WHERE groupid=$1`,
      [parseInt(req.params.groupid), req.user.userid]
    );
    if (check.rows.length === 0)
      res.status(404).json({ message: "Group not found" });
    else if (check.rows[0].is_member > 0)
      res.status(409).json({ message: "Already a member" });
    else if (check.rows[0].has_request > 0)
      res.status(409).json({ message: "Request already sent" });
    else {
      const result = await pool.query(
        `INSERT INTO group_join_request (user_id, group_id, status) VALUES ($1,$2,'pending') RETURNING *`,
        [req.user.userid, parseInt(req.params.groupid)]
      );
      res
        .status(201)
        .json({ message: "Join request sent", request: result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/requests/:groupid", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT group_join_request.*, "user".username, "user".avatar_url
       FROM group_join_request
       JOIN "group" ON "group".groupid = group_join_request.group_id
       JOIN "user" ON "user".userid = group_join_request.user_id
       WHERE group_join_request.group_id=$1 AND "group".owner_id=$2 AND group_join_request.status='pending'
       ORDER BY group_join_request.request_date DESC`,
      [parseInt(req.params.groupid), req.user.userid]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/accept/:requestid", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `WITH updated AS (
        UPDATE group_join_request SET status='accepted', response_date=CURRENT_TIMESTAMP
        WHERE requestid=$1 AND status='pending'
        RETURNING user_id, group_id
      )
      INSERT INTO user_group (user_id, group_id, active)
      SELECT user_id, group_id, true FROM updated
      RETURNING *`,
      [parseInt(req.params.requestid)]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or request processed" });
    else res.json({ message: "Request accepted", added: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/reject/:requestid", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE group_join_request SET status='rejected', response_date=CURRENT_TIMESTAMP
       WHERE requestid=$1 AND status='pending'
       RETURNING *`,
      [parseInt(req.params.requestid)]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Not allowed or request processed" });
    else res.json({ message: "Request rejected", request: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT group_join_request.*, "group".name AS group_name, "group".avatar_url AS group_avatar
       FROM group_join_request
       JOIN "group" ON "group".groupid = group_join_request.group_id
       WHERE group_join_request.user_id=$1
       ORDER BY group_join_request.request_date DESC`,
      [req.user.userid]
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
       WHERE "group".groupid = user_group.group_id
         AND "group".name=$1
         AND user_group.user_id=$2
         AND "group".owner_id<>$2
       RETURNING user_group.*`,
      [req.params.name, req.user.userid]
    );
    if (result.rows.length === 0)
      res.status(403).json({ message: "Cannot leave group or not a member" });
    else res.json({ message: "Left group successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
