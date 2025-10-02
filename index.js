import express from "express";
import dotenv from "dotenv";
import validateRoute from "./src/routes/validate.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Main validation route
app.use("/validate", validateRoute);

app.listen(PORT, () => {
  console.log(`🚀 Level Validator is running on port ${PORT}`);
});
