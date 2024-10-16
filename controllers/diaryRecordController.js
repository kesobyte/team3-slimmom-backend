import { DiaryRecord } from "../models/diaryRecordModel.js";
import { httpError } from "../helpers/httpError.js";
import { diaryRecordValidation } from "../validations/authValidation.js";
import mongoose from "mongoose";

const addDiaryRecord = async (req, res, next) => {
  try {
    // Validate the incoming request body
    const { error } = diaryRecordValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.details[0].message);
    }

    // Destructure validated fields from request body
    const { date, title, grams, calories, calorieIntake, category } = req.body;
    const userId = req.user._id; // Assuming user is attached by the authentication middleware

    // Create a new diary record
    const newRecord = await DiaryRecord.create({
      userId,
      date,
      title,
      grams,
      calories,
      calorieIntake,
      category,
    });

    // Return the created record as a response
    res.status(201).json(newRecord);
  } catch (err) {
    next(err);
  }
};

// New function to get diary records filtered by a specified date
const getDiaryRecordsByDate = async (req, res, next) => {
    try {
      const userId = req.user._id; // User ID from the authenticated user
      const { date } = req.query; // Get the date from query parameters
  
      if (!date) {
        throw httpError(400, "Date parameter is required");
      }
  
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        throw httpError(400, "Invalid date format");
      }
  
      // Set the start and end of the selected date for filtering
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Find diary records for the specified date
      const records = await DiaryRecord.find({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      });
  
      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  };

  // New function to delete a diary record by ID
const deleteDiaryRecord = async (req, res, next) => {
    try {
      const userId = req.user._id; // User ID from the authenticated user
      const { id } = req.params; // Diary record ID from the request parameters

      // console.log(`Attempting to delete record with ID: ${id} for user: ${userId}`);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw httpError(400, "Invalid ID format");
      }
  
      // Find the diary record and ensure it belongs to the authenticated user
      const record = await DiaryRecord.findOneAndDelete({ _id: id, userId });
  
      if (!record) {
        // console.log("Diary record not found or user does not have permission");
        throw httpError(404, "Diary record not found or you do not have permission to delete it");
      }
  
      res.status(200).json({ message: "Diary record deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

export { addDiaryRecord, getDiaryRecordsByDate, deleteDiaryRecord };
