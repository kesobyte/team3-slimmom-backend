import bcrypt from "bcryptjs";
import "dotenv/config";
import { httpError } from "../helpers/httpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { handleTokens } from "../helpers/handleTokens.js";
import { v4 as uuid4 } from "uuid";
import { User } from "../models/usersModel.js";
// prettier-ignore
import { emailValidation, registerValidation, loginValidation} from "../validations/authValidation.js";

const { APP_URL } = process.env;

// Register Operation *********************************

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //  Registration validation error
  const { error } = registerValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Registration conflict error
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in Use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Create a verificationToken for the user
  const verificationToken = uuid4();

  await User.create({
    name,
    email,
    password: hashPassword,
    verificationToken,
  });

  // Send an email to the user's mail and specify a link to verify the email (/users/verify/:verificationToken) in the message
  await sendEmail({
    from: '"Slim-mom Notification" <noreply.slimmom@gmail.com>',
    to: email,
    subject: "Email Verification Required",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Hi, ${name}!</h2>
      <p style="font-size: 16px; color: #555;">Thanks for signing up for <strong>Slim Mom</strong>! Before we can continue, we need to validate your email address.</p>
      <p style="font-size: 16px; color: #555;">Please click the button below to verify your email address:</p>
      <a href="${APP_URL}/api/auth/verify/${verificationToken}" 
         style="display: inline-block; padding: 10px 25px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #fc842d; text-decoration: none; border-radius: 5px;">
         Verify Email
      </a>
      <p style="margin-top: 30px; font-size: 14px; color: #999;">If you did not sign up for Slim Mom, please ignore this email.</p>
      <p style="font-size: 14px; color: #999;">Thanks, <br>GOIT Team 3</p>
    </div>
  `,
  });

  // Registration success response
  res.status(201).json({
    // user: {
    //   name: newUser.name,
    //   email: newUser.email,
    //   message: "Account created successfully",
    // },
    message: "Account created successfully",
  });
};

// Login Operation *********************************

const login = async (req, res) => {
  const { email, password } = req.body;

  //  Login validation error
  const { error } = loginValidation.validate(req.body);
  if (error) {
    throw httpError(401, error.message);
  }

  // Login auth error (email)
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is incorrect");
  }

  // Login auth error (password)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw httpError(401, "Email or password is incorrect");
  }

  // // Check if email is verified
  // if (!user.verify) {
  //   throw httpError(401, "Email address is not yet verified");
  // }

  const { accessToken, refreshToken } = await handleTokens(user._id);

  //   Login success response
  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    },
  });
};

// Current User Operation *********************************

const getCurrentUsers = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

// Logout Operation *********************************

const logout = async (req, res) => {
  const { _id } = req.user;

  // Setting tokens to null then logout)
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

  // Logout success response
  res.status(204).json();
};

// Verify Email Operation *********************************

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  // Verification user Not Found
  if (!user) {
    throw httpError(400, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  // Verification success response
  res.json({
    message: "Verification successful",
  });
};

// Resend Verify Email Operation *********************************

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending a email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(404, "The provided email address could not be found");
  }

  // Resend email for verified user
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }

  await sendEmail({
    from: '"Slim-mom Notification" <noreply.slimmom@gmail.com>',
    to: email,
    subject: "Email Verification Required (Resend)",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Hi, ${user.name}!</h2>
      <p style="font-size: 16px; color: #555;">Thanks for signing up for <strong>Slim Mom</strong>! Before we can continue, we need to validate your email address.</p>
      <p style="font-size: 16px; color: #555;">Please click the button below to verify your email address:</p>
      <a href="${APP_URL}/api/auth/verify/${user.verificationToken}" 
         style="display: inline-block; padding: 10px 25px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #fc842d; text-decoration: none; border-radius: 5px;">
         Verify Email
      </a>
      <p style="margin-top: 30px; font-size: 14px; color: #999;">If you did not sign up for Slim Mom, please ignore this email.</p>
      <p style="font-size: 14px; color: #999;">Thanks, <br>GOIT Team 3</p>
    </div>
  `,
  });

  // Resending a email success response
  res.json({ message: "Verification email sent" });
};

// prettier-ignore
export { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail};
