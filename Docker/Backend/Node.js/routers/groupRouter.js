import { Router } from "express";
import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

const groupRouter = Router();

groupRouter.get("/", (req, res, next) => {
  pool.query(`SELECT * FROM "group"`, (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.status(200).json(result.rows);
  });
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
      `SELECT * FROM group_item
      WHERE group_id = $1
      ORDER BY date_added DESC`,
      [group.group_id]
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
    const { name, description } = req.body;

    const result = await pool.query(
      'INSERT INTO "group" (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

groupRouter.post("/:name/additem", verifyToken, async (req, res) => {
  try {
    const groupName = req.params.name;
    const { isMovie, itemId, itemTitle, releaseYear, posterPath } = req.body;

    const groupResult = await pool.query(
      `SELECT * FROM "group" WHERE name = $1`,
      [groupName]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    const groupId = groupResult.rows[0].group_id;

    const exists = await pool.query(
      `SELECT * FROM group_item
      WHERE item_id = $1 AND group_id = $2`,
      [itemId, groupId]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Item already in group" });
    }

    const result = await pool.query(
      `INSERT INTO group_item
       (is_movie, item_id, item_title, poster_path, release_year, group_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [isMovie, itemId, itemTitle, posterPath, releaseYear, groupId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
