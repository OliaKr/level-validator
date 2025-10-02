import express from "express";
import dotenv from "dotenv";
import validateRoute from "./routes/validate.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/validate", validateRoute);

export default app;
