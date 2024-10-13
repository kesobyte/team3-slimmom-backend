import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail, refreshTokens} from "../../controllers/authController.js"
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
*   post:
 *     summary: Register a new user. Public.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name (must be between 3 and 30 characters)
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password (minimum 6 characters)
 *                 example: "password123"
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Account created successfully. A verification email is sent to the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                   description: The details of the newly registered user
 *                 message:
 *                   type: string
 *                   example: "Account created successfully"
 *       400:
 *         description: Validation error - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 *       409:
 *         description: Conflict - Email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already registered"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/auth/register
router.post("/register", register);

/**
 * @swagger
 * /api/auth/verify/{verificationToken}:
 *   get:
 *     summary: Verify a user's email address. Public.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: verificationToken
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully"
 *       400:
 *         description: Invalid or expired verification token
 */

// GET: https://goit-slimmom-team-03d472951ab141/api/auth/verify/6702595e9b21ebd131247e36
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Resend a verification email. Public.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting verification
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification email sent successfully"
 *       400:
 *         description: Invalid email address or user already verified
 *       404:
 *         description: User not found
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/auth/verify
router.post("/verify", ctrlWrapper(resendVerifyEmail));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user. Public.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's account password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token for authentication
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for obtaining new access tokens
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input or missing required fields
 *       401:
 *         description: Incorrect email or password
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/auth/login
router.post("/login", ctrlWrapper(login));

/**
 * @swagger
 * /api/auth/current:
 *   get:
 *     summary: Retrieve the currently authenticated user's information. Private.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 subscription:
 *                   type: string
 *                   description: The subscription plan of the user
 *       401:
 *         description: Unauthorized - user must be authenticated with a valid bearer token
 */

// GET: https://goit-slimmom-team-03d472951ab141/api/auth/current
router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token using a valid refresh token. Private.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token issued during login
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token for authentication
 *                 refreshToken:
 *                   type: string
 *                   description: The new refresh token for future use
 *       401:
 *         description: Refresh token is missing
 *       403:
 *         description: Invalid or expired session refresh token
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/auth/refresh
router.post("/refresh", refreshTokens); // do we need to prior to refreshingtoken?

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user. Private.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User session has been ended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       403:
 *         description: Invalid or expired token
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/auth/logout
router.post("/logout", authenticateToken, ctrlWrapper(logout));

export { router };
