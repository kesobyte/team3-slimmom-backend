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
    to: email,
    from: "Slim-mom Notification",
    subject: "Email verification required",
    html: `
    <h3>Hi, ${name}!</h3>
    <br>
    <p>Thanks for signing up to Slim Mom. Before we can continue, we need to validate your email address.</p>
    <br>
    <a target="_blank" href="${APP_URL}/api/auth/verify/${verificationToken}">Click here to verify email</a>
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
    to: email,
    subject: "Action Required: Verify Your Email [Resend]",
    html: `
    <h2>Welcome to Slim Mom App</h2>
    <br>
    <a target="_blank" href="${APP_URL}/api/auth/verify/${user.verificationToken}">Click here to verify email</a>
    `,
  });

  // Resending a email success response
  res.json({ message: "Verification email sent" });
};

// prettier-ignore
export { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail};
