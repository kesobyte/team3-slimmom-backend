import express from "express";
import { updateUserProfile, getUserProfile } from "../../controllers/userProfileController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

// PUT: /api/profile/:userId
router.put("/profile", authenticateToken, updateUserProfile);
// GET: /api/profile
router.get("/profile", authenticateToken, getUserProfile);

export { router };
