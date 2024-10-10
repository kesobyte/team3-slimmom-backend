import express from "express";
import { updateUserProfile, getUserProfile } from "../../controllers/userProfileController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

// PUT: /api/profile/:userId
router.put("/update", authenticateToken, updateUserProfile);
// GET: /api/profile
router.get("/fetch", authenticateToken, getUserProfile);

export { router };
