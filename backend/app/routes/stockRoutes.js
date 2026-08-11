const express = require("express");

const router = express.Router();

const {
  getStocks,
  search,
  history,
} = require("../controllers/stockController");

// ==========================================
// GET DEFAULT / LIVE STOCKS
// GET /api/stocks
// ==========================================

router.get("/", getStocks);

// ==========================================
// SEARCH STOCK
// GET /api/stocks/search?symbol=AAPL
// ==========================================

router.get("/search", search);

// ==========================================
// STOCK PRICE HISTORY
// GET /api/stocks/history?symbol=AAPL
// ==========================================

router.get("/history", history);

module.exports = router;