import { Router } from "express";
import dotenv from "dotenv";
import cron from "node-cron";

import { pool } from "../helper/db.js";
import { verifyToken } from "../middleware/auth.js";

import {
  getAuthenticatedProfile,
  getPublicProfile,
  getUserGroups,
  registerUser,
  loginUser,
  logoutUser,
  deactivateUser,
  deleteAccount,
} from "../controllers/userController.js";

dotenv.config();

const userRouter = Router();

cron.schedule("* 14 * * *", async () => {
  pool.query(
    "DELETE FROM public.user WHERE active = false AND CURRENT_DATE - deactivation_date >= 30",
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );
});

userRouter.get("/me", verifyToken, getAuthenticatedProfile);
userRouter.get("/:username/groups", getUserGroups);
userRouter.get("/:username", getPublicProfile);
userRouter.post("/logout", logoutUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/deactivate", deactivateUser);
userRouter.delete("/delete", deleteAccount);

export default userRouter;
