import { Router } from "express";
import { pool } from "../helper/db.js";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";
import { verifyToken } from "../middleware/auth.js";

dotenv.config();

const avatarRouter = Router();

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/uploads");
  },
  filename: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("Filetype is not allowed."));
    }

    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

avatarRouter.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    if (!req.file || !req.user) {
      res
        .status(400)
        .json({ message: "No file uploaded or user not authenticated." });
      await fs.unlink(req.file.path);
    } else {
      const meta = await fileTypeFromFile(req.file.path);

      if (!whitelist.includes(meta.mime)) {
        await fs.unlink(req.file.path);
        res.status(400).json({ message: "Invalid file" });
      } else {
        console.log(req.file);

        pool.query(
          `UPDATE "user" SET avatar_path = $1 WHERE username = $2 RETURNING *`,
          [req.file.filename, req.user.username],
          (err, result) => {
            if (err) {
              console.error(
                "Database error during avatar update:",
                err.message
              );
              res.status(500).json({ error: "Failed to update database" });
            }

            res.status(200).json({
              message: "Avatar updated successfully.",
              user: result.rows[0],
              file: req.file,
            });
          }
        );
      }
    }
  }
);

export default avatarRouter;
