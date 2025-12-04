import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const groupRouter = Router();

// Varmista että uploads-kansio on olemassa
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

groupRouter.get("/", verifyToken, (req, res, next) => {
  const { my } = req.query;

  // Jos ?my=true, palauta käyttäjän ryhmät JA ryhmät joissa omistaja
  if (my === "true") {
    const userid = req.user.userid;
    pool.query(
      `SELECT DISTINCT "group".* FROM "group"
       LEFT JOIN "user_group" ON "group".groupid = "user_group".group_id
       WHERE ("user_group".user_id = $1 AND "user_group".active = true)
          OR "group".owner_id = $1
       ORDER BY "group".name`,
      [userid],
      (err, result) => {
        if (err) res.status(500).json({ error: err.message });
        else res.status(200).json(result.rows);
      }
    );
  } else {
    // Muuten palauta kaikki ryhmät
    pool.query(`SELECT * FROM "group"`, (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    });
  }
});

groupRouter.get("/members/:name", (req, res) => {
  const { name } = req.params;
  if (!name) {
    const error = new Error("Username is required");
    return next(error);
  }
  pool.query(
    `SELECT
     "user".username,
     "user".avatar_url
     FROM
     "user"
     INNER JOIN
     "user_group" ON "user".userid = "user_group".user_id
     INNER JOIN
     "group" ON "user_group".group_id = "group".groupid
     WHERE
     "group".name = $1
     ORDER BY
     ("user".userid = "group".owner_id) DESC,
     "user".username ASC`,
    [name],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    }
  );
});

groupRouter.get("/:name", async (req, res, next) => {
  const name = req.params.name;
  if (!name) {
    const error = new Error("Group name is required");
    return next(error);
  }

  try {
    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name = $1`,
      [name]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const group = groupResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT * FROM group_item WHERE groupid = $1 ORDER BY dateadded DESC`,
      [group.groupid]
    );

    const groupWithItems = {
      ...group,
      items: itemsResult.rows,
    };

    res.status(200).json(groupWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, desc } = req.body;
    const ownerid = req.user.userid;

    const existingGroup = await pool.query(
      'SELECT * FROM "group" WHERE name = $1',
      [name]
    );
    if (existingGroup.rows.length > 0) {
      return res.status(409).json({ message: "Group name already exists" });
    }

    const result = await pool.query(
      'INSERT INTO "group" (name, "desc", owner_id, datecreated, active) VALUES ($1, $2, $3, CURRENT_DATE, true) RETURNING *',
      [name, desc, ownerid]
    );

    const groupid = result.rows[0].groupid;

    await pool.query(
      'INSERT INTO "user_group" (user_id, group_id) VALUES ($1, $2)',
      [ownerid, groupid]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/additem", verifyToken, async (req, res) => {
  try {
    const groupname = req.params.name;
    const { movieshowid, ismovie, title, poster_path, release_year } = req.body;
    const username = req.user.username;

    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name=$1`,
      [groupname]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const groupid = groupResult.rows[0].groupid;

    const exists = await pool.query(
      `SELECT * FROM group_item WHERE groupid=$1 AND movieshowid=$2`,
      [groupid, movieshowid]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Item already in group" });
    }

    const result = await pool.query(
      `INSERT INTO group_item 
       (groupid, movieshowid, ismovie, title, poster_path, release_year)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [groupid, movieshowid, ismovie, title, poster_path, release_year]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/removeitem", verifyToken, async (req, res) => {
  try {
    const groupname = req.params.name;
    const { movieshowid } = req.body;
    const username = req.user.username;

    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name=$1`,
      [groupname]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const group = groupResult.rows[0];

    if (group.owner_id !== req.user.userid) {
      return res
        .status(403)
        .json({ message: "Only group owner can remove items" });
    }

    const result = await pool.query(
      `DELETE FROM group_item WHERE groupid=$1 AND movieshowid=$2 RETURNING *`,
      [group.groupid, movieshowid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found in group" });
    }

    res
      .status(200)
      .json({ message: "Item removed successfully", item: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "group-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

groupRouter.post(
  "/:name/avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { name } = req.params;
      const userid = req.user.userid;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const groupResult = await pool.query(
        `SELECT * FROM "group" WHERE name = $1`,
        [name]
      );

      if (groupResult.rows.length === 0) {
        return res.status(404).json({ message: "Group not found" });
      }

      const group = groupResult.rows[0];

      if (group.owner_id !== userid) {
        return res
          .status(403)
          .json({ message: "Only group owner can change avatar" });
      }

      const result = await pool.query(
        `UPDATE "group" SET avatar_url = $1 WHERE name = $2 RETURNING *`,
        [req.file.filename, name]
      );

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

groupRouter.post("/:name/leave", verifyToken, async (req, res) => {
  try {
    const { name } = req.params;
    const userid = req.user.userid;

    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name = $1`,
      [name]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const group = groupResult.rows[0];

    if (group.owner_id === userid) {
      return res.status(403).json({
        message: "Owner cannot leave the group. Delete the group instead.",
      });
    }

    const memberCheck = await pool.query(
      `SELECT * FROM user_group WHERE user_id = $1 AND group_id = $2`,
      [userid, group.groupid]
    );

    if (memberCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "You are not a member of this group" });
    }

    await pool.query(
      `DELETE FROM user_group WHERE user_id = $1 AND group_id = $2`,
      [userid, group.groupid]
    );

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

groupRouter.delete("/:name", verifyToken, async (req, res) => {
  try {
    const { name } = req.params;
    const userid = req.user.userid;

    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name = $1`,
      [name]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const group = groupResult.rows[0];

    if (group.owner_id !== userid) {
      return res.status(403).json({
        message: "Only group owner can delete the group",
      });
    }

    // Delete group and all related records in one transaction
    await pool.query(
      `WITH deleted_items AS (DELETE FROM group_item WHERE groupid = $1),
           deleted_members AS (DELETE FROM user_group WHERE group_id = $1),
           deleted_requests AS (DELETE FROM group_join_request WHERE group_id = $1)
       DELETE FROM "group" WHERE groupid = $1`,
      [group.groupid]
    );

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 1. LÄHETÄ LIITTYMISPYYNTÖ
groupRouter.post("/join/:groupid", verifyToken, async (req, res) => {
  try {
    const groupid = parseInt(req.params.groupid);
    const userid = req.user.userid;

    // Tarkista ryhmä, jäsenyys ja aiemmat pyynnöt yhdellä kyselyllä
    const check = await pool.query(
      `SELECT 
        g.groupid,
        (SELECT COUNT(*) FROM user_group WHERE user_id = $2 AND group_id = $1) as is_member,
        (SELECT COUNT(*) FROM group_join_request WHERE user_id = $2 AND group_id = $1 AND status = 'pending') as has_request
      FROM "group" g WHERE g.groupid = $1`,
      [groupid, userid]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (check.rows[0].is_member > 0) {
      return res.status(409).json({ message: "Already a member" });
    }

    if (check.rows[0].has_request > 0) {
      return res.status(409).json({ message: "Request already sent" });
    }

    // Luo pyyntö
    const result = await pool.query(
      "INSERT INTO group_join_request (user_id, group_id, status) VALUES ($1, $2, $3) RETURNING *",
      [userid, groupid, "pending"]
    );

    res.status(201).json({
      message: "Join request sent successfully",
      request: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. HAE RYHMÄN PYYNNÖT (vain omistaja)
groupRouter.get("/requests/:groupid", verifyToken, async (req, res) => {
  try {
    const groupid = parseInt(req.params.groupid);
    const userid = req.user.userid;

    // Tarkista että käyttäjä on ryhmän omistaja
    const ownerCheck = await pool.query(
      'SELECT * FROM "group" WHERE groupid = $1 AND owner_id = $2',
      [groupid, userid]
    );
    if (ownerCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ message: "Only group owner can view requests" });
    }

    // Hae odottavat pyynnöt
    const result = await pool.query(
      `SELECT 
        gjr.requestid,
        gjr.user_id,
        gjr.group_id,
        gjr.status,
        gjr.request_date,
        u.username,
        u.avatar_url
      FROM group_join_request gjr
      JOIN "user" u ON u.userid = gjr.user_id
      WHERE gjr.group_id = $1 AND gjr.status = 'pending'
      ORDER BY gjr.request_date DESC`,
      [groupid]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. HYVÄKSY PYYNTÖ
groupRouter.post("/accept/:requestid", verifyToken, async (req, res) => {
  try {
    const requestid = parseInt(req.params.requestid);
    const userid = req.user.userid;

    // Hae pyyntö ja tarkista omistajuus
    const requestData = await pool.query(
      `SELECT gjr.*, g.owner_id 
       FROM group_join_request gjr
       JOIN "group" g ON g.groupid = gjr.group_id
       WHERE gjr.requestid = $1`,
      [requestid]
    );

    if (requestData.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = requestData.rows[0];

    if (request.owner_id !== userid) {
      return res
        .status(403)
        .json({ message: "Only group owner can accept requests" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Päivitä pyyntö ja lisää käyttäjä ryhmään yhdessä transaktiossa
    await pool.query(
      `WITH updated AS (
        UPDATE group_join_request 
        SET status = 'accepted', response_date = CURRENT_TIMESTAMP 
        WHERE requestid = $1 RETURNING user_id, group_id
      )
      INSERT INTO user_group (user_id, group_id, active)
      SELECT user_id, group_id, true FROM updated`,
      [requestid]
    );

    res.status(200).json({ message: "Request accepted, user added to group" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. HYLKÄÄ PYYNTÖ
groupRouter.post("/reject/:requestid", verifyToken, async (req, res) => {
  try {
    const requestid = parseInt(req.params.requestid);
    const userid = req.user.userid;

    // Hae pyyntö ja tarkista omistajuus
    const requestData = await pool.query(
      `SELECT gjr.*, g.owner_id 
       FROM group_join_request gjr
       JOIN "group" g ON g.groupid = gjr.group_id
       WHERE gjr.requestid = $1`,
      [requestid]
    );

    if (requestData.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const request = requestData.rows[0];

    if (request.owner_id !== userid) {
      return res
        .status(403)
        .json({ message: "Only group owner can reject requests" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Päivitä pyyntö hylätyksi
    await pool.query(
      "UPDATE group_join_request SET status = $1, response_date = CURRENT_TIMESTAMP WHERE requestid = $2",
      ["rejected", requestid]
    );

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. HAE OMAT PYYNNÖT
groupRouter.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const userid = req.user.userid;

    const result = await pool.query(
      `SELECT 
        gjr.*,
        g.name as group_name,
        g.avatar_url as group_avatar
      FROM group_join_request gjr
      JOIN "group" g ON g.groupid = gjr.group_id
      WHERE gjr.user_id = $1
      ORDER BY gjr.request_date DESC`,
      [userid]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
