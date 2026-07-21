import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/explore", authMiddleware.protectRoute, userController.getExploreUsers);
router.get("/search", authMiddleware.protectRoute, userController.searchUsers);

export default router;