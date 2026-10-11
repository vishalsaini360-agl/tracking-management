const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");

const healthCheckResponse = (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Health ok",
    timestamp: new Date().toISOString(),
  });
};

// Health check routes
router.get("/health-check", healthCheckResponse);
router.get("/health", healthCheckResponse);
router.get("/api/health-check", healthCheckResponse);
router.get("/api/health", healthCheckResponse);

// Auth routes mounted under /api and /
router.use("/api", authRoutes);
router.use("/", authRoutes);

module.exports = router;
