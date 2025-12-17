import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  listGroups,
  getGroupByName,
  getMembers,
  createGroup,
  addItem,
  removeItem,
  uploadIcon,
  deleteGroup,
  joinGroup,
  getRequests,
  acceptRequest,
  rejectRequest,
  myRequests,
  leaveGroup,
} from "../controllers/groupController.js";
import multer from "multer";

const groupRouter = Router();

groupRouter.get("/", listGroups);
groupRouter.get("/:name", getGroupByName);
groupRouter.get("/members/:name", getMembers);
groupRouter.post("/create", verifyToken, createGroup);
groupRouter.post("/:name/add-item", verifyToken, addItem);
groupRouter.delete("/:name/remove-item", verifyToken, removeItem);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.cwd() + "/uploads"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

groupRouter.post("/:name/icon", verifyToken, upload.single("icon"), uploadIcon);
groupRouter.delete("/:name", verifyToken, deleteGroup);
groupRouter.post("/join/:groupId", verifyToken, joinGroup);
groupRouter.get("/requests/:groupId", verifyToken, getRequests);
groupRouter.post("/accept/:requestId", verifyToken, acceptRequest);
groupRouter.post("/reject/:requestId", verifyToken, rejectRequest);
groupRouter.get("/my-requests", verifyToken, myRequests);
groupRouter.post("/:name/leave", verifyToken, leaveGroup);

export default groupRouter;
