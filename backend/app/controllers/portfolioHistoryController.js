const {
  getPortfolioHistory,
} = require("../services/portfolioHistoryService");

// Get portfolio history
const getHistory = async (req, res) => {
  try {
    const history = await getPortfolioHistory(
      req.user.id
    );

    res.status(200).json(history);
  } catch (error) {
    console.error(
      "Portfolio History Error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Unable to fetch portfolio history.",
    });
  }
};

module.exports = {
  getHistory,
};