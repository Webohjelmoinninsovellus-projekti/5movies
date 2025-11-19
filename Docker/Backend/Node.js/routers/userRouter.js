import { Router } from "express";
import { pool } from "../helper/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
const userRouter = Router();

userRouter.get("/:username", (req, res, next) => {
  const username = req.params.username;
  if (!username) {
    const error = new Error("Username is required");
    return next(error);
  }

  pool.query(
    `SELECT * FROM "user" WHERE username = ($1) AND active = true`,
    [username],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else res.status(200).json(result.rows[0]);
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
        if (err.code === "23505") {
          res.status(409).json({ message: "Username already exists" });
        } else res.status(500).json({ message: "Internal server error" });
      } else
        res
          .status(201)
          .json({ id: result.rows[0].id, username: user.username });
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
    `SELECT * FROM "user" WHERE username = $1 AND password = $2`,
    [user.username, user.password],
    (err, result) => {
      if (err) return next(err);
      if (result.rows.length === 0) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
      }

      const dbUser = result.rows[0];

      // PASSWORD CRYPT CHECK
      /*       compare(user.password, dbUser.password, (err, isMatch) => {
        if (err) return next(err);
        if (!isMatch) {
          const error = new Error("Invalid password");
          error.status = 401;
          return next(error);
        }
      }); */

      const accessToken = jwt.sign({ username: dbUser.username }, SECRET_KEY);

      res.status(200).json({
        username: dbUser.username,
        usertoken: accessToken,
      });
    }
  );
});

export default userRouter;
