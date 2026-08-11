import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import {
  getWatchlist,
  removeFromWatchlist,
} from "../services/watchlistService";

import { searchStock } from "../services/stockService";

import {
  Heart,
  TrendingUp,
  TrendingDown,
  BriefcaseBusiness,
  Trash2,
  RefreshCw,
} from "lucide-react";

function Watchlist() {
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [removingId, setRemovingId] = useState("");

  // ======================================================
  // FETCH WATCHLIST ON PAGE LOAD
  // ======================================================

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // ======================================================
  // FETCH WATCHLIST + LIVE PRICES
  // ======================================================

  const fetchWatchlist = async () => {
    try {
      setLoadingPrices(true);

      const data = await getWatchlist();

      const safeWatchlist = Array.isArray(data) ? data : [];

      setWatchlist(safeWatchlist);

      if (safeWatchlist.length === 0) {
        return;
      }

      const updatedWatchlist = await Promise.all(
        safeWatchlist.map(async (stock) => {
          try {
            const liveData = await searchStock(stock.symbol);

            const livePrice =
              liveData?.price ??
              liveData?.currentPrice ??
              liveData?.regularMarketPrice ??
              null;

            let change =
              liveData?.changePercent ??
              liveData?.regularMarketChangePercent ??
              liveData?.change ??
              null;

            // Convert string values such as "2.5%" safely
            if (typeof change === "string") {
              change = Number(
                change.replace("%", "").replace("+", "").trim()
              );
            }

            return {
              ...stock,
              livePrice:
                livePrice !== null
                  ? Number(livePrice)
                  : null,
              change:
                change !== null && Number.isFinite(Number(change))
                  ? Number(change)
                  : null,
            };
          } catch (error) {
            console.error(
              `Failed to fetch ${stock.symbol}:`,
              error
            );

            return {
              ...stock,
              livePrice: null,
              change: null,
            };
          }
        })
      );

      setWatchlist(updatedWatchlist);
    } catch (error) {
      console.error("Watchlist Error:", error);

      setWatchlist([]);

      alert(
        error.response?.data?.message ||
          "Unable to load your watchlist."
      );
    } finally {
      setLoadingPrices(false);
    }
  };

  // ======================================================
  // REMOVE STOCK
  // ======================================================

  const handleRemove = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this stock from your watchlist?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(id);

      await removeFromWatchlist(id);

      setWatchlist((prev) =>
        prev.filter((stock) => stock._id !== id)
      );
    } catch (error) {
      console.error("Remove Watchlist Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove stock."
      );
    } finally {
      setRemovingId("");
    }
  };

  // ======================================================
  // ADD TO PORTFOLIO
  // ======================================================

  const handleAddToPortfolio = (stock) => {
    navigate("/portfolio", {
      state: {
        symbol: stock.symbol,
        company: stock.company || stock.symbol,
      },
    });
  };

  // ======================================================
  // GO TO STOCKS
  // ======================================================

  const handleExploreStocks = () => {
    navigate("/stocks");
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

              <Heart
                size={20}
                className="text-red-400"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Tracking
              </span>

            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              <div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My Watchlist
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base">
                  Keep track of stocks you're interested in
                  and monitor their market performance.
                </p>

              </div>

              {/* Refresh */}

              {watchlist.length > 0 && (

                <button
                  type="button"
                  onClick={fetchWatchlist}
                  disabled={loadingPrices}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-slate-900
                    border
                    border-slate-800
                    text-slate-300
                    hover:bg-slate-800
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

                  <RefreshCw
                    size={17}
                    className={
                      loadingPrices
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {loadingPrices
                    ? "Updating..."
                    : "Refresh Prices"}

                </button>

              )}

            </div>

          </section>

          {/* ==================================================
              LIVE PRICE STATUS
          ================================================== */}

          {loadingPrices && watchlist.length > 0 && (

            <div className="
              mb-6
              flex
              items-center
              gap-2
              text-sm
              text-slate-400
            ">

              <RefreshCw
                size={15}
                className="animate-spin text-blue-400"
              />

              Updating live market prices...

            </div>

          )}

          {/* ==================================================
              EMPTY WATCHLIST
          ================================================== */}

          {watchlist.length === 0 ? (

            <section className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              p-12
              text-center
            ">

              <div className="
                w-14
                h-14
                mx-auto
                rounded-xl
                bg-red-500/10
                flex
                items-center
                justify-center
                mb-5
              ">

                <Heart
                  size={26}
                  className="text-red-400"
                />

              </div>

              <h2 className="text-xl font-semibold">
                Your watchlist is empty
              </h2>

              <p className="
                text-sm
                text-slate-500
                mt-2
                max-w-md
                mx-auto
              ">
                Add stocks from the Stock Market page
                to start tracking their prices and
                daily performance.
              </p>

              <button
                type="button"
                onClick={handleExploreStocks}
                className="
                  mt-6
                  px-6
                  py-3
                  rounded-xl
                  bg-green-500
                  hover:bg-green-400
                  text-slate-950
                  font-semibold
                  transition
                "
              >
                Explore Stocks
              </button>

            </section>

          ) : (

            /* ==================================================
               WATCHLIST
            ================================================== */

            <section>

              {/* Section Heading */}

              <div className="flex items-center justify-between mb-5">

                <div>

                  <div className="flex items-center gap-2">

                    <Heart
                      size={19}
                      className="text-red-400"
                    />

                    <h2 className="
                      text-xl
                      md:text-2xl
                      font-semibold
                    ">
                      Saved Stocks
                    </h2>

                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {watchlist.length}{" "}
                    {watchlist.length === 1
                      ? "stock"
                      : "stocks"}{" "}
                    you're tracking
                  </p>

                </div>

              </div>

              {/* ==================================================
                  STOCK CARDS
              ================================================== */}

              <div className="
                grid
                md:grid-cols-2
                xl:grid-cols-3
                gap-5
              ">

                {watchlist.map((stock) => {

                  const price = Number(stock.livePrice);

                  const numericPrice =
                    Number.isFinite(price)
                      ? price
                      : 0;

                  const change = Number(stock.change);

                  const numericChange =
                    Number.isFinite(change)
                      ? change
                      : 0;

                  const hasPrice =
                    stock.livePrice !== null &&
                    stock.livePrice !== undefined &&
                    Number.isFinite(Number(stock.livePrice));

                  const hasChange =
                    stock.change !== null &&
                    stock.change !== undefined &&
                    Number.isFinite(Number(stock.change));

                  const positive =
                    numericChange >= 0;

                  const isRemoving =
                    removingId === stock._id;

                  return (

                    <div
                      key={stock._id}
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
                          STOCK HEADER
                      ================================================== */}

                      <div className="
                        flex
                        justify-between
                        items-start
                        gap-4
                      ">

                        <div className="min-w-0">

                          <h2 className="
                            text-2xl
                            font-bold
                            tracking-tight
                          ">
                            {stock.symbol}
                          </h2>

                          <p className="
                            text-slate-400
                            text-sm
                            mt-1
                            truncate
                            max-w-[200px]
                          ">
                            {stock.company || stock.symbol}
                          </p>

                        </div>

                        {/* Trend Indicator */}

                        <div className="
                          flex
                          flex-col
                          items-end
                          shrink-0
                        ">

                          <div
                            className={`
                              w-10
                              h-10
                              rounded-xl
                              flex
                              items-center
                              justify-center
                              ${
                                positive
                                  ? "bg-green-500/10"
                                  : "bg-red-500/10"
                              }
                            `}
                          >

                            {positive ? (

                              <TrendingUp
                                size={23}
                                className="text-green-400"
                              />

                            ) : (

                              <TrendingDown
                                size={23}
                                className="text-red-400"
                              />

                            )}

                          </div>

                          {hasChange && (

                            <span
                              className={`
                                text-xs
                                font-semibold
                                mt-1.5
                                ${
                                  positive
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              `}
                            >
                              {positive ? "+" : ""}
                              {numericChange.toFixed(2)}%
                            </span>

                          )}

                        </div>

                      </div>

                      {/* ==================================================
                          CURRENT PRICE
                      ================================================== */}

                      <div className="mt-7">

                        <p className="
                          text-sm
                          text-slate-500
                        ">
                          Current Price
                        </p>

                        {hasPrice ? (

                          <h3 className="
                            text-3xl
                            font-bold
                            mt-1
                            text-blue-400
                          ">
                            ₹{numericPrice.toFixed(2)}
                          </h3>

                        ) : (

                          <p className="
                            text-slate-500
                            mt-2
                            text-sm
                          ">
                            Price unavailable
                          </p>

                        )}

                      </div>

                      {/* ==================================================
                          DAILY PERFORMANCE
                      ================================================== */}

                      {hasChange && (

                        <div className="
                          mt-5
                          flex
                          items-center
                          justify-between
                          rounded-lg
                          bg-slate-950/60
                          border
                          border-slate-800
                          px-4
                          py-3
                        ">

                          <div>

                            <p className="
                              text-xs
                              text-slate-500
                            ">
                              Today's Change
                            </p>

                            <p
                              className={`
                                text-base
                                font-semibold
                                mt-0.5
                                ${
                                  positive
                                    ? "text-green-400"
                                    : "text-red-400"
                                }
                              `}
                            >
                              {positive ? "+" : ""}
                              {numericChange.toFixed(2)}%
                            </p>

                          </div>

                          <div
                            className={`
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              font-medium
                              ${
                                positive
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            `}
                          >

                            {positive ? (
                              <>
                                <TrendingUp size={15} />
                                Up
                              </>
                            ) : (
                              <>
                                <TrendingDown size={15} />
                                Down
                              </>
                            )}

                          </div>

                        </div>

                      )}

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="
                        mt-6
                        grid
                        grid-cols-2
                        gap-3
                      ">

                        {/* Add Portfolio */}

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToPortfolio(stock)
                          }
                          className="
                            py-3
                            rounded-lg
                            bg-green-500/10
                            border
                            border-green-500/20
                            text-green-400
                            hover:bg-green-500/20
                            font-semibold
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition
                          "
                        >

                          <BriefcaseBusiness
                            size={17}
                          />

                          Portfolio

                        </button>

                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(stock._id)
                          }
                          disabled={isRemoving}
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

                          {isRemoving ? (

                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />

                          ) : (

                            <Trash2 size={17} />

                          )}

                          {isRemoving
                            ? "Removing..."
                            : "Remove"}

                        </button>

                      </div>

                    </div>

                  );
                })}

              </div>

            </section>

          )}

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="
            mt-10
            border-t
            border-slate-800
            pt-5
          ">

            <p className="
              text-xs
              text-slate-600
              text-center
              leading-relaxed
            ">
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

export default Watchlist;