import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../helpers/sendEmail.js";
import { v4 as uuid4 } from "uuid";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import { emailValidation, registerValidation, loginValidation} from "../validations/authValidation.js";

const { APP_URL } = process.env;

// Register Operation *********************************
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Registration validation error
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({message: 'Validation error! Please populate required fields'});
    }

    // Registration conflict error, check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hashed the password
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
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error in register route: ", error);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

// Login Operation *********************************
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Step 1: validation error
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({message: 'Validation error! Please populate required fields'});
    }

    // Step 2: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // Step 3: check if user email has been verified
    if (!user.verify) {
      return res.status(401).json({ message: 'Please verify your email' });
    }

    // Step 4: Verify the password (assuming bcrypt is used)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 5: Generate JWT tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h"});
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    // Step 6: Create a new session and save it to the database
    const newSession = new Session({
      accessToken,
      refreshToken,
      expiration: Date.now() + 3600000, // Set expiration for 1 hour
      userId: user._id,
    });

    await newSession.save(); // Save the session to the database

    // Step 7: Send the tokens back in the response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { name: user.name, verified: user.verify },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// Current User Operation *********************************
const getCurrentUsers = async (req, res) => {
  try {
    // Destructure the necessary fields from req.user
    const { name, email } = req.user;

    // Send the user details in the response
    res.status(200).json({
      name,
      email,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Error fetching current user' });
  }
};

// Logout Operation *********************************
const logout = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the user's ID from the authenticated request

    // Find and delete the session associated with the user
    await Session.findOneAndDelete({ userId });

    // Logout success response
    res.status(204).json({message: 'User session has been ended'});
  } catch (error) {
    console.error('Unknown error when trying to log out: ', error);
    next(error);
  }
};

// Verify Email Operation *********************************
const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // Log the verification token for debugging
    // console.log("Verification Token:", verificationToken);

    const user = await User.findOne({ verificationToken });

    // Verification user Not Found
    if (!user) {
      // throw httpError(400, "User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // Update the user object to mark as verified
    user.verificationToken = null;
    user.verify = true;

    // Try to save the user and log the result for debugging
    await user.save();
    console.log("User verification updated and saved successfully.");

    // Verification success response
    res.json({message: "Verification successful"});
  } catch (err) {
    // Log the error for debugging
    console.error("Error in verifying email: ", err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

// Resend Verify Email Operation *********************************
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending a email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    return res.status(400).json({message: 'Validation error! Please populate required fields'});
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    // Email not found
    if (!user) {
      return res.status(404).json({message: 'The provided email address could not be found'});
    }

    // Resend email for verified user
    if (user.verify) {
      return res.status(400).json({message: 'Email is already verified'});
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
  } catch (err) {
    console.error("Error in resending email: ", err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};

// Reresh Token Logic
const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Step 1: Ensure there is a refresh token in the request
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Step 2: Check if the refresh token exists in the session database
    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res.status(403).json({ message: "Invalid or expired session refresh token" });
    }

    // Step 3: Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
        }

        // Step 3.1: Generate a new access token
        const newAccessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Step 3.2: Update the session with the new access token
        session.accessToken = newAccessToken;
        session.expiration = Date.now() + 3600000; // Update expiration for 1 hour
        await session.save(); // Save the updated session

        // Step 4: Send the new access token in the response
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken, // Keep the same refresh token
        });
      }
    );
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ message: "Token refresh failed" });
  }
};

export { register, login, logout, getCurrentUsers, verifyEmail, resendVerifyEmail, refreshTokens};
