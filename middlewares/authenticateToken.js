import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";

const { SECRET_KEY } = process.env; // Use the correct secret key

const authenticateToken = async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  // Check if token is provided
  if (!token) {
    return next(httpError(401, "Not authorized"));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id); // Find user by decoded token ID

    // If user is not found or the token does not match the stored accessToken
    if (!user || user.accessToken !== token) {
      return next(httpError(401, "Not authorized"));
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (err) {
    // Handle token validation errors
    return next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };
