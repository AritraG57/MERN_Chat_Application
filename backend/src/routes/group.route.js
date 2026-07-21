import express from "express";
import { groupController } from "../controllers/group.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/create", authMiddleware.protectRoute, groupController.createGroup);
router.get("/my-groups", authMiddleware.protectRoute, groupController.getGroups);
router.get("/:groupId", authMiddleware.protectRoute, groupController.getGroup);
router.put("/add-member/:groupId", authMiddleware.protectRoute, groupController.addMember);
router.put("/remove-member/:groupId", authMiddleware.protectRoute, groupController.removeMember);
router.put("/leave/:groupId", authMiddleware.protectRoute, groupController.leaveGroup);
router.put("/rename/:groupId", authMiddleware.protectRoute, groupController.renameGroup);
router.put("/update-picture/:groupId", authMiddleware.protectRoute, groupController.updateGroupPicture);
router.delete("/:groupId", authMiddleware.protectRoute, groupController.deleteGroup);
router.put("/make-admin/:groupId",authMiddleware.protectRoute,groupController.makeAdmin);
router.put("/remove-admin/:groupId",authMiddleware.protectRoute,groupController.removeAdmin);
// Get the available members for adding in group
router.get("/available-members/:groupId",authMiddleware.protectRoute,groupController.getAvailableMembers);


export default router;