const {
  getIPOCalendar,
  getIPODetails,
} = require("../services/ipoService");

// ======================================================
// Get All IPOs
// ======================================================

const getIPO = async (req, res) => {
  try {
    const ipos =
      await getIPOCalendar();

    res.status(200).json(ipos);

  } catch (error) {
    console.error(
      "IPO Controller Error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to fetch IPO information.",
    });
  }
};

// ======================================================
// Get IPO By Symbol
// ======================================================

const getIPOBySymbol = async (
  req,
  res
) => {
  try {
    const { symbol } =
      req.params;

    if (!symbol) {
      return res.status(400).json({
        message:
          "IPO symbol is required.",
      });
    }

    const ipo =
      await getIPODetails(symbol);

    res.status(200).json(ipo);

  } catch (error) {
    console.error(
      "IPO Details Controller Error:",
      error
    );

    res.status(404).json({
      message:
        error.message ||
        "IPO not found.",
    });
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  getIPO,
  getIPOBySymbol,
};