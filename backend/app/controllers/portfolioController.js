const {
  getUserPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
} = require("../services/portfolioService");

const { GoogleGenAI } = require("@google/genai");

// ===============================
// Get Portfolio
// ===============================

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await getUserPortfolio(
      req.user.id
    );

    res.status(200).json(portfolio);
  } catch (error) {
    console.error(
      "Get Portfolio Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Add Holding
// ===============================

const createHolding = async (req, res) => {
  try {
    const {
      symbol,
      company,
      quantity,
      buyPrice,
    } = req.body;

    if (
      !symbol ||
      !company ||
      !quantity ||
      !buyPrice
    ) {
      return res.status(400).json({
        message:
          "All fields are required.",
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message:
          "Quantity must be greater than 0.",
      });
    }

    if (Number(buyPrice) <= 0) {
      return res.status(400).json({
        message:
          "Buy price must be greater than 0.",
      });
    }

    const holding = await addHolding(
      req.user.id,
      symbol.toUpperCase(),
      company,
      Number(quantity),
      Number(buyPrice)
    );

    res.status(201).json(holding);
  } catch (error) {
    console.error(
      "Create Holding Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Holding
// ===============================

const editHolding = async (req, res) => {
  try {
    const {
      quantity,
      buyPrice,
    } = req.body;

    if (
      quantity === undefined ||
      buyPrice === undefined
    ) {
      return res.status(400).json({
        message:
          "Quantity and buy price are required.",
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message:
          "Quantity must be greater than 0.",
      });
    }

    if (Number(buyPrice) <= 0) {
      return res.status(400).json({
        message:
          "Buy price must be greater than 0.",
      });
    }

    const holding =
      await updateHolding(
        req.user.id,
        req.params.id,
        Number(quantity),
        Number(buyPrice)
      );

    res.status(200).json(holding);
  } catch (error) {
    console.error(
      "Update Holding Error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
};

// ===============================
// Delete Holding
// ===============================

const removeHolding = async (req, res) => {
  try {
    await deleteHolding(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      message:
        "Holding removed successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Holding Error:",
      error
    );

    res.status(400).json({
      message: error.message,
    });
  }
};

// ===============================
// AI Portfolio Analysis
// ===============================

const analyzePortfolio = async (
  req,
  res
) => {
  try {
    const { portfolio } = req.body;

    if (
      !portfolio ||
      !Array.isArray(portfolio) ||
      portfolio.length === 0
    ) {
      return res.status(400).json({
        message:
          "Portfolio data is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message:
          "Gemini API key is not configured.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey:
        process.env.GEMINI_API_KEY,
    });

    const portfolioData =
      portfolio.map((stock) => ({
        symbol: stock.symbol,
        company: stock.company,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice:
          stock.currentPrice,
        investment:
          stock.investment,
        currentValue:
          stock.currentValue,
        profit: stock.profit,
        profitPercent:
          stock.profitPercent,
      }));

    const prompt = `
You are Money Mentor AI, a helpful financial education assistant.

Analyze the following user's stock portfolio.

Portfolio:
${JSON.stringify(
  portfolioData,
  null,
  2
)}

Provide a clear and beginner-friendly analysis covering:

1. Overall portfolio performance
2. Which holdings are performing well
3. Which holdings are currently at a loss
4. Portfolio diversification
5. Major risks or concentration issues
6. General educational suggestions for improving diversification or risk management
7. A short summary at the end

Do NOT guarantee returns.
Do NOT tell the user exactly what stocks they must buy or sell.
Make it clear that this is educational information and not professional financial advice.

Keep the response structured and easy to understand.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
      });

    res.status(200).json({
      analysis:
        response.text ||
        "No analysis received.",
    });
  } catch (error) {
    console.error(
      "Portfolio AI Analysis Error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Unable to analyze portfolio.",
    });
  }
};

// ===============================
// Exports
// ===============================

module.exports = {
  getPortfolio,
  createHolding,
  editHolding,
  removeHolding,
  analyzePortfolio,
};