import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";
import { updateAvatar } from "../models/avatarModel.js";

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file || !req.user) {
      if (req.file) await fs.unlink(req.file.path);
      return res
        .status(400)
        .json({ message: "No file uploaded or user not authenticated." });
    }
    const meta = await fileTypeFromFile(req.file.path);
    if (!whitelist.includes(meta.mime)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ message: "Invalid file." });
    }

    const updated = await updateAvatar(req.file.filename, req.user.username);
    if (!updated)
      return res.status(500).json({ error: "Failed to update database." });
    return res.status(200).json({
      message: "Avatar updated successfully.",
      user: updated,
      file: req.file,
    });
  } catch (e) {
    next(e);
  }
}
