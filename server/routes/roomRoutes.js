import express from "express";
import { 
  addRoom, 
  getAdminRooms, 
  getAllRooms, 
  getRoomById, 
  updateRoom, 
  deleteRoom 
} from "../controllers/roomController.js";
import upload from "../middlewares/upload.js";
import { protect, adminOnly, staffOrAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public Routes
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Admin Routes (Protected)
router.post("/", protect, adminOnly, upload.array("images", 10), addRoom);
router.get("/admin/list", protect, adminOnly, getAdminRooms);
router.put("/:id", protect, staffOrAdmin, upload.array("images", 10), updateRoom);

router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
