import express from "express";
import logger from "morgan";
import cors from "cors";
// import { router as contactsRouter } from "./routes/api/contactsRouter.js";
import { router as authRouter } from "./routes/api/authRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
