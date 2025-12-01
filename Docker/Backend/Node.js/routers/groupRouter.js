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

groupRouter.get("/:name", (req, res, next) => {
  const name = req.params.name;
  if (!name) {
    const error = new Error("Group name is required");
    return next(error);
  }

  pool.query(
    `SELECT * FROM "group" WHERE name = ($1)`,
    [name],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows[0]);
    }
  );
});

groupRouter.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, desc } = req.body;

    const result = await pool.query(
      'INSERT INTO "group" (name, "desc", datecreated, active) VALUES ($1, $2, CURRENT_DATE, true) RETURNING *',
      [name, desc]
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
      [groupname, movieshowid]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Item already in group" });
    }

    const result = await pool.query(
      `INSERT INTO group_item 
       (groupid, movieshowid, ismovie, title, poster_path, release_year, added_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        groupname,
        movieshowid,
        ismovie,
        title,
        poster_path,
        release_year,
        username,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default groupRouter;
