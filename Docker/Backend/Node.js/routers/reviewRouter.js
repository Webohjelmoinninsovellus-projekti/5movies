import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getReviews, addReview } from "../controllers/reviewController.js";

const reviewRouter = Router();

reviewRouter.get("/:type/:id", getReviews);
reviewRouter.post("/add", verifyToken, addReview);

export default reviewRouter;
