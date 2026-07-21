import express from "express";
import { messageController } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Group chat
router.get("/group/:groupId", authMiddleware.protectRoute, messageController.getGroupMessages);
router.post("/group/send/:groupId", authMiddleware.protectRoute, messageController.sendGroupMessage); 

// One-to-one chat
router.get("/:id",authMiddleware.protectRoute,messageController.getMessages);
router.post("/send/:id",authMiddleware.protectRoute,messageController.sendMessage);

export default router;