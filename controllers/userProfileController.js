import { Profile } from "../models/userProfileModel.js";
import { Product } from "../models/productModel.js";
import { httpError } from "../helpers/httpError.js";
import { calculatorValidation } from "../validations/authValidation.js";

const updateUserProfile = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;  // Get userId from req.user after authentication
    const { height, dWeight, age, bloodType, cWeight, dailyCalories } = req.body;

    // Validate the input using calculatorValidation
    const { error } = calculatorValidation.validate(req.body);
    if (error) {
      return next(httpError(400, error.message));
    }

    // Check if the user profile already exists
    let userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      console.log("No profile found for user. Creating a new profile.");
      // Create a new profile if it doesn't exist
      userProfile = await Profile.create({
        userId,
        height,
        dWeight,
        age,
        bloodType,
        cWeight,
        dailyCalories,
      });

      return res.status(201).json({
        status: "success",
        data: userProfile,
        message: "Profile created successfully",
      });
    }

    // Update the existing profile
    userProfile = await Profile.findOneAndUpdate(
      { userId },  // Find the profile by userId
      { height, dWeight, age, bloodType, cWeight, dailyCalories},  // Update fields
      { new: true }  // Return the updated profile
    );

    res.status(200).json({
      status: "success",
      data: userProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);  // Log the full error
    next(httpError(500, "Internal Server Error"));
  }
};

const getUserProfile = async (req, res, next) => {
    try {
      const { _id: userId } = req.user;

      // Retrieve the user's profile
      const userProfile = await Profile.findOne({ userId });
      if (!userProfile) {
        return next(httpError(404, "Profile not found"));
      }

      // Retrieve products based on the user's blood type
      const bloodType = userProfile.bloodType;

      // Fetch products by calling getProductsByBloodType with bloodType
      const productCategories = await Product.find({
        [`groupBloodNotAllowed.${bloodType}`]: true,  // Query by blood type
        }).select("categories -_id");

      // Extract unique categories
      const uniqueCategories = [...new Set(productCategories.map(product => product.categories))];
        
      // Return the profile data along with the product categories
      res.status(200).json({
        status: "success",
        data: userProfile,
        notRecommended: uniqueCategories, // Include product categories, blood true which is not recommended
      });
    } catch (error) {
      next(error);
    }
  };

export { updateUserProfile, getUserProfile };
