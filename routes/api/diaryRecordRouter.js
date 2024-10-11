import express from "express";
import { addDiaryRecord, getDiaryRecordsByDate, deleteDiaryRecord } from "../../controllers/diaryRecordController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";

const router = express.Router();

/**
 * @swagger
 * /api/diary/fetch:
 *   get:
 *     summary: Retrieve diary record filtered by specified date with yyyy-mm-dd format. Private.
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date for which to fetch diary records
 *     responses:
 *       200:
 *         description: A list of diary records for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   title:
 *                     type: string
 *                   grams:
 *                     type: number
 *                   calories:
 *                     type: number
 *                   calorieIntake:
 *                     type: number
 *                   category:
 *                     type: string
 *       400:
 *         description: Invalid date format or missing date parameter
 *       401:
 *         description: Unauthorized - user must be authenticated
 *       404:
 *         description: No diary records found for the specified date
 */

// GET: https://goit-slimmom-team-03d472951ab141/api/diary/fetch?date=2024-10-10
router.get("/fetch", authenticateToken, ctrlWrapper(getDiaryRecordsByDate));

/**
 * @swagger
 * /api/diary/add:
 *   post:
 *     summary: Add a new diary record. Private.
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               title:
 *                 type: string
 *               grams:
 *                 type: number
 *               calories:
 *                 type: number
 *               calorieIntake:
 *                 type: number
 *               category:
 *                 type: string
 *             required:
 *               - date
 *               - title
 *               - grams
 *               - calories
 *               - calorieIntake
 *               - category
 *     responses:
 *       201:
 *         description: Diary record added successfully
 *       400:
 *         description: Invalid request parameters
 */

// POST: https://goit-slimmom-team-03d472951ab141/api/diary/add
router.post("/add", authenticateToken, ctrlWrapper(addDiaryRecord));

/**
 * @swagger
 * /api/diary/delete/{id}:
 *   delete:
 *     summary: Delete a specific diary record by id. Private.
 *     tags: [Diary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The diary record ID
 *     responses:
 *       200:
 *         description: Diary record deleted successfully
 *       404:
 *         description: Diary record not found or user does not have permission
 */

// DELETE: https://goit-slimmom-team-03d472951ab141/api/diary/delete/67079d85d1944d1e851fa9fe
router.delete("/delete/:id", authenticateToken, (req, res, next) => {
    console.log("DELETE route hit");
    next();
}, ctrlWrapper(deleteDiaryRecord));

export {router};