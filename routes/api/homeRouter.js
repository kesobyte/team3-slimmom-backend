import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import {welcome} from "../../controllers/homeController.js"

const router = express.Router();

router.get("/", ctrlWrapper(welcome));

export { router };
