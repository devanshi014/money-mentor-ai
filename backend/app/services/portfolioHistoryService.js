const PortfolioHistory = require("../models/PortfolioHistory");

// Save a portfolio snapshot
const savePortfolioSnapshot = async (
  userId,
  portfolio
) => {
  const totalInvestment = portfolio.reduce(
    (sum, stock) =>
      sum + Number(stock.investment || 0),
    0
  );

  const totalValue = portfolio.reduce(
    (sum, stock) =>
      sum + Number(stock.currentValue || 0),
    0
  );

  const totalProfit =
    totalValue - totalInvestment;

  const roi =
    totalInvestment > 0
      ? (totalProfit / totalInvestment) * 100
      : 0;

  const holdingsCount =
    portfolio.length;

  const snapshot =
    await PortfolioHistory.create({
      user: userId,
      totalInvestment,
      totalValue,
      totalProfit,
      roi,
      holdingsCount,
    });

  return snapshot;
};


// Get portfolio history
const getPortfolioHistory = async (
  userId
) => {
  return await PortfolioHistory.find({
    user: userId,
  }).sort({
    createdAt: 1,
  });
};


module.exports = {
  savePortfolioSnapshot,
  getPortfolioHistory,
};