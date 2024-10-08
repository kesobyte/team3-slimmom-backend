import express from "express";
import { getProductsByBloodType, searchProducts } from "../../controllers/productController.js";

const router = express.Router();

// Request to get non-recommended food: /api/products/blood-type/1
router.get("/blood-type/:bloodType", getProductsByBloodType);

// Route to search for products with query parameters
router.get("/search", searchProducts);

export { router };