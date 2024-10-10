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
 *     summary: Register a new user
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
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user's account
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *       409:
 *         description: Email already registered
 */

router.post("/register", ctrlWrapper(register));

/**
 * @swagger
 * /api/auth/verify/{verificationToken}:
 *   get:
 *     summary: Verify a user's email address
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
 *       404:
 *         description: User not found or token invalid
 */

router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Resend a verification email
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

router.post("/verify", ctrlWrapper(resendVerifyEmail));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
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

router.post("/login", ctrlWrapper(login));

/**
 * @swagger
 * /api/auth/current:
 *   get:
 *     summary: Retrieve the currently authenticated user's information
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
 *         description: Unauthorized - user must be authenticated
 */

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token using a valid refresh token
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
 *       400:
 *         description: Invalid or missing refresh token
 *       401:
 *         description: Unauthorized - refresh token is invalid or expired
 */

router.post("/refresh", refreshTokens); // do we need to prior to refreshingtoken?

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       401:
 *         description: Unauthorized - user must be authenticated
 */

router.post("/logout", authenticateToken, ctrlWrapper(logout));

export { router };
