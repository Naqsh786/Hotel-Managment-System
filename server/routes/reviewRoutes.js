import express from "express";
import { 
  createReview, 
  getRoomReviews, 
  getAllReviewsAdmin, 
  deleteReview 
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/room/:roomId", getRoomReviews);

// Admin routes
router.get("/admin", protect, adminOnly, getAllReviewsAdmin);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;
