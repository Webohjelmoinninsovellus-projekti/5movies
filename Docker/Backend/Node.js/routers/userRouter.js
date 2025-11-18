import { Router } from "express";
import { pool } from "../helper/db.js";

const userRouter = Router();

userRouter.get("/:username", (req, res, next) => {
  const { user } = req.body;
  if (!user || !user.username) {
    const error = new Error("Username is required");
    return next(error);
  }

  pool.query(
    `SELECT username FROM "user" WHERE username = ($1)`,
    [user.username],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json(result.rows);
    }
  );
});

userRouter.post("/register", (req, res, next) => {
  const { user } = req.body;
  if (!user || !user.username || !user.password) {
    const error = new Error("Username and password are required");
    return next(error);
  }

  pool.query(
    `INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING *`,
    [user.username, user.password],
    (err, result) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      res.status(201).json({ id: result.rows[0].id, username: user.username });
    }
  );
});

userRouter.post("/login", (req, res, next) => {
  const { user } = req.body;
  if (!user || !user.username || !user.password) {
    const error = new Error("Username and password are required");
    error.status = 401;
    return next(error);
  }
  pool.query(
    `SELECT * FROM "user" WHERE username = $1`,
    [user.username],
    (err, result) => {
      if (err) return next(err);
      if (result.rows.length === 0) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
      }
      const dbUser = result.rows[0];
      /*       compare(user.password, dbUser.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) {
          const error = new Error("Invalid password");
          error.status = 401;
          return next(error);
        }
      }); */

      res.status(200).json({
        username: dbUser.username,
      });
    }
  );
});

export default userRouter;
