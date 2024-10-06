import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const { SECRET_KEY } = process.env;

const handleTokens = async (id) => {
  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "12h",
  });
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "3d",
  });
  await User.findByIdAndUpdate(id, { accessToken, refreshToken });

  return { accessToken, refreshToken };
};

export { handleTokens };
