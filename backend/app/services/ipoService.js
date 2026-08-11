const axios = require("axios");

// ======================================================
// API KEY
// ======================================================

const FINNHUB_API_KEY =
  process.env.FINNHUB_API_KEY;

// ======================================================
// BASE URL
// ======================================================

const FINNHUB_BASE_URL =
  "https://finnhub.io/api/v1";

// ======================================================
// Get IPO Calendar
// ======================================================

const getIPOCalendar = async () => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error(
        "FINNHUB_API_KEY is not configured."
      );
    }

    // --------------------------------------------------
    // Date Range
    // --------------------------------------------------

    const today = new Date();

    const futureDate = new Date();

    futureDate.setDate(
      futureDate.getDate() + 90
    );

    const from = today
      .toISOString()
      .split("T")[0];

    const to = futureDate
      .toISOString()
      .split("T")[0];

    // --------------------------------------------------
    // Finnhub IPO Calendar API
    // --------------------------------------------------

    const response = await axios.get(
      `${FINNHUB_BASE_URL}/calendar/ipo`,
      {
        params: {
          from,
          to,
          token: FINNHUB_API_KEY,
        },
      }
    );

    const data = response.data;

    // --------------------------------------------------
    // Validate Response
    // --------------------------------------------------

    if (
      !data ||
      !Array.isArray(data.ipoCalendar)
    ) {
      return [];
    }

    // --------------------------------------------------
    // Format IPO Data
    // --------------------------------------------------

    return data.ipoCalendar.map((ipo) => ({
      symbol: ipo.symbol || "N/A",

      company:
        ipo.name ||
        "Unknown Company",

      date:
        ipo.date ||
        "",

      exchange:
        ipo.exchange ||
        "N/A",

      shares:
        ipo.numberOfShares ||
        0,

      price:
        ipo.price ||
        "N/A",

      status:
        ipo.status ||
        "expected",

      totalSharesValue:
        ipo.totalSharesValue ||
        0,
    }));

  } catch (error) {
    console.error(
      "Finnhub IPO API Error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Unable to fetch IPO data."
    );
  }
};

// ======================================================
// Get Single IPO Details
// ======================================================

const getIPODetails = async (symbol) => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error(
        "FINNHUB_API_KEY is not configured."
      );
    }

    const ipoSymbol = String(
      symbol || ""
    )
      .trim()
      .toUpperCase();

    if (!ipoSymbol) {
      throw new Error(
        "IPO symbol is required."
      );
    }

    // --------------------------------------------------
    // Get IPO Calendar
    // --------------------------------------------------

    const ipos =
      await getIPOCalendar();

    // --------------------------------------------------
    // Find IPO
    // --------------------------------------------------

    const ipo = ipos.find(
      (item) =>
        String(item.symbol)
          .toUpperCase() === ipoSymbol
    );

    // --------------------------------------------------
    // If IPO exists in calendar
    // --------------------------------------------------

    if (ipo) {
      return ipo;
    }

    // --------------------------------------------------
    // Fallback
    // --------------------------------------------------

    throw new Error(
      `IPO "${ipoSymbol}" not found.`
    );

  } catch (error) {
    console.error(
      `IPO Details Error - ${symbol}:`,
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.message ||
        "Unable to fetch IPO details."
    );
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  getIPOCalendar,
  getIPODetails,
};