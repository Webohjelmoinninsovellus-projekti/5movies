import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import { uploadAvatar } from "../controllers/avatarController.js";

const avatarRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + "/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + require("path").extname(file.originalname)),
});
const upload = multer({ storage });

avatarRouter.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  uploadAvatar
);

export default avatarRouter;
