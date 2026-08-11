const express = require("express");

const router = express.Router();

const {
  getHistory,
} = require("../controllers/portfolioHistoryController");

const {
  protect,
} = require("../middleware/authMiddleware");

// Get logged-in user's portfolio history
router.get(
  "/",
  protect,
  getHistory
);

module.exports = router;