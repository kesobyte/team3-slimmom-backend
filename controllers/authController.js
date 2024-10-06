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
  try {
    const { name, email, password } = req.body;

    //  Registration validation error
    const { error } = registerValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    // Registration conflict error
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw httpError(409, "Email in Use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create a verificationToken for the user
    const verificationToken = uuid4();

    // Create the new user and store the result in newUser
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      verificationToken,
    });

    // Send an email to the user's mail and specify a link to verify the email
    await sendEmail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Email Verification Required",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding:  20px; border: 1px solid #eaeaea; border-radius: 10px;">
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

    // Registration success response with newUser details
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        message: "Account created successfully",
      },
      message: "Account created successfully",
    });
  } catch (err) {
    console.error('Error in register route: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Login Operation *********************************

const login = async (req, res) => {
  try{
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

    // Check if user has already verified his email
    if (!user.verify) {
      throw httpError(401, "Email is not verified. Please verify email via email verification link sent during registration.");
    }
    // Login auth error (password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw httpError(401, "Email or password is incorrect");
    }

    // Generate token for authenticated user
    const { accessToken, refreshToken } = await handleTokens(user._id);

    //  Login success response
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    // Setting tokens to null then logout)
    await User.findByIdAndUpdate(_id, { accessToken: null, refreshToken: null });

    // Logout success response
    res.status(204).json();
  } catch (error) {
      next(error);
  }
};

// Verify Email Operation *********************************

const verifyEmail = async (req, res) => {
  try{
    const { verificationToken } = req.params;

    // Log the verification token for debugging
    console.log('Verification Token:', verificationToken);

    const user = await User.findOne({ verificationToken });

    // Log the user found for debugging
    console.log('User Found:', user);

  // Verification user Not Found
    if (!user) {
      throw httpError(400, "User not found");
    }

    // await User.findByIdAndUpdate(user._id, {
    //   verify: true,
    //   verificationToken: null,
    // });

    // Update the user object to mark as verified
    user.verificationToken = null;
    user.verify = true;

    // Try to save the user and log the result for debugging
    await user.save();
    console.log('User verification updated and saved successfully.');

    // Verification success response
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error in email verification:', error.message);

    res.status(500).json({ message: error.message });
  }
};

// Resend Verify Email Operation *********************************

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending a email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    // Email not found
    if (!user) {
    throw httpError(404, "The provided email address could not be found");
  }

  // Resend email for verified user
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }

  // Email found but already verified
  if (user.very) {
    throw httpError(400, "Email is already verified");
  }

  // Resending email verification
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
} catch (error) {
    console.error('Error sending verification email:', error.message);
    res.status(500).json({ message: 'Internal server error' });
}
};

// prettier-ignore
export { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail};
