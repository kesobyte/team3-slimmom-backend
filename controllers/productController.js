import { Product } from "../models/productModel.js";
import { httpError } from "../helpers/httpError.js";

const getProductsByBloodType = async (req, res, next) => {
  try {
    // Extract blood type from the request params or query
    const { bloodType } = req.params;

    // Ensure bloodType is a number between 1 and 4
    const bloodTypeNum = Number(bloodType);
    if (!bloodTypeNum || bloodTypeNum < 1 || bloodTypeNum > 4) {
      throw httpError(400, "Blood type must be a number between 1 and 4");
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

export { getProductsByBloodType };