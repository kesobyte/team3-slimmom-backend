import express from "express";
import { getProductsByBloodType } from "../../controllers/productController.js";

const router = express.Router();

// Request to get non-recommended food: /api/products/blood-type/1
router.get("/products/blood-type/:bloodType", getProductsByBloodType);

export { router };