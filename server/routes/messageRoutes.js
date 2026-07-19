import express from 'express';
import { 
  submitMessage, 
  getAdminMessages, 
  deleteMessage 
} from '../controllers/messageController.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

// User Route (Logged-in only)
router.post("/", protect, submitMessage);

// Admin Routes
router.get("/admin/list", protect, adminOnly, getAdminMessages);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
