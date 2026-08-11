const {
  getUserWatchlist,
  addStock,
  removeStock,
} = require("../services/watchlistService");

// Get watchlist
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await getUserWatchlist(req.user.id);

    res.status(200).json(watchlist);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Add stock
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, company } = req.body;

    const stock = await addStock(
      req.user.id,
      symbol,
      company
    );

    res.status(201).json(stock);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete stock
const removeFromWatchlist = async (req, res) => {
  try {
    await removeStock(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      message: "Removed successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};