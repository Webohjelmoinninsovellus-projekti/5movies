import dotenv from "dotenv";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

import {
  getAvatarFromUsername,
  getProfileByUsername,
  getGroupsByUsername,
  insertUser,
  findUserForAuth,
  reactivateUser,
  deactivateUserModel,
  deleteUserByCredentials,
} from "../models/userModel.js";

dotenv.config();
const SECRET_KEY = process.env.BACKEND_SECRET_KEY;

async function getAuthenticatedProfile(req, res, next) {
  try {
    if (req.user) {
      console.log("Profile requested for user:" + req.user.username);

      const user = await getAvatarFromUsername(req.user.username);
      if (!user) {
        return res
          .status(500)
          .json({ message: "Error retrieving profile data." });
      }

      return res.status(200).json({
        username: req.user.username,
        avatar: user.avatar_path,
      });
    } else {
      return res.status(401).json({ message: "Not authenticated." });
    }
  } catch (e) {
    next(e);
  }
}

async function getPublicProfile(req, res, next) {
  try {
    const username = req.params.username;
    if (!username) {
      const error = new Error("Username is required.");
      return next(error);
    }
    const profile = await getProfileByUsername(username);
    return res.status(200).json(profile);
  } catch (e) {
    next(e);
  }
}

async function getUserGroups(req, res, next) {
  try {
    const { username } = req.params;
    if (!username) {
      const error = new Error("Username is required.");
      return next(error);
    }
    const groups = await getGroupsByUsername(username);
    return res.status(200).json(groups);
  } catch (e) {
    next(e);
  }
}

async function registerUser(req, res, next) {
  try {
    const { user } = req.body;
    if (!user || !user.username || !user.password) {
      const error = new Error("Username and password are required.");
      return next(error);
    }
    hash(user.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);
      try {
        const created = await insertUser(user.username, hashedPassword);
        return res.status(201).json({
          id: created.id_user || created.id,
          username: created.username,
        });
      } catch (e) {
        return next(e);
      }
    });
  } catch (e) {
    next(e);
  }
}

async function loginUser(req, res, next) {
  try {
    const { user } = req.body;
    if (!user || !user.username || !user.password) {
      const error = new Error("Username and password are required");
      error.status = 401;
      return next(error);
    }

    const dbUser = await findUserForAuth(user.username);
    if (!dbUser) {
      const error = new Error("User not found.");
      error.status = 404;
      return next(error);
    }

    compare(user.password, dbUser.password, async (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) {
        const error = new Error("Invalid password.");
        error.status = 401;
        return next(error);
      }

      const accessToken = jwt.sign(
        {
          username: dbUser.username,
          user_id: dbUser.id_user,
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

        if (dbUser.deactivation_date != null) {
          try {
            await reactivateUser(dbUser.username, dbUser.password);
          } catch (e) {
            console.error("Failed to reactivate user:", e);
          }
        }

        return res.status(200).json({
          username: dbUser.username,
        });
      }
    });
  } catch (e) {
    next(e);
  }
}

function logoutUser(req, res) {
  res.clearCookie("JWT", {
    httpOnly: true,
    sameSite: "Strict",
    secure: false,
  });
  return res.status(200).json({ message: "Logged out." });
}

async function deactivateUser(req, res, next) {
  try {
    const { user } = req.body;
    if (!user || !user.username || !user.password) {
      const error = new Error("Username and password are required");
      error.status = 401;

      return next(error);
    }

    const dbUser = await findUserForAuth(user.username);
    if (!dbUser) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    compare(user.password, dbUser.password, async (err, isMatch) => {
      if (err) return next(err);
      if (!isMatch) {
        const error = new Error("Invalid password");
        error.status = 401;
        return next(error);
      }

      const updated = await deactivateUserModel(
        dbUser.username,
        dbUser.password
      );
      if (!updated) {
        return next(
          new Error("Failed to deactivate user or already deactivated")
        );
      }
      return res.status(200).json();
    });
  } catch (e) {
    next(e);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { user } = req.body;
    if (!user || !user.username || !user.password) {
      const error = new Error("Username and password are required");
      error.status = 401;

      return next(error);
    }

    const deleted = await deleteUserByCredentials(user.username, user.password);
    if (!deleted) {
      const error = new Error("User not found or invalid credentials");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (e) {
    next(e);
  }
}

export {
  getAuthenticatedProfile,
  getPublicProfile,
  getUserGroups,
  registerUser,
  loginUser,
  logoutUser,
  deactivateUser,
  deleteAccount,
};
