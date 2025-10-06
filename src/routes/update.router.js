import express from "express";
import {
  updateUserName,
  updateFullName,
  updateProfilePic,
  updateAvatar,
} from "../controllers/update.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.patch("/userName", protectRoute, updateUserName);
router.patch("/fullName", protectRoute, updateFullName);
router.patch("/profilePic", protectRoute, updateProfilePic);
router.patch("/avatar", protectRoute, updateAvatar);

export default router;
