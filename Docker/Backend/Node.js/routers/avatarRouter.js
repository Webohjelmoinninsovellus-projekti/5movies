import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middleware/auth.js";
import { uploadAvatar } from "../controllers/avatarController.js";

const avatarRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + "/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

var maxSize = 2 * 1000 * 1000;

const upload = multer({ storage, limits: { fileSize: maxSize } });

avatarRouter.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  uploadAvatar
);

export default avatarRouter;
