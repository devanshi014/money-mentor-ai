const Portfolio = require("../models/Portfolio");
const { searchStock } = require("./stockService");

// ===============================
// Get User Dashboard Data
// ===============================

const getUserDashboard = async (userId) => {
  // Get user's portfolio
  const holdings = await Portfolio.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  let totalInvestment = 0;
  let currentValue = 0;
  let totalProfit = 0;

  const portfolio = [];

  // ===============================
  // Calculate Portfolio Values
  // ===============================

  for (const holding of holdings) {
    try {
      const liveStock = await searchStock(
        holding.symbol
      );

      const livePrice = Number(
        liveStock.price
      );

      const investment =
        Number(holding.quantity) *
        Number(holding.buyPrice);

      const value =
        Number(holding.quantity) *
        livePrice;

      const profit =
        value - investment;

      const profitPercent =
        investment > 0
          ? (profit / investment) * 100
          : 0;

      totalInvestment += investment;
      currentValue += value;
      totalProfit += profit;

      portfolio.push({
        symbol: holding.symbol,
        company: holding.company,
        quantity: holding.quantity,
        buyPrice: holding.buyPrice,
        currentPrice: livePrice,
        investment,
        currentValue: value,
        profit,
        profitPercent,
      });
    } catch (error) {
      console.error(
        `Dashboard price error for ${holding.symbol}:`,
        error.message
      );

      const investment =
        Number(holding.quantity) *
        Number(holding.buyPrice);

      totalInvestment += investment;

      portfolio.push({
        symbol: holding.symbol,
        company: holding.company,
        quantity: holding.quantity,
        buyPrice: holding.buyPrice,
        currentPrice: 0,
        investment,
        currentValue: 0,
        profit: 0,
        profitPercent: 0,
      });
    }
  }

  // ===============================
  // ROI
  // ===============================

  const roi =
    totalInvestment > 0
      ? (totalProfit / totalInvestment) *
        100
      : 0;

  // ===============================
  // Return Dashboard Data
  // ===============================

  return {
    summary: {
      totalInvestment,
      currentValue,
      totalProfit,
      roi,
      totalHoldings: holdings.length,
    },

    portfolio,
  };
};

module.exports = {
  getUserDashboard,
};