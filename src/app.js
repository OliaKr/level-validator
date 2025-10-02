import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import validateRoute from "./routes/validate.js";
import dashboardRoute from "./routes/dashboard.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

// Routes
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/", (_req, res) =>
  res.sendFile(join(__dirname, "../public/index.html"))
);
app.use("/validate", validateRoute);
app.use("/dashboard", dashboardRoute);

export default app;
