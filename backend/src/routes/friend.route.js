import express from "express";
import { friendController } from "../controllers/friend.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-request/:userId", authMiddleware.protectRoute, friendController.sendFriendRequest);
router.put("/accept-request/:userId", authMiddleware.protectRoute, friendController.acceptFriendRequest);
router.put("/reject-request/:userId", authMiddleware.protectRoute, friendController.rejectFriendRequest);
router.delete("/remove-friend/:userId", authMiddleware.protectRoute, friendController.removeFriend);
router.get("/my-friends", authMiddleware.protectRoute, friendController.getFriends);
router.get("/friend-requests", authMiddleware.protectRoute, friendController.getFriendRequests);
router.get("/sent-requests", authMiddleware.protectRoute, friendController.getSentRequests);

export default router;