import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getDashboard } from "../services/dashboardService";

import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BriefcaseBusiness,
  BarChart3,
} from "lucide-react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH DASHBOARD
  // ======================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboard();

      console.log("DASHBOARD DATA:", data);

      setDashboard(data);
    } catch (error) {
      console.error("Dashboard Error:", error);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return `₹${number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Navbar />

          <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

            {/* Dashboard content skeleton */}

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
              </div>

              <div className="h-4 w-72 bg-slate-800 rounded animate-pulse mt-3" />
            </section>

            {/* Summary skeleton */}

            <section>
              <div className="mb-5">
                <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />

                <div className="h-3 w-64 bg-slate-800 rounded mt-3 animate-pulse" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="
                      h-32
                      rounded-xl
                      bg-slate-900
                      border
                      border-slate-800
                      animate-pulse
                    "
                  />
                ))}
              </div>
            </section>

            {/* Holdings skeleton */}

            <section className="mt-10">
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-3" />

              <div className="h-3 w-64 bg-slate-800 rounded animate-pulse mb-5" />

              <div className="h-80 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
            </section>

          </main>
        </div>
      </div>
    );
  }

  // ======================================================
  // DEFAULT VALUES
  // ======================================================

  const summary = dashboard?.summary || {};

  const portfolio = dashboard?.portfolio || [];

  const totalInvestment = Number(
    summary.totalInvestment || 0
  );

  const currentValue = Number(
    summary.currentValue || 0
  );

  const totalProfit = Number(
    summary.totalProfit || 0
  );

  const roi = Number(
    summary.roi || 0
  );

  const totalHoldings = Number(
    summary.totalHoldings || 0
  );

  const profitPositive = totalProfit >= 0;

  const roiPositive = roi >= 0;

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

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              PAGE CONTEXT
              NOTE:
              No duplicate "Dashboard" h1 here.
              Navbar already shows Dashboard.
          ================================================== */}

          <section className="mb-8">

            <div className="flex items-center gap-2 mb-3">

              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                Portfolio Overview
              </span>

            </div>

            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              Monitor your investments, portfolio performance,
              and current holdings from one place.
            </p>

          </section>

          {/* ==================================================
              PORTFOLIO SUMMARY
          ================================================== */}

          <section>

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <BarChart3
                  size={19}
                  className="text-green-400"
                />

                <h2 className="text-xl md:text-2xl font-semibold">
                  Portfolio Summary
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Key metrics from your current portfolio
              </p>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

              {/* ==================================================
                  TOTAL INVESTMENT
              ================================================== */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-5
                  transition-all
                  duration-200
                  hover:border-slate-700
                  hover:-translate-y-0.5
                "
              >

                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Wallet
                    size={20}
                    className="text-blue-400"
                  />
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  Total Investment
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(totalInvestment)}
                </h3>

              </div>

              {/* ==================================================
                  CURRENT VALUE
              ================================================== */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-5
                  transition-all
                  duration-200
                  hover:border-slate-700
                  hover:-translate-y-0.5
                "
              >

                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp
                    size={20}
                    className="text-green-400"
                  />
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  Current Value
                </p>

                <h3 className="text-2xl font-bold mt-1 text-green-400">
                  {formatCurrency(currentValue)}
                </h3>

              </div>

              {/* ==================================================
                  TOTAL PROFIT
              ================================================== */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-5
                  transition-all
                  duration-200
                  hover:border-slate-700
                  hover:-translate-y-0.5
                "
              >

                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    profitPositive
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >

                  {profitPositive ? (
                    <ArrowUpRight
                      size={20}
                      className="text-green-400"
                    />
                  ) : (
                    <ArrowDownRight
                      size={20}
                      className="text-red-400"
                    />
                  )}

                </div>

                <p className="text-sm text-slate-500 mt-5">
                  Total Profit
                </p>

                <h3
                  className={`text-2xl font-bold mt-1 ${
                    profitPositive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {profitPositive ? "+" : "-"}
                  {formatCurrency(Math.abs(totalProfit))}
                </h3>

              </div>

              {/* ==================================================
                  ROI
              ================================================== */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-5
                  transition-all
                  duration-200
                  hover:border-slate-700
                  hover:-translate-y-0.5
                "
              >

                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    roiPositive
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  }`}
                >

                  <BarChart3
                    size={20}
                    className={
                      roiPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  />

                </div>

                <p className="text-sm text-slate-500 mt-5">
                  Portfolio ROI
                </p>

                <h3
                  className={`text-2xl font-bold mt-1 ${
                    roiPositive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {roiPositive ? "+" : ""}
                  {roi.toFixed(2)}%
                </h3>

              </div>

              {/* ==================================================
                  TOTAL HOLDINGS
              ================================================== */}

              <div
                className="
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                  p-5
                  transition-all
                  duration-200
                  hover:border-slate-700
                  hover:-translate-y-0.5
                "
              >

                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BriefcaseBusiness
                    size={20}
                    className="text-purple-400"
                  />
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  Total Holdings
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {totalHoldings}
                </h3>

              </div>

            </div>

          </section>

          {/* ==================================================
              HOLDINGS
          ================================================== */}

          <section className="mt-10">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <BriefcaseBusiness
                  size={20}
                  className="text-green-400"
                />

                <h2 className="text-xl md:text-2xl font-semibold">
                  Holdings
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Current investments and their performance
              </p>

            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

              {portfolio.length === 0 ? (

                /* ==================================================
                    EMPTY PORTFOLIO
                ================================================== */

                <div className="py-16 px-6 text-center">

                  <div className="w-14 h-14 mx-auto rounded-xl bg-slate-800 flex items-center justify-center mb-5">

                    <BriefcaseBusiness
                      size={25}
                      className="text-slate-500"
                    />

                  </div>

                  <h3 className="text-lg font-semibold">
                    No investments yet
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    Add stocks to your portfolio to start
                    tracking your investments and performance.
                  </p>

                </div>

              ) : (

                /* ==================================================
                    PORTFOLIO TABLE
                ================================================== */

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>

                      <tr className="border-b border-slate-800">

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Stock
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Quantity
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Buy Price
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Live Price
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Investment
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Current Value
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                          P/L
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {portfolio.map((stock, index) => {

                        const profit = Number(
                          stock.profit || 0
                        );

                        const positive = profit >= 0;

                        return (

                          <tr
                            key={
                              stock.symbol ||
                              stock.id ||
                              index
                            }
                            className="
                              border-b
                              border-slate-800/70
                              last:border-0
                              hover:bg-slate-800/30
                              transition-colors
                            "
                          >

                            {/* Stock */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">

                                  <span className="text-xs font-bold text-green-400">
                                    {stock.symbol?.slice(0, 2) || "--"}
                                  </span>

                                </div>

                                <div>

                                  <p className="font-semibold">
                                    {stock.symbol || "Unknown"}
                                  </p>

                                  <p className="text-xs text-slate-500 mt-0.5 max-w-[180px] truncate">
                                    {stock.company || "—"}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Quantity */}

                            <td className="px-6 py-5 text-sm text-slate-300">
                              {stock.quantity ?? 0}
                            </td>

                            {/* Buy Price */}

                            <td className="px-6 py-5 text-sm text-slate-300">
                              {formatCurrency(stock.buyPrice)}
                            </td>

                            {/* Live Price */}

                            <td className="px-6 py-5 text-sm font-semibold text-blue-400">
                              {formatCurrency(stock.currentPrice)}
                            </td>

                            {/* Investment */}

                            <td className="px-6 py-5 text-sm text-slate-300">
                              {formatCurrency(stock.investment)}
                            </td>

                            {/* Current Value */}

                            <td className="px-6 py-5 text-sm font-medium">
                              {formatCurrency(stock.currentValue)}
                            </td>

                            {/* Profit / Loss */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-semibold ${
                                  positive
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {positive ? "+" : "-"}
                                {formatCurrency(Math.abs(profit))}
                              </span>

                            </td>

                          </tr>

                        );
                      })}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </section>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-10 border-t border-slate-800 pt-5">

            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Money Mentor AI provides educational information only.
              It is not professional financial advice or a recommendation
              to buy or sell securities.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;