const Watchlist = require("../models/Watchlist");

// Get all watchlist items
const getUserWatchlist = async (userId) => {
  return await Watchlist.find({ user: userId }).sort({
    createdAt: -1,
  });
};

// Add stock
const addStock = async (userId, symbol, company) => {
  const exists = await Watchlist.findOne({
    user: userId,
    symbol,
  });

  if (exists) {
    throw new Error("Stock already exists in watchlist.");
  }

  return await Watchlist.create({
    user: userId,
    symbol,
    company,
  });
};

// Remove stock
const removeStock = async (userId, stockId) => {
  const stock = await Watchlist.findOneAndDelete({
    _id: stockId,
    user: userId,
  });

  if (!stock) {
    throw new Error("Stock not found.");
  }

  return stock;
};

module.exports = {
  getUserWatchlist,
  addStock,
  removeStock,
};