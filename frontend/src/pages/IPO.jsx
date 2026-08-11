import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function IPO() {
  const navigate = useNavigate();

  const [ipos, setIPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH IPOs
  // ======================================================

  useEffect(() => {
    fetchIPOs();
  }, []);

  const fetchIPOs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/ipo");

      const data = response.data;

      let ipoData = [];

      if (Array.isArray(data)) {
        ipoData = data;
      } else if (Array.isArray(data.ipos)) {
        ipoData = data.ipos;
      } else if (Array.isArray(data.ipoCalendar)) {
        ipoData = data.ipoCalendar;
      }

      // Sort by IPO date
      ipoData.sort((a, b) => {
        const dateA = new Date(a.date || "9999-12-31");
        const dateB = new Date(b.date || "9999-12-31");

        return dateA - dateB;
      });

      setIPOs(ipoData);
    } catch (err) {
      console.error("IPO Fetch Error:", err);

      setIPOs([]);

      setError(
        err.response?.data?.message ||
          "Unable to load IPO information."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ======================================================
  // FORMAT SHARES
  // ======================================================

  const formatShares = (shares) => {
    if (
      shares === undefined ||
      shares === null ||
      shares === "" ||
      Number(shares) === 0
    ) {
      return "N/A";
    }

    const number = Number(shares);

    if (Number.isNaN(number)) {
      return String(shares);
    }

    return number.toLocaleString("en-IN");
  };

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (price) => {
    if (
      price === undefined ||
      price === null ||
      price === "" ||
      price === "N/A"
    ) {
      return "N/A";
    }

    return `$${price}`;
  };

  // ======================================================
  // STATUS
  // ======================================================

  const getStatus = (ipo) => {
    const rawStatus = String(
      ipo.status || "expected"
    ).toLowerCase();

    if (
      rawStatus.includes("active") ||
      rawStatus.includes("open")
    ) {
      return {
        label: "Active",
        className:
          "bg-green-500/20 text-green-400",
      };
    }

    if (
      rawStatus.includes("closed") ||
      rawStatus.includes("complete")
    ) {
      return {
        label: "Closed",
        className:
          "bg-red-500/20 text-red-400",
      };
    }

    return {
      label: "Expected",
      className:
        "bg-yellow-500/20 text-yellow-400",
    };
  };

  // ======================================================
  // OPEN IPO DETAILS
  // ======================================================

  const openIPODetails = (ipo) => {
    const symbol =
      ipo.symbol ||
      ipo.ticker ||
      ipo.company ||
      ipo.name;

    if (!symbol) return;

    navigate(
      `/ipo/${encodeURIComponent(symbol)}`
    );
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
          MAIN AREA
      ================================================== */}

      <div className="flex-1 min-w-0">

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <Navbar />

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              ACTION BAR
          ================================================== */}

          <section className="mb-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>

                <p className="text-sm text-slate-500">
                  Explore upcoming, active and recently
                  announced public offerings.
                </p>

              </div>

              <button
                onClick={fetchIPOs}
                disabled={loading}
                className={`
                  px-5
                  py-2.5
                  rounded-xl
                  font-semibold
                  text-sm
                  transition-all
                  duration-200
                  ${
                    loading
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white hover:-translate-y-0.5"
                  }
                `}
              >
                {loading
                  ? "Loading..."
                  : "↻ Refresh IPOs"}
              </button>

            </div>

          </section>

          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

          {!loading &&
            !error &&
            ipos.length > 0 && (

              <section className="mb-8">

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

                  {/* Total IPOs */}

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">

                    <p className="text-slate-500 text-sm">
                      Total IPOs
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {ipos.length}
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Available listings
                    </p>

                  </div>

                  {/* Upcoming */}

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">

                    <p className="text-slate-500 text-sm">
                      Upcoming
                    </p>

                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                      {
                        ipos.filter(
                          (ipo) =>
                            !String(
                              ipo.status ||
                                "expected"
                            )
                              .toLowerCase()
                              .includes("closed")
                        ).length
                      }
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Active or expected
                    </p>

                  </div>

                  {/* Exchanges */}

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">

                    <p className="text-slate-500 text-sm">
                      Exchanges
                    </p>

                    <p className="text-3xl font-bold text-blue-400 mt-2">
                      {
                        new Set(
                          ipos
                            .map(
                              (ipo) =>
                                ipo.exchange
                            )
                            .filter(Boolean)
                        ).size
                      }
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Markets represented
                    </p>

                  </div>

                </div>

              </section>
            )}

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-4">

                <span className="text-2xl">
                  🏦
                </span>

              </div>

              <p className="text-slate-400">
                Loading IPO information...
              </p>

              <p className="text-xs text-slate-600 mt-2">
                Please wait while we fetch the latest data.
              </p>

            </div>

          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (

            <div className="bg-slate-900 border border-red-500/30 rounded-xl p-10 text-center">

              <div className="w-14 h-14 mx-auto rounded-xl bg-red-500/10 flex items-center justify-center mb-4">

                <span className="text-2xl">
                  ⚠️
                </span>

              </div>

              <h2 className="text-xl font-semibold">
                Unable to load IPOs
              </h2>

              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                {error}
              </p>

              <button
                onClick={fetchIPOs}
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Try Again
              </button>

            </div>

          )}

          {/* ==================================================
              IPO GRID
          ================================================== */}

          {!loading &&
            !error &&
            ipos.length > 0 && (

              <section>

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h2 className="text-xl md:text-2xl font-semibold">
                      IPO Listings
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Click an IPO to view complete information
                    </p>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {ipos.map((ipo, index) => {

                    const symbol =
                      ipo.symbol ||
                      ipo.ticker ||
                      "";

                    const company =
                      ipo.company ||
                      ipo.name ||
                      "Unknown Company";

                    const status =
                      getStatus(ipo);

                    return (

                      <div
                        key={
                          symbol ||
                          `${company}-${index}`
                        }
                        onClick={() =>
                          openIPODetails(ipo)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {

                          if (
                            event.key ===
                              "Enter" ||
                            event.key === " "
                          ) {
                            event.preventDefault();
                            openIPODetails(ipo);
                          }

                        }}
                        className="
                          group
                          bg-slate-900
                          border
                          border-slate-800
                          rounded-2xl
                          p-6
                          cursor-pointer
                          hover:border-blue-500/60
                          hover:bg-slate-900/80
                          hover:shadow-xl
                          hover:-translate-y-1
                          transition-all
                          duration-200
                        "
                      >

                        {/* ==================================================
                            CARD HEADER
                        ================================================== */}

                        <div className="flex justify-between items-start gap-4">

                          <div className="min-w-0">

                            <h2 className="text-xl font-bold truncate">
                              {company}
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                              {symbol || "N/A"}
                            </p>

                          </div>

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-semibold
                              whitespace-nowrap
                              ${status.className}
                            `}
                          >
                            {status.label}
                          </span>

                        </div>

                        {/* ==================================================
                            DETAILS
                        ================================================== */}

                        <div className="mt-6 space-y-4">

                          <div className="flex justify-between gap-4">

                            <span className="text-slate-500">
                              IPO Price
                            </span>

                            <span className="font-semibold text-slate-200">
                              {formatPrice(ipo.price)}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4">

                            <span className="text-slate-500">
                              Exchange
                            </span>

                            <span className="font-semibold text-slate-200">
                              {ipo.exchange || "N/A"}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4">

                            <span className="text-slate-500">
                              Shares
                            </span>

                            <span className="font-semibold text-slate-200">
                              {formatShares(
                                ipo.shares ||
                                  ipo.numberOfShares
                              )}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4">

                            <span className="text-slate-500">
                              IPO Date
                            </span>

                            <span className="font-semibold text-slate-200">
                              {formatDate(ipo.date)}
                            </span>

                          </div>

                        </div>

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">

                          <span className="text-slate-600 text-sm">
                            View complete information
                          </span>

                          <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                            →
                          </span>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </section>
            )}

          {/* ==================================================
              NO DATA
          ================================================== */}

          {!loading &&
            !error &&
            ipos.length === 0 && (

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-4">

                  <span className="text-2xl">
                    🏦
                  </span>

                </div>

                <h2 className="text-xl font-semibold">
                  No IPOs available
                </h2>

                <p className="text-slate-500 mt-2">
                  There are currently no IPO events available.
                </p>

                <button
                  onClick={fetchIPOs}
                  className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  ↻ Refresh
                </button>

              </div>

            )}

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-12 border-t border-slate-800 pt-5">

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Money Mentor AI provides educational information only.
              IPO information may change and should be verified with
              official sources before making investment decisions.
            </p>

          </div>

        </main>

      </div>
    </div>
  );
}

export default IPO;