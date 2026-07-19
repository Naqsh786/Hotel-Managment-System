import express from "express";
import { 
  createBooking, 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  getMyBookings
} from "../controllers/bookingController.js";
import { protect, adminOnly, softProtect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", softProtect, createBooking);

// Admin routes
router.get("/me", protect, getMyBookings);
router.get("/admin", protect, getAllBookings);
router.patch("/:id/status", protect, updateBookingStatus);
router.delete("/:id", protect, adminOnly, deleteBooking);

export default router;
