import express from "express";
import {authController} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",authController.signup);
router.post("/login" ,authController.login);
router.post("/logout",authController.logout);

router.put("/update-profile",authMiddleware.protectRoute,authController.updateProfile);

router.get("/check",authMiddleware.protectRoute,authController.checkAuth);

export default router;