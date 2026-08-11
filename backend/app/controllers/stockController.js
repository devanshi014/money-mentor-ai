const {
  getLiveStocks,
  searchStock,
  getStockHistory,
} = require("../services/stockService");

// Dashboard stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await getLiveStocks();
    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch live stocks.",
    });
  }
};

// Search stock
const search = async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({
        message: "Stock symbol is required.",
      });
    }

    const stock = await searchStock(symbol.toUpperCase());

    res.status(200).json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to search stock.",
    });
  }
};

// 30-day history
const history = async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol) {
      return res.status(400).json({
        message: "Stock symbol is required.",
      });
    }

    const data = await getStockHistory(symbol.toUpperCase());

    res.status(200).json(data);
  } catch (error) {
    console.error("History API Error:");
    console.error(error);
    console.error(error.response?.data);

    res.status(500).json({
      message: error.message,
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  getStocks,
  search,
  history,
};