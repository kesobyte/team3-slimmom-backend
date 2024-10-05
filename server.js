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
