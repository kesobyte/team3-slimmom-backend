import express from "express";
import { updateUserProfile, getUserProfile } from "../../controllers/userProfileController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Update the user profile information of the authenticated user. Private.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 description: The user's height in centimeters
 *               dWeight:
 *                 type: number
 *                 description: The user's desired weight in kilograms
 *               age:
 *                 type: number
 *                 description: The user's age
 *               cWeight:
 *                 type: number
 *                 description: The user's current weight in kilograms
 *               bloodType:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 description: The user's blood type 1 for A, 2 for B, 3 for AB, 4 for O
 *             required:
 *               - height
 *               - dWeight
 *               - age
 *               - cWeight
 *               - bloodType
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User profile updated successfully"
 *                 userProfile:
 *                   type: object
 *                   properties:
 *                     height:
 *                       type: number
 *                     dWeight:
 *                       type: number
 *                     age:
 *                       type: number
 *                     cWeight:
 *                       type: number
 *                     bloodType:
 *                       type: integer
 *       400:
 *         description: Invalid or missing input fields
 *       401:
 *         description: Unauthorized - user must be authenticated
 */

// PUT: https://goit-slimmom-team-03d472951ab141/api/profile/update
router.put("/update", authenticateToken, updateUserProfile);

/**
 * @swagger
 * /api/profile/fetch:
 *   get:
 *     summary: Retrieve the profile information of the currently authenticated user. Private.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 height:
 *                   type: number
 *                 dWeight:
 *                   type: number
 *                 age:
 *                   type: number
 *                 cWeight:
 *                   type: number
 *                 bloodType:
 *                   type: integer
 *                   description: The user's blood type 1 for A, 2 for B, 3 for AB, 4 for O
 *                 dailyCalories:
 *                   type: number
 *                   description: The user's daily calorie intake goal
 *       401:
 *         description: Unauthorized - user must be authenticated
 *       404:
 *         description: User profile not found
 */

// GET: https://goit-slimmom-team-03d472951ab141/api/profile/fetch
router.get("/fetch", authenticateToken, getUserProfile);

export { router };
