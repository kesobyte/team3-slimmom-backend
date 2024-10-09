import dotenv from "dotenv";
dotenv.config({ path: './.env' });
import { app } from "./app.js";
import mongoose from "mongoose";

const DB_HOST = process.env.DB_HOST;
const PORT = process.env.PORT || 5000;  // Set the port properly

console.log('DB_HOST is:', DB_HOST);  // Log to check if DB_HOST is loaded

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running. Use our API on port: ${PORT}`)
    );
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error(`Server not running. Error message: ${err.message}`);
    process.exit(1); // Exit with a failure code
  });


// import {Session} from './models/sessionModel.js'; // Adjust the path accordingly

// const sampleSession = new Session({
//   accessToken: 'sampleAccessToken',
//   refreshToken: 'sampleRefreshToken',
//   expiration: new Date(Date.now() + 3600000), // 1 hour from now
//   userId: '6702595e9b21ebd131247e36', // Replace with an actual user ID
// });

// sampleSession.save()
//   .then(() => console.log('Sample session saved'))
//   .catch((error) => console.error('Error saving session:', error));