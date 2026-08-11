import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";

function IPODetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [ipo, setIPO] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH IPO DETAILS
  // ======================================================

  useEffect(() => {
    fetchIPODetails();
  }, [symbol]);

  const fetchIPODetails = async () => {
    try {
      setLoading(true);
      setError("");

      const decodedSymbol = decodeURIComponent(symbol || "");

      const response = await axios.get(
        `/api/ipo/${encodeURIComponent(decodedSymbol)}`
      );

      const data = response.data;

      if (data?.ipo) {
        setIPO(data.ipo);
      } else {
        setIPO(data);
      }
    } catch (err) {
      console.error("IPO Details Error:", err);

      setIPO(null);

      setError(
        err.response?.data?.message ||
          "Unable to load IPO details."
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
  // FORMAT NUMBER
  // ======================================================

  const formatNumber = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      Number(value) === 0
    ) {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return number.toLocaleString("en-IN");
  };

  // ======================================================
  // FORMAT PRICE
  // ======================================================

  const formatPrice = (value) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "N/A"
    ) {
      return "N/A";
    }

    if (typeof value === "number") {
      return `$${value}`;
    }

    return String(value);
  };

  // ======================================================
  // GET STATUS STYLE
  // ======================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(
      status || "Expected"
    ).toLowerCase();

    if (
      normalizedStatus.includes("active") ||
      normalizedStatus.includes("open")
    ) {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (
      normalizedStatus.includes("closed") ||
      normalizedStatus.includes("complete")
    ) {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">

        <Sidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">

          <div className="max-w-[1400px] mx-auto px-5 py-7 md:px-8 lg:px-10">

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

              <div className="text-5xl mb-4">
                🏦
              </div>

              <p className="text-slate-400 text-lg">
                Loading IPO details...
              </p>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // ERROR STATE
  // ======================================================

  if (error || !ipo) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">

        <Sidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">

          <div className="max-w-[1400px] mx-auto px-5 py-7 md:px-8 lg:px-10">

            {/* BACK BUTTON */}

            <button
              onClick={() => navigate("/ipo")}
              className="
                inline-flex
                items-center
                gap-2
                mb-7
                text-blue-400
                hover:text-blue-300
                font-semibold
                text-sm
                transition
              "
            >
              ← Back to IPO Market
            </button>

            {/* ERROR CARD */}

            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-10 md:p-12 text-center">

              <div className="text-5xl mb-4">
                ⚠️
              </div>

              <h1 className="text-2xl font-bold">
                Unable to Load IPO
              </h1>

              <p className="text-slate-400 mt-3">
                {error ||
                  "IPO information is not available."}
              </p>

              <button
                onClick={fetchIPODetails}
                className="
                  mt-6
                  bg-blue-500
                  hover:bg-blue-600
                  px-6
                  py-3
                  rounded-lg
                  font-semibold
                  transition
                "
              >
                🔄 Try Again
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ======================================================
  // IPO DATA
  // ======================================================

  const company =
    ipo.company ||
    ipo.name ||
    "Unknown Company";

  const stockSymbol =
    ipo.symbol ||
    ipo.ticker ||
    symbol ||
    "N/A";

  const status =
    ipo.status ||
    "Expected";

  const price =
    ipo.price ||
    ipo.priceRange ||
    ipo.price_range ||
    null;

  const shares =
    ipo.shares ||
    ipo.numberOfShares ||
    ipo.sharesOffered ||
    ipo.shares_offered ||
    null;

  const ipoDate =
    ipo.date ||
    ipo.ipoDate ||
    ipo.ipo_date ||
    null;

  const exchange =
    ipo.exchange ||
    "N/A";

  const openDate =
    ipo.open ||
    ipo.openDate ||
    ipo.open_date ||
    null;

  const closeDate =
    ipo.close ||
    ipo.closeDate ||
    ipo.close_date ||
    null;

  const listingDate =
    ipo.listingDate ||
    ipo.listing_date ||
    null;

  const description =
    ipo.description ||
    ipo.businessDescription ||
    ipo.business_description ||
    "";

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

      <main className="flex-1 min-w-0 overflow-y-auto">

        <div className="max-w-[1400px] mx-auto px-5 py-7 md:px-8 lg:px-10">

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <button
            onClick={() => navigate("/ipo")}
            className="
              inline-flex
              items-center
              gap-2
              mb-7
              text-blue-400
              hover:text-blue-300
              font-semibold
              text-sm
              transition
            "
          >
            ← Back to IPO Market
          </button>

          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <section
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-6
              md:p-8
            "
          >

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

              <div className="min-w-0">

                <div className="flex items-center gap-2 mb-3">

                  <span className="w-2 h-2 rounded-full bg-blue-400" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    IPO Details
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight break-words">
                  {company}
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mt-2">
                  {stockSymbol}
                </p>

              </div>

              {/* STATUS */}

              <span
                className={`
                  self-start
                  px-4
                  py-2
                  rounded-full
                  border
                  text-sm
                  font-semibold
                  whitespace-nowrap
                  ${getStatusStyle(status)}
                `}
              >
                {status}
              </span>

            </div>

          </section>

          {/* ==================================================
              KEY INFORMATION
          ================================================== */}

          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-7">

            {/* IPO PRICE */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                IPO Price
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {formatPrice(price)}
              </h2>

            </div>

            {/* EXCHANGE */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                Exchange
              </p>

              <h2 className="text-xl font-bold mt-2">
                {exchange}
              </h2>

            </div>

            {/* SHARES */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                Shares
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {formatNumber(shares)}
              </h2>

            </div>

            {/* IPO DATE */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                hover:border-slate-700
                transition-colors
              "
            >

              <p className="text-sm text-slate-500">
                IPO Date
              </p>

              <h2 className="text-xl font-bold mt-2">
                {formatDate(ipoDate)}
              </h2>

            </div>

          </section>

          {/* ==================================================
              IMPORTANT DATES + OFFER INFORMATION
          ================================================== */}

          <section className="grid lg:grid-cols-2 gap-5 mt-7">

            {/* ==================================================
                IMPORTANT DATES
            ================================================== */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-6
              "
            >

              <div className="flex items-center gap-2 mb-6">

                <span className="text-xl">
                  📅
                </span>

                <h2 className="text-xl md:text-2xl font-bold">
                  Important Dates
                </h2>

              </div>

              <div className="space-y-5">

                {/* OPEN */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Open Date
                  </span>

                  <span className="font-semibold text-right">
                    {formatDate(openDate)}
                  </span>

                </div>

                {/* CLOSE */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Close Date
                  </span>

                  <span className="font-semibold text-right">
                    {formatDate(closeDate)}
                  </span>

                </div>

                {/* IPO DATE */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    IPO Date
                  </span>

                  <span className="font-semibold text-right">
                    {formatDate(ipoDate)}
                  </span>

                </div>

                {/* LISTING */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Listing Date
                  </span>

                  <span className="font-semibold text-right">
                    {formatDate(listingDate)}
                  </span>

                </div>

              </div>

            </div>

            {/* ==================================================
                OFFER INFORMATION
            ================================================== */}

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-6
              "
            >

              <div className="flex items-center gap-2 mb-6">

                <span className="text-xl">
                  💰
                </span>

                <h2 className="text-xl md:text-2xl font-bold">
                  Offer Information
                </h2>

              </div>

              <div className="space-y-5">

                {/* PRICE RANGE */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Price Range
                  </span>

                  <span className="font-semibold text-right">
                    {ipo.priceRange ||
                      ipo.price_range ||
                      formatPrice(price)}
                  </span>

                </div>

                {/* SHARES */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Shares Offered
                  </span>

                  <span className="font-semibold text-right">
                    {formatNumber(shares)}
                  </span>

                </div>

                {/* EXCHANGE */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Exchange
                  </span>

                  <span className="font-semibold text-right">
                    {exchange}
                  </span>

                </div>

                {/* STATUS */}

                <div className="flex justify-between gap-5">

                  <span className="text-slate-500">
                    Status
                  </span>

                  <span
                    className={`font-semibold ${
                      getStatusStyle(status)
                        .includes("green")
                        ? "text-green-400"
                        : getStatusStyle(status)
                            .includes("red")
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {status}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              COMPANY DESCRIPTION
          ================================================== */}

          {description && (

            <section
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-6
                mt-7
              "
            >

              <div className="flex items-center gap-2 mb-4">

                <span className="text-xl">
                  🏢
                </span>

                <h2 className="text-xl md:text-2xl font-bold">
                  About the Company
                </h2>

              </div>

              <p className="text-slate-400 leading-7">
                {description}
              </p>

            </section>

          )}

          {/* ==================================================
              ESTIMATED OFFER VALUE
          ================================================== */}

          {ipo.totalSharesValue &&
            Number(ipo.totalSharesValue) > 0 && (

              <section
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-xl
                  p-6
                  mt-7
                "
              >

                <div className="flex items-center justify-between gap-5">

                  <div>

                    <p className="text-sm text-slate-500">
                      Estimated Offer Value
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-green-400 mt-2">
                      $
                      {Number(
                        ipo.totalSharesValue
                      ).toLocaleString("en-US")}
                    </h2>

                  </div>

                  <div className="text-4xl md:text-5xl">
                    💰
                  </div>

                </div>

              </section>

            )}

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-10 border-t border-slate-800 pt-5 pb-3">

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Money Mentor AI provides educational information only.
              IPO information may change and should be verified with
              official exchange or company sources before making
              investment decisions.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default IPODetails;