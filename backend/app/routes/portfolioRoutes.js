const express = require("express");

const router = express.Router();

const {
  getPortfolio,
  createHolding,
  editHolding,
  removeHolding,
  analyzePortfolio,
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");

// Get all holdings
router.get("/", protect, getPortfolio);

// Add holding
router.post("/", protect, createHolding);

// AI portfolio analysis
router.post("/analyze", protect, analyzePortfolio);

// Update holding
router.put("/:id", protect, editHolding);

// Delete holding
router.delete("/:id", protect, removeHolding);

module.exports = router;