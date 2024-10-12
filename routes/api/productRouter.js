import express from "express";
import { getProductsByBloodType, searchProducts } from "../../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * /api/product/blood-type/{bloodType}:
 *   get:
 *     summary: Retrieve products filtered by blood type. Public and Private.
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

// GET: https://goit-slimmom-team-03d472951ab141/api/product/blood-type/1 
router.get("/blood-type/:bloodType", getProductsByBloodType);

/**
 * @swagger
 * /api/product/search:
 *   get:
 *     summary: Search for products based on the title. Private, should only be used when trying to populate diary.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: A partial or full title of the product (case-insensitive)
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
 *                   title:
 *                     type: string
 *                   categories:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   calories:
 *                     type: number
 *                   groupBloodNotAllowed:
 *                     type: array
 *                     items:
 *                       type: integer
 *                       enum: [1, 2, 3, 4]
 *                     description: Blood types for which this product is not allowed
 *       400:
 *         description: Missing or invalid title query parameter
 *       404:
 *         description: No products found matching the search criteria
 *       500:
 *         description: Server error
 */

// GET: https://goit-slimmom-team-03d472951ab141/api/product/search?title=steak
router.get("/search", searchProducts);

export { router };