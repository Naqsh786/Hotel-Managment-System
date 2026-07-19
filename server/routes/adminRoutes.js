import express from "express";
import { 
  getAllUsers, 
  deleteUser,
  updateUserStatus, 
  getHomeSettings, 
  updateHomeSettings,
  getDashboardStats,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
} from "../controllers/adminController.js";
import { uploadStaff } from "../middlewares/uploadStaff.js";
import { seedDatabase, seedAddons } from "../controllers/seederController.js";
import { getAddons, createAddon, updateAddon, deleteAddon } from "../controllers/addonController.js";
import { getAllAmenities, createAmenity, updateAmenity, deleteAmenity } from "../controllers/amenityController.js";
import { protect, adminOnly, staffOrAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Addon Routes
router.get("/addons", getAddons);
router.post("/addons", protect, adminOnly, createAddon);
router.put("/addons/:id", protect, adminOnly, updateAddon);
router.delete("/addons/:id", protect, adminOnly, deleteAddon);

// Amenity Routes
router.get("/amenities", getAllAmenities);
router.post("/amenities", protect, adminOnly, createAmenity);
router.put("/amenities/:id", protect, adminOnly, updateAmenity);
router.delete("/amenities/:id", protect, adminOnly, deleteAmenity);

router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.patch("/users/:id/status", protect, adminOnly, updateUserStatus);
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

// Home Settings
router.get("/settings/home", getHomeSettings); // Publicly accessible for Home Page
router.put("/settings/home", protect, adminOnly, updateHomeSettings);

// Seeding Route
router.post("/seed-rooms", protect, adminOnly, seedDatabase);
router.post("/seed-addons", protect, adminOnly, seedAddons);

// Staff Routes
router.get("/staff", protect, staffOrAdmin, getStaff);
router.post("/staff", protect, adminOnly, uploadStaff.single("image"), createStaff);
router.put("/staff/:id", protect, staffOrAdmin, uploadStaff.single("image"), updateStaff);
router.delete("/staff/:id", protect, adminOnly, deleteStaff);

export default router;
