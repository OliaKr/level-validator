import express from "express";

const router = express.Router();

// Dashboard statistics endpoint
router.get("/stats", (req, res) => {
  res.json({
    server: "Level Validator",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Dashboard health check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    dashboard: true,
    timestamp: new Date().toISOString(),
  });
});

export default router;
