const mongoose = require("mongoose");

const portfolioHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalInvestment: {
      type: Number,
      required: true,
      min: 0,
    },

    totalValue: {
      type: Number,
      required: true,
      min: 0,
    },

    totalProfit: {
      type: Number,
      required: true,
    },

    roi: {
      type: Number,
      required: true,
    },

    holdingsCount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PortfolioHistory",
  portfolioHistorySchema
);