import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cron from "node-cron";

import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
const userRouter = Router();

cron.schedule("* 14 * * *", async () => {
  pool.query(
    "DELETE FROM public.user WHERE active = false AND CURRENT_DATE - deactivation_date >= 1",
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );
});

userRouter.get("/me", verifyToken, (req, res) => {
  if (req.user) {
    console.log("Profile requested for user:" + req.user.username);

    pool.query(
      `SELECT avatar_url FROM "user" WHERE username = $1`,
      [req.user.username],
      (err, result) => {
        if (err) {
          res.status(500).json({ message: "Error retrieving profile data." });
        }

        res.status(200).json({
          username: req.user.username,
          avatar: result.rows[0].avatar_url,
        });
      }
    );
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

userRouter.get("/:username/groups", (req, res) => {
  const { username } = req.params;
  if (!username) {
    const error = new Error("Username is required");
    return next(error);
  }
  pool.query(
    `SELECT "group".name, "group".groupid, (SELECT COUNT("user_group".user_id) FROM "user_group" WHERE "user_group".group_id = "group".groupid)
     FROM user_group
     INNER JOIN "user" ON user_group.user_id = "user".userid
     INNER JOIN "group" ON user_group.group_id = "group".groupid
     WHERE "user".username = $1`,
    [username],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows);
    }
  );
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
      if (err) res.status(500).json({ error: err.message });
      else res.status(200).json(result.rows[0]);
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
            {
              username: dbUser.username,
              userid: dbUser.userid,
            },
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

            if (dbUser.active == false) {
              pool.query(
                "UPDATE public.user SET active = true, deactivation_date = null WHERE active = false AND username = $1 AND password = $2",
                [dbUser.username, dbUser.password],

                (err, result) => {
                  if (err) return next(err);
                }
              );
            }
            res.status(200).json({
              username: dbUser.username,
            });
          }
        }
      });
    }
  );
});

userRouter.put("/deactivate", (req, res, next) => {
  const { user } = req.body;
  if (!user || !user.username || !user.password) {
    const error = new Error("Username and password are required");
    error.status = 401;
    return next(error);
  }

  pool.query(
    "SELECT * FROM public.user WHERE username = $1",
    [user.username],
    (err, result) => {
      if (err) return next(err);
      if (result.rows.length === 0) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error);
      } else {
        const dbUser = result.rows[0];

        compare(user.password, dbUser.password, (err, isMatch) => {
          if (err) return next(err);
          else if (!isMatch) {
            const error = new Error("Invalid password");
            error.status = 401;
            return next(error);
          } else {
            pool.query(
              "UPDATE public.user SET active = false, deactivation_date = CURRENT_DATE WHERE active = true AND username = $1 AND password = $2",
              [user.username, dbUser.password],

              (err, result) => {
                if (err) return next(err);
                else res.status(200).json();
              }
            );
          }
        });
      }
    }
  );
});

userRouter.delete("/delete", (req, res, next) => {});

export default userRouter;
