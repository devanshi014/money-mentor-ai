const Portfolio = require("../models/Portfolio");
const { searchStock } = require("./stockService");

// ==========================================
// Get Portfolio With Live Prices
// ==========================================
const getUserPortfolio = async (userId) => {
  const holdings = await Portfolio.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  const portfolio = [];

  for (const holding of holdings) {
    const investment =
      Number(holding.quantity) *
      Number(holding.buyPrice);

    try {
      // Fetch latest stock price
      const liveStock = await searchStock(
        holding.symbol
      );

      // Support different response formats
      const currentPrice = Number(
        liveStock?.price ??
          liveStock?.currentPrice ??
          liveStock?.regularMarketPrice ??
          0
      );

      const currentValue =
        Number(holding.quantity) * currentPrice;

      const profit =
        currentValue - investment;

      const profitPercent =
        investment > 0
          ? (profit / investment) * 100
          : 0;

      portfolio.push({
        ...holding.toObject(),

        currentPrice,

        investment,

        currentValue,

        profit,

        profitPercent,
      });
    } catch (error) {
      console.error(
        `Failed to fetch live price for ${holding.symbol}:`,
        error.message
      );

      // Keep holding even if live price fails
      portfolio.push({
        ...holding.toObject(),

        currentPrice: 0,

        investment,

        currentValue: 0,

        profit: 0,

        profitPercent: 0,
      });
    }
  }

  return portfolio;
};

// ==========================================
// Add Holding
// ==========================================
const addHolding = async (
  userId,
  symbol,
  company,
  quantity,
  buyPrice
) => {
  return await Portfolio.create({
    user: userId,
    symbol: symbol.toUpperCase(),
    company,
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
  });
};

// ==========================================
// Update Holding
// ==========================================
const updateHolding = async (
  userId,
  holdingId,
  quantity,
  buyPrice
) => {
  const holding = await Portfolio.findOne({
    _id: holdingId,
    user: userId,
  });

  if (!holding) {
    throw new Error("Holding not found.");
  }

  holding.quantity = Number(quantity);
  holding.buyPrice = Number(buyPrice);

  await holding.save();

  return holding;
};

// ==========================================
// Delete Holding
// ==========================================
const deleteHolding = async (
  userId,
  holdingId
) => {
  const holding =
    await Portfolio.findOneAndDelete({
      _id: holdingId,
      user: userId,
    });

  if (!holding) {
    throw new Error("Holding not found.");
  }

  return holding;
};

module.exports = {
  getUserPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
};