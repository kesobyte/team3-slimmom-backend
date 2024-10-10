import express from "express";
import { swaggerDocs, swaggerUi } from "./swagger.js"; // Import swagger configuration
import logger from "morgan";
import cors from "cors";
import { router as homeRouter } from "./routes/api/homeRouter.js";
import { router as authRouter } from "./routes/api/authRouter.js";
import { router as productRouter } from "./routes/api/productRouter.js";
import { router as userProfileRouter} from "./routes/api/userProfileRouter.js";
import {router as diaryRecordRouter} from "./routes/api/diaryRecordRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/profile", userProfileRouter);
app.use("/api/diary", diaryRecordRouter);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
