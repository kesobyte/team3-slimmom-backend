import jwt from "jsonwebtoken";
// import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js"; // for advance

const { SECRET_KEY } = process.env;

const handleTokens = async (id) => {
  const payload = {
    id,
  };

  // Generate access and refresh tokens
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "3d" });

  // Create a new session with the refresh token
  await Session.create({ userId: id, refreshToken });

  return { accessToken, refreshToken };
};

export { handleTokens };
