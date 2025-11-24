import { Router } from "express";
import { pool } from "../helper/db.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
const userRouter = Router();

userRouter.get("/me", verifyToken, (req, res, next) => {
  if (req.user) {
    console.log("Profile requested for user:" + req.user);
    res.status(200).json({
      username: req.user.username,
    });
  } else res.status(200);
});

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

userRouter.post("/logout", (req, res) => {
  res.clearCookie("JWT", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  });

  console.log(req.cookies);

  res.status(200).json({ message: "Logged out" });
});

userRouter.post("/register", (req, res, next) => {
  const { user } = req.body;
  if (!user || !user.username || !user.password) {
    const error = new Error("Username and password are required");
    return next(error);
  } else {
    hash(user.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      else {
        pool.query(
          `INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING *`,
          [user.username, hashedPassword],
          (err, result) => {
            if (err) return next(err);
            else
              res
                .status(201)
                .json({ id: result.rows[0].id, username: user.username });
          }
        );
      }
    });
  }
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

      compare(user.password, dbUser.password, (err, isMatch) => {
        if (err) return next(err);
        else if (!isMatch) {
          const error = new Error("Invalid password");
          error.status = 401;
          return next(error);
        } else {
          const accessToken = jwt.sign(
            { username: dbUser.username },
            SECRET_KEY,
            { expiresIn: "30m" }
          );

          if (accessToken) {
            res.cookie("JWT", accessToken, {
              httpOnly: true,
              secure: false,
              sameSite: "Strict",
              maxAge: 1000 * 60 * 30, // 30 minutes
            });

            res.status(200).json({
              username: dbUser.username,
            });
          } else return next(error);
        }
      });
    }
  );
});

export default userRouter;
