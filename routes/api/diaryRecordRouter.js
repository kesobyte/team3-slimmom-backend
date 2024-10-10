import express from "express";
import { addDiaryRecord, getDiaryRecordsByDate, deleteDiaryRecord } from "../../controllers/diaryRecordController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";

const router = express.Router();

// POST route to add a new diary record
router.post("/add", authenticateToken, ctrlWrapper(addDiaryRecord));

// GET route to retrieve diary records filtered by a specified date
// http://localhost:5000/api/diary/fetch?date=2024-10-10
router.get("/fetch", authenticateToken, ctrlWrapper(getDiaryRecordsByDate));

// DELETE route to delete a specific diary record by ID
router.delete("/delete/:id", authenticateToken, (req, res, next) => {
    console.log("DELETE route hit");
    next();
}, ctrlWrapper(deleteDiaryRecord));

export {router};