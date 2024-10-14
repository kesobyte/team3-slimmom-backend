import { Product } from "../models/productModel.js";

const getProductsByBloodType = async (req, res, next) => {
  try {
    // Extract blood type from the request params or query
    const { bloodType } = req.params;

    // Ensure bloodType is a number between 1 and 4
    const bloodTypeNum = Number(bloodType);
    if (!bloodTypeNum || bloodTypeNum < 1 || bloodTypeNum > 4) {
      return res.status(400).json({ message: "Blood type must be a number between 1 and 4" });
    }

    // Find products where the value at groupBloodNotAllowed[bloodTypeNum] is false
    const products = await Product.find({
      [`groupBloodNotAllowed.${bloodTypeNum}`]: true,
    }).select("categories -_id"); // Only select the 'categories' field and exclude '_id'

    // Extract categories and filter out duplicates using Set
    const uniqueCategories = [...new Set(products.map(product => product.categories))];

    // Return the list of unique categories
    res.status(200).json({
      status: "success",
      data: uniqueCategories, // Extract categories as an array
    });
  } catch (error) {
    next(error);
  }
};

// Function to search for products based on query parameters
const searchProducts = async (req, res) => {
  try {
    const { title, categories, weight, minCalories, maxCalories, bloodType } = req.query;

    // Create a filter object for the query
    const filter = {};

    // Allow special character to be used as search input
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    };

    // Add filters based on the provided query parameters
    if (title) {
      const escapedTitle = escapeRegex(title);
      filter.title = { $regex: escapedTitle, $options: "i" }; // Case-insensitive search for title
    }
    if (categories) {
      filter.categories = categories;
    }
    if (weight) {
      filter.weight = weight;
    }
    if (minCalories || maxCalories) {
      filter.calories = {};
      if (minCalories) filter.calories.$gte = Number(minCalories);
      if (maxCalories) filter.calories.$lte = Number(maxCalories);
    }
    if (bloodType) {
      filter.groupBloodNotAllowed = { $ne: bloodType }; // Exclude products not allowed for the blood type
    }

    // Query the database with the constructed filter
    const products = await Product.find(filter);

    // If no products are found
    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the matched products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getProductsByBloodType, searchProducts };