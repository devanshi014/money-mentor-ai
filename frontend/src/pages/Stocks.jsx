import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StockCard from "../components/StockCard";
import StockChart from "../components/charts/StockChart";

import {
  searchStock,
  getStockHistory,
} from "../services/stockService";

import { addToWatchlist } from "../services/watchlistService";

import {
  Search,
  RotateCcw,
  BarChart3,
  Heart,
  TrendingUp,
} from "lucide-react";

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [history, setHistory] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const [loading, setLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState("");

  // ======================================================
  // SEARCH STOCK
  // ======================================================

  const handleSearch = async () => {
    const searchSymbol = symbol.trim().toUpperCase();

    if (!searchSymbol) {
      alert("Please enter a stock symbol.");
      return;
    }

    try {
      setLoading(true);
      setHistory([]);
      setSelectedSymbol("");

      // Fetch current stock information
      const stock = await searchStock(searchSymbol);

      if (!stock) {
        throw new Error("Stock data not found.");
      }

      setStocks([stock]);
      setSelectedSymbol(
        stock.symbol || searchSymbol
      );

      // Fetch historical prices
      const chartData =
        await getStockHistory(searchSymbol);

      setHistory(
        Array.isArray(chartData)
          ? chartData
          : []
      );
    } catch (err) {
      console.error("Stock Search Error:", err);

      setStocks([]);
      setHistory([]);
      setSelectedSymbol("");

      alert(
        err.response?.data?.message ||
          err.message ||
          "Stock not found. Please check the symbol and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VIEW STOCK CHART
  // ======================================================

  const handleViewChart = async (stockSymbol) => {
    if (!stockSymbol) {
      return;
    }

    try {
      setLoading(true);

      setSelectedSymbol(stockSymbol);
      setHistory([]);

      const chartData =
        await getStockHistory(stockSymbol);

      setHistory(
        Array.isArray(chartData)
          ? chartData
          : []
      );
    } catch (err) {
      console.error(
        "Stock History Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to load price history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD STOCK TO WATCHLIST
  // ======================================================

  const handleAddToWatchlist = async (stock) => {
    if (!stock?.symbol) {
      return;
    }

    try {
      setWatchlistLoading(stock.symbol);

      await addToWatchlist({
        symbol: stock.symbol,
        company:
          stock.company ||
          stock.name ||
          stock.symbol,
      });

      alert(
        `${stock.symbol} added to your watchlist.`
      );
    } catch (err) {
      console.error(
        "Watchlist Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to add stock to watchlist."
      );
    } finally {
      setWatchlistLoading("");
    }
  };

  // ======================================================
  // RESET SEARCH
  // ======================================================

  const handleReset = () => {
    setStocks([]);
    setHistory([]);
    setSelectedSymbol("");
    setSymbol("");
  };

  // ======================================================
  // ENTER KEY SEARCH
  // ======================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="flex-1 min-w-0">

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <Navbar />

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-2">

              <TrendingUp
                size={20}
                className="text-green-400"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                Markets
              </span>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Stocks
            </h1>

            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Search stocks and track their price
              performance.
            </p>

          </section>

          {/* ==================================================
              SEARCH BAR
          ================================================== */}

          <section className="mb-10">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:p-5">

              <div className="flex flex-col md:flex-row gap-3">

                {/* Search Input */}

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-500
                    "
                  />

                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) =>
                      setSymbol(
                        e.target.value.toUpperCase()
                      )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Search by symbol — AAPL, MSFT, TSLA..."
                    className="
                      w-full
                      bg-slate-950
                      border
                      border-slate-800
                      rounded-xl
                      pl-11
                      pr-4
                      py-3.5
                      text-white
                      placeholder:text-slate-600
                      outline-none
                      focus:border-green-500
                      transition
                    "
                  />

                </div>

                {/* Search Button */}

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                  className="
                    md:px-7
                    py-3.5
                    px-6
                    rounded-xl
                    bg-green-500
                    hover:bg-green-400
                    text-slate-950
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    disabled:bg-slate-700
                    disabled:text-slate-400
                    disabled:cursor-not-allowed
                  "
                >

                  <Search size={17} />

                  {loading
                    ? "Searching..."
                    : "Search"}

                </button>

                {/* Reset Button */}

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="
                    md:px-6
                    py-3.5
                    px-6
                    rounded-xl
                    bg-slate-800
                    border
                    border-slate-700
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <RotateCcw size={17} />

                  Reset

                </button>

              </div>

            </div>

          </section>

          {/* ==================================================
              INITIAL LOADING
          ================================================== */}

          {loading && stocks.length === 0 && (

            <div
              className="
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                p-12
                text-center
              "
            >

              <div
                className="
                  w-12
                  h-12
                  mx-auto
                  rounded-xl
                  bg-green-500/10
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >

                <BarChart3
                  size={24}
                  className="text-green-400"
                />

              </div>

              <p className="text-slate-400">
                Searching for stock data...
              </p>

            </div>
          )}

          {/* ==================================================
              SEARCH RESULT
          ================================================== */}

          {!loading && stocks.length > 0 && (

            <section>

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-xl md:text-2xl font-semibold">
                    Stock Result
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Current price and daily performance
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {stocks.map((stock, index) => {

                  const change = Number(
                    stock.change
                  );

                  const safeChange =
                    Number.isFinite(change)
                      ? change
                      : 0;

                  const stockSymbol =
                    stock.symbol ||
                    `stock-${index}`;

                  const isWatchlistLoading =
                    watchlistLoading ===
                    stockSymbol;

                  return (

                    <div
                      key={stockSymbol}
                      className="
                        rounded-xl
                        bg-slate-900
                        border
                        border-slate-800
                        p-5
                        hover:border-slate-700
                        transition-colors
                      "
                    >

                      {/* ==================================================
                          STOCK CARD
                      ================================================== */}

                      <StockCard
                        symbol={stock.symbol}
                        company={
                          stock.company ||
                          stock.name ||
                          stock.symbol
                        }
                        price={stock.price}
                        change={`${safeChange}%`}
                        positive={
                          safeChange >= 0
                        }
                      />

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        {/* Chart */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewChart(
                              stock.symbol
                            )
                          }
                          disabled={
                            loading ||
                            !stock.symbol
                          }
                          className="
                            py-3
                            rounded-lg
                            bg-blue-500/10
                            border
                            border-blue-500/20
                            text-blue-400
                            hover:bg-blue-500/20
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >

                          <BarChart3
                            size={17}
                          />

                          Chart

                        </button>

                        {/* Watchlist */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToWatchlist(
                              stock
                            )
                          }
                          disabled={
                            isWatchlistLoading
                          }
                          className="
                            py-3
                            rounded-lg
                            bg-red-500/10
                            border
                            border-red-500/20
                            text-red-400
                            hover:bg-red-500/20
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >

                          <Heart size={17} />

                          {isWatchlistLoading
                            ? "Adding..."
                            : "Watchlist"}

                        </button>

                      </div>

                    </div>

                  );
                })}

              </div>

            </section>
          )}

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {!loading &&
            stocks.length === 0 && (

              <div
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-12
                  text-center
                "
              >

                <div
                  className="
                    w-14
                    h-14
                    mx-auto
                    rounded-xl
                    bg-slate-800
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                >

                  <TrendingUp
                    size={26}
                    className="text-slate-500"
                  />

                </div>

                <h2 className="text-xl font-semibold">
                  Search for a stock
                </h2>

                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                  Enter a symbol such as AAPL, MSFT,
                  TSLA, or NVDA to view its latest
                  price and performance.
                </p>

              </div>
            )}

          {/* ==================================================
              PRICE HISTORY
          ================================================== */}

          {history.length > 0 && (

            <section className="mt-10">

              <div
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-5
                  md:p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-3
                    mb-6
                  "
                >

                  <div>

                    <div className="flex items-center gap-2">

                      <BarChart3
                        size={20}
                        className="text-blue-400"
                      />

                      <h2 className="text-xl md:text-2xl font-semibold">
                        {selectedSymbol} Price History
                      </h2>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Historical price movement
                    </p>

                  </div>

                  {loading && (

                    <span className="text-sm text-blue-400">
                      Updating chart...
                    </span>

                  )}

                </div>

                <StockChart
                  history={history}
                />

              </div>

            </section>
          )}

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-10 border-t border-slate-800 pt-5">

            <p
              className="
                text-xs
                text-slate-600
                text-center
                leading-relaxed
              "
            >
              Market data may be delayed. Money Mentor AI
              provides educational information only and is
              not professional financial advice or a
              recommendation to buy or sell securities.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Stocks;