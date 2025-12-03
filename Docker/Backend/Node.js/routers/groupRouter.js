import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const groupRouter = Router();

groupRouter.get("/", (req, res, next) => {
  pool.query(`SELECT * FROM "group"`, (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.status(200).json(result.rows);
  });
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

    await pool.query(`DELETE FROM group_item WHERE groupid = $1`, [
      group.groupid,
    ]);
    await pool.query(`DELETE FROM user_group WHERE group_id = $1`, [
      group.groupid,
    ]);

    await pool.query(`DELETE FROM "group" WHERE groupid = $1`, [group.groupid]);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/group/:groupId/request", async (req, res) => {
  const userId = req.user.id;
  const groupId = req.params.groupId;

  const [existing] = await db.query(
    "SELECT * FROM user_group WHERE user_id = ? AND group_id = ?",
    [userId, groupId]
  );

  if (rows.length > 0) {
    if (rows[0].active === 1) {
      return res.json({ message: "already_member" });
    } else {
      return res.json({ message: "already_requested" });
    }
  }

  await db.query(
    "INSERT INTO user_group (user_id, group_id, active) VALUES (?, ?, false)",
    [userId, groupId]
  );

  res.json({ message: "request_sent" });
});

groupRouter.post("/group/:groupId/approve/:userId", async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.params.userId;

  await db.query(
    "UPDATE user_group SET active = true WHERE user_id = ? AND group_id = ?",
    [userId, groupId]
  );

  res.json({ message: "approved" });
});

groupRouter.get("/group/:groupId/requests", async (req, res) => {
  const groupId = req.params.groupId;

  const requests = await db.query(
    `
    SELECT user_group.user_id, users.username
    FROM user_group
    JOIN users ON users.id = user_group.user_id
    WHERE user_group.group_id = ? AND user_group.active = false
  `,
    [groupId]
  );

  res.json(requests);
});

// Lisää ENNEN "export default groupRouter;"
groupRouter.post("/:name/request", verifyToken, async (req, res) => {
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

    // Tarkista onko käyttäjä jo ryhmässä tai pyytänyt
    const existing = await pool.query(
      `SELECT * FROM user_group WHERE user_id = $1 AND group_id = $2`,
      [userid, group.groupid]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].active === true) {
        return res.status(409).json({ message: "You are already a member" });
      } else {
        return res.status(409).json({ message: "Request already sent" });
      }
    }

    // Luo uusi liittymispyyntö (active = false)
    await pool.query(
      `INSERT INTO user_group (user_id, group_id, active) VALUES ($1, $2, false)`,
      [userid, group.groupid]
    );

    res.status(201).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
