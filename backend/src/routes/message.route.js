import express from "express";
import { messageController } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users",authMiddleware.protectRoute,messageController.getUserForSidebar);

export default router;