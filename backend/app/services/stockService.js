const axios = require("axios");

// ======================================================
// API KEYS
// ======================================================

const FINNHUB_API_KEY =
  process.env.FINNHUB_API_KEY;

const TWELVEDATA_API_KEY =
  process.env.TWELVEDATA_API_KEY;

// ======================================================
// BASE URLs
// ======================================================

const FINNHUB_BASE_URL =
  "https://finnhub.io/api/v1";

const TWELVEDATA_BASE_URL =
  "https://api.twelvedata.com";

// ======================================================
// DEFAULT STOCKS
// ======================================================

const stocksList = [
  {
    symbol: "AAPL",
    company: "Apple",
  },
  {
    symbol: "MSFT",
    company: "Microsoft",
  },
  {
    symbol: "GOOGL",
    company: "Alphabet",
  },
  {
    symbol: "AMZN",
    company: "Amazon",
  },
  {
    symbol: "TSLA",
    company: "Tesla",
  },
  {
    symbol: "NVDA",
    company: "NVIDIA",
  },
];

// ======================================================
// Get Live Stocks
// ======================================================

const getLiveStocks = async () => {
  const stocks = [];

  for (const stock of stocksList) {
    try {
      const response = await axios.get(
        `${FINNHUB_BASE_URL}/quote`,
        {
          params: {
            symbol: stock.symbol,
            token: FINNHUB_API_KEY,
          },
        }
      );

      const data = response.data;
      console.log(
  `FINNHUB ${stock.symbol}:`,
  {
    currentPrice: data?.c,
    change: data?.d,
    percentChange: data?.dp,
    previousClose: data?.pc,
  }
);

      // ==================================================
      // Current Price
      // ==================================================

      const price = Number(data?.c);

      // Finnhub fields:
      // c  = current price
      // d  = change in price
      // dp = percentage change
      // pc = previous close
      // ==================================================

      const directChange = Number(data?.d);
      const directPercentChange = Number(data?.dp);
      const previousClose = Number(data?.pc);

      // ==================================================
      // Validate Price
      // ==================================================

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        console.error(
          `Invalid price received for ${stock.symbol}:`,
          data
        );

        continue;
      }

      // ==================================================
      // Calculate Percentage Change
      // ==================================================

      let changePercent;

      // First preference: Finnhub's dp
      if (
        Number.isFinite(directPercentChange)
      ) {
        changePercent =
          directPercentChange;
      }

      // Second preference: calculate using
      // current price and previous close
      else if (
        Number.isFinite(previousClose) &&
        previousClose > 0
      ) {
        changePercent =
          ((price - previousClose) /
            previousClose) *
          100;
      }

      // Third preference: calculate using
      // absolute change and current price
      else if (
        Number.isFinite(directChange) &&
        price > 0
      ) {
        const calculatedPreviousClose =
          price - directChange;

        if (
          calculatedPreviousClose > 0
        ) {
          changePercent =
            (directChange /
              calculatedPreviousClose) *
            100;
        }
      }

      // ==================================================
      // If API has no valid change data
      // ==================================================

      if (
        !Number.isFinite(changePercent)
      ) {
        console.warn(
          `No valid percentage change for ${stock.symbol}:`,
          data
        );

        changePercent = null;
      }

      // ==================================================
      // Push Stock
      // ==================================================

      stocks.push({
        symbol: stock.symbol,

        company: stock.company,

        price: price.toFixed(2),

        change:
          changePercent !== null
            ? changePercent.toFixed(2)
            : null,
      });
    } catch (error) {
      console.error(
        `Finnhub Error - ${stock.symbol}:`,
        error.response?.data ||
          error.message
      );
    }
  }

  return stocks;
};

// ======================================================
// Search Stock
// ======================================================

const searchStock = async (symbol) => {
  const stockSymbol = String(
    symbol || ""
  )
    .trim()
    .toUpperCase();

  if (!stockSymbol) {
    throw new Error(
      "Stock symbol is required."
    );
  }

  try {
    // ==================================================
    // Get Quote
    // ==================================================

    const quoteResponse =
      await axios.get(
        `${FINNHUB_BASE_URL}/quote`,
        {
          params: {
            symbol: stockSymbol,
            token: FINNHUB_API_KEY,
          },
        }
      );

    const quote =
      quoteResponse.data;

    // ==================================================
    // Validate Quote
    // ==================================================

    const price = Number(
      quote?.c
    );

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      throw new Error(
        `Stock "${stockSymbol}" not found.`
      );
    }

    // ==================================================
    // Get Company Profile
    // ==================================================

    let company = stockSymbol;

    try {
      const profileResponse =
        await axios.get(
          `${FINNHUB_BASE_URL}/stock/profile2`,
          {
            params: {
              symbol: stockSymbol,
              token: FINNHUB_API_KEY,
            },
          }
        );

      company =
        profileResponse.data?.name ||
        stockSymbol;
    } catch (profileError) {
      console.error(
        `Profile Error - ${stockSymbol}:`,
        profileError.response?.data ||
          profileError.message
      );
    }

    // ==================================================
    // Calculate Percentage Change
    // ==================================================

    const directPercentChange =
      Number(quote?.dp);

    const directChange =
      Number(quote?.d);

    const previousClose =
      Number(quote?.pc);

    let changePercent;

    // Finnhub percentage change
    if (
      Number.isFinite(
        directPercentChange
      )
    ) {
      changePercent =
        directPercentChange;
    }

    // Calculate using previous close
    else if (
      Number.isFinite(
        previousClose
      ) &&
      previousClose > 0
    ) {
      changePercent =
        ((price - previousClose) /
          previousClose) *
        100;
    }

    // Calculate from absolute change
    else if (
      Number.isFinite(
        directChange
      )
    ) {
      const calculatedPreviousClose =
        price - directChange;

      if (
        calculatedPreviousClose > 0
      ) {
        changePercent =
          (directChange /
            calculatedPreviousClose) *
          100;
      }
    }

    // ==================================================
    // Return Stock
    // ==================================================

    return {
      symbol: stockSymbol,

      company,

      price: price.toFixed(2),

      change:
        Number.isFinite(
          changePercent
        )
          ? changePercent.toFixed(2)
          : null,
    };
  } catch (error) {
    console.error(
      `Search Stock Error - ${stockSymbol}:`,
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Unable to find stock."
    );
  }
};

// ======================================================
// Get Stock History
// ======================================================

const getStockHistory = async (
  symbol
) => {
  const stockSymbol = String(
    symbol || ""
  )
    .trim()
    .toUpperCase();

  if (!stockSymbol) {
    throw new Error(
      "Stock symbol is required."
    );
  }

  try {
    const response =
      await axios.get(
        `${TWELVEDATA_BASE_URL}/time_series`,
        {
          params: {
            symbol: stockSymbol,
            interval: "1day",
            outputsize: 30,
            apikey:
              TWELVEDATA_API_KEY,
          },
        }
      );

    const data =
      response.data;

    // ==================================================
    // Twelve Data API Error
    // ==================================================

    if (
      data?.status === "error"
    ) {
      throw new Error(
        data.message ||
          "Unable to fetch stock history."
      );
    }

    // ==================================================
    // No History
    // ==================================================

    if (
      !data ||
      !Array.isArray(data.values)
    ) {
      return [];
    }

    // ==================================================
    // Format Chart Data
    // ==================================================

    return data.values
      .filter((item) => {
        const price =
          Number(item?.close);

        return (
          item?.datetime &&
          Number.isFinite(price)
        );
      })
      .reverse()
      .map((item) => ({
        date:
          item.datetime,

        price:
          Number(item.close),
      }));
  } catch (error) {
    console.error(
      `Twelve Data Error - ${stockSymbol}:`,
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to fetch stock history."
    );
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  getLiveStocks,
  searchStock,
  getStockHistory,
};