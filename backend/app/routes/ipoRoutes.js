const express = require("express");

const router = express.Router();

const {
  getIPO,
  getIPOBySymbol,
} = require("../controllers/ipoController");

// All IPOs
router.get("/", getIPO);

// Single IPO
router.get("/:symbol", getIPOBySymbol);

module.exports = router;