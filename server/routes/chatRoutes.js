import express from "express";
import { getChatHistory, getActiveChats, sendMessage, markRead } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/history/:roleOrUserId", protect, getChatHistory);
router.get("/active", protect, getActiveChats);
router.post("/send", protect, sendMessage);
router.post("/mark-read", protect, markRead);

export default router;
