import express from "express";
import { 
  createServiceRequest, 
  getMyServiceRequests, 
  getAllServiceRequests, 
  updateServiceStatus 
} from "../controllers/serviceRequestController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createServiceRequest);
router.get("/me", protect, getMyServiceRequests);
router.get("/admin", protect, getAllServiceRequests);
router.patch("/:id", protect, updateServiceStatus);

export default router;
