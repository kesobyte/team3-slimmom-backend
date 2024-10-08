import express from "express";
import { getProductsByBloodType, searchProducts } from "../../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * /api/products/blood-type/{bloodType}:
 *   get:
 *     summary: Retrieve products filtered by blood type
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: bloodType
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4]
 *         required: true
 *         description: The user's blood type 1 for A, 2 for B, 3 for AB, 4 for O
 *     responses:
 *       200:
 *         description: A list of products filtered by the specified blood type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   calories:
 *                     type: number
 *                   category:
 *                     type: string
 *                   bloodTypeRestricted:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       enum: [1, 2, 3, 4]
 *       400:
 *         description: Invalid blood type parameter
 *       404:
 *         description: No products found for the specified blood type
 */

// Request to get non-recommended food: /api/products/blood-type/1
router.get("/blood-type/:bloodType", getProductsByBloodType);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search for products based on a query parameter
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term used to find products (e.g., product name or category)
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   calories:
 *                     type: number
 *                   category:
 *                     type: string
 *       400:
 *         description: Missing or invalid search query parameter
 *       404:
 *         description: No products found matching the search criteria
 */

// Route to search for products with query parameters
router.get("/search", searchProducts);

export { router };