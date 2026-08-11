import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioPieChart from "../components/charts/PortfolioPieChart";
import PortfolioBarChart from "../components/charts/PortfolioBarChart";

import {
  getPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  analyzePortfolio,
} from "../services/portfolioService";

import {
  BriefcaseBusiness,
  RefreshCw,
  Sparkles,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Plus,
  Pencil,
  X,
  Save,
} from "lucide-react";

function Portfolio() {
  const location = useLocation();

  const [portfolio, setPortfolio] = useState([]);

  const [form, setForm] = useState({
    symbol: "",
    company: "",
    quantity: "",
    buyPrice: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ======================================================
  // INITIAL FETCH
  // ======================================================

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // ======================================================
  // RECEIVE STOCK FROM WATCHLIST / OTHER PAGE
  // ======================================================

  useEffect(() => {
    if (location.state?.symbol) {
      setForm((prev) => ({
        ...prev,
        symbol: location.state.symbol,
        company: location.state.company || "",
      }));

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ======================================================
  // FETCH PORTFOLIO
  // ======================================================

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio();

      setPortfolio(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Portfolio Error:", err);
      setPortfolio([]);
    }
  };

  // ======================================================
  // REFRESH PRICES
  // ======================================================

  const handleRefreshPrices = async () => {
    try {
      setRefreshing(true);

      await fetchPortfolio();
    } catch (err) {
      console.error("Refresh Prices Error:", err);

      alert("Unable to refresh stock prices.");
    } finally {
      setRefreshing(false);
    }
  };

  // ======================================================
  // HANDLE FORM CHANGE
  // ======================================================

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ======================================================
  // ADD / UPDATE HOLDING
  // ======================================================

  const handleSubmit = async () => {
    const symbol = form.symbol.trim();
    const company = form.company.trim();
    const quantity = Number(form.quantity);
    const buyPrice = Number(form.buyPrice);

    if (!symbol || !company || !form.quantity || !form.buyPrice) {
      alert("Please fill all fields.");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (buyPrice <= 0) {
      alert("Buy price must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // UPDATE
      // ==================================================

      if (editingId) {
        await updateHolding(editingId, {
          quantity,
          buyPrice,
        });

        alert("Holding updated successfully.");
      }

      // ==================================================
      // ADD
      // ==================================================

      else {
        await addHolding({
          symbol: symbol.toUpperCase(),
          company,
          quantity,
          buyPrice,
        });
      }

      // Reset form

      setForm({
        symbol: "",
        company: "",
        quantity: "",
        buyPrice: "",
      });

      setEditingId(null);

      await fetchPortfolio();
    } catch (err) {
      console.error("Save Holding Error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to save holding."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // EDIT HOLDING
  // ======================================================

  const handleEdit = (holding) => {
    setEditingId(holding._id);

    setForm({
      symbol: holding.symbol || "",
      company: holding.company || "",
      quantity: holding.quantity || "",
      buyPrice: holding.buyPrice || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      symbol: "",
      company: "",
      quantity: "",
      buyPrice: "",
    });
  };

  // ======================================================
  // DELETE HOLDING
  // ======================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this holding?"
    );

    if (!confirmDelete) return;

    try {
      await deleteHolding(id);

      if (editingId === id) {
        handleCancelEdit();
      }

      await fetchPortfolio();
    } catch (err) {
      console.error("Delete Holding Error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete holding."
      );
    }
  };

  // ======================================================
  // AI PORTFOLIO ANALYSIS
  // ======================================================

  const handleAnalyzePortfolio = async () => {
    if (portfolio.length === 0) {
      alert(
        "Add at least one holding before analyzing your portfolio."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysis("");

      // Get latest portfolio data

      const latestPortfolio = await getPortfolio();

      const updatedPortfolio = Array.isArray(
        latestPortfolio
      )
        ? latestPortfolio
        : [];

      setPortfolio(updatedPortfolio);

      // Send portfolio to AI

      const result = await analyzePortfolio(
        updatedPortfolio
      );

      setAnalysis(
        result?.analysis ||
          result?.message ||
          "No analysis received."
      );
    } catch (err) {
      console.error("Portfolio AI Error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to analyze portfolio."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ======================================================
  // PORTFOLIO CALCULATIONS
  // ======================================================

  const totalInvestment = portfolio.reduce(
    (sum, stock) =>
      sum + Number(stock.investment || 0),
    0
  );

  const currentValue = portfolio.reduce(
    (sum, stock) =>
      sum + Number(stock.currentValue || 0),
    0
  );

  const totalProfit = portfolio.reduce(
    (sum, stock) =>
      sum + Number(stock.profit || 0),
    0
  );

  const roi =
    totalInvestment > 0
      ? (totalProfit / totalInvestment) * 100
      : 0;

  const profitPositive = totalProfit >= 0;
  const roiPositive = roi >= 0;

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              HEADER
          ================================================== */}

          <section className="mb-9">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <BriefcaseBusiness
                    size={20}
                    className="text-green-400"
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    Investments
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My Portfolio
                </h1>

                <p className="text-slate-400 mt-2 text-sm md:text-base">
                  Track your investments and monitor
                  portfolio performance.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                {/* REFRESH */}

                <button
                  type="button"
                  onClick={handleRefreshPrices}
                  disabled={refreshing}
                  className="
                    px-5 py-3 rounded-xl
                    bg-slate-900
                    border border-slate-800
                    hover:border-slate-700
                    hover:bg-slate-800
                    text-slate-300
                    hover:text-white
                    font-semibold
                    flex items-center justify-center gap-2
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <RefreshCw
                    size={17}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {refreshing
                    ? "Updating..."
                    : "Refresh Prices"}

                </button>

                {/* AI ANALYSIS */}

                <button
                  type="button"
                  onClick={handleAnalyzePortfolio}
                  disabled={
                    analyzing ||
                    portfolio.length === 0
                  }
                  className="
                    px-5 py-3 rounded-xl
                    bg-purple-500/10
                    border border-purple-500/20
                    text-purple-400
                    hover:bg-purple-500/20
                    font-semibold
                    flex items-center justify-center gap-2
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  <Sparkles size={17} />

                  {analyzing
                    ? "Analyzing..."
                    : "Analyze Portfolio"}

                </button>

              </div>

            </div>

          </section>

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          <section>

            <div className="mb-5">

              <h2 className="text-xl md:text-2xl font-semibold">
                Portfolio Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your investment position at a glance
              </p>

            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {/* TOTAL INVESTMENT */}

              <div className="
                rounded-xl bg-slate-900
                border border-slate-800
                p-5
                hover:border-slate-700
                transition-colors
              ">

                <div className="
                  w-10 h-10 rounded-lg
                  bg-blue-500/10
                  flex items-center justify-center
                ">

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

              {/* CURRENT VALUE */}

              <div className="
                rounded-xl bg-slate-900
                border border-slate-800
                p-5
                hover:border-slate-700
                transition-colors
              ">

                <div className="
                  w-10 h-10 rounded-lg
                  bg-green-500/10
                  flex items-center justify-center
                ">

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

              {/* PROFIT / LOSS */}

              <div className="
                rounded-xl bg-slate-900
                border border-slate-800
                p-5
                hover:border-slate-700
                transition-colors
              ">

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
                  Total Profit / Loss
                </p>

                <h3
                  className={`text-2xl font-bold mt-1 ${
                    profitPositive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {profitPositive ? "+" : "-"}
                  {formatCurrency(
                    Math.abs(totalProfit)
                  )}
                </h3>

              </div>

              {/* ROI */}

              <div className="
                rounded-xl bg-slate-900
                border border-slate-800
                p-5
                hover:border-slate-700
                transition-colors
              ">

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

            </div>

          </section>

          {/* ==================================================
              AI ANALYSIS
          ================================================== */}

          {analysis && (

            <section className="mt-8">

              <div className="
                rounded-xl
                border border-purple-500/20
                bg-slate-900
                overflow-hidden
              ">

                <div className="
                  px-6 py-5
                  border-b border-slate-800
                  flex items-center gap-4
                ">

                  <div className="
                    w-11 h-11 rounded-xl
                    bg-purple-500/10
                    flex items-center justify-center
                  ">

                    <Sparkles
                      size={21}
                      className="text-purple-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      Money Mentor AI
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Portfolio analysis and insights
                    </p>

                  </div>

                </div>

                <div className="px-6 py-6">

                  <div className="
                    text-slate-300
                    whitespace-pre-wrap
                    leading-7
                    text-sm md:text-base
                  ">
                    {analysis}
                  </div>

                  <div className="
                    mt-6 pt-4
                    border-t border-slate-800
                  ">

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Money Mentor AI provides educational
                      information only. This analysis is not
                      professional financial advice or a
                      recommendation to buy or sell securities.
                    </p>

                  </div>

                </div>

              </div>

            </section>

          )}

          {/* ==================================================
              CHARTS
          ================================================== */}

          {portfolio.length > 0 && (

            <section className="mt-10">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <BarChart3
                    size={20}
                    className="text-green-400"
                  />

                  <h2 className="text-xl md:text-2xl font-semibold">
                    Portfolio Analytics
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Visualize your portfolio allocation and performance.
                </p>

              </div>

              <div className="grid lg:grid-cols-2 gap-5">

                <div className="
                  rounded-xl
                  border border-slate-800
                  bg-slate-900
                  p-5 md:p-6
                ">

                  <PortfolioPieChart
                    portfolio={portfolio}
                  />

                </div>

                <div className="
                  rounded-xl
                  border border-slate-800
                  bg-slate-900
                  p-5 md:p-6
                ">

                  <PortfolioBarChart
                    portfolio={portfolio}
                  />

                </div>

              </div>

            </section>

          )}

          {/* ==================================================
              ADD / EDIT HOLDING
          ================================================== */}

          <section className="mt-10">

            <div
              className={`
                rounded-xl
                bg-slate-900
                border
                p-6 md:p-7
                ${
                  editingId
                    ? "border-blue-500/30"
                    : "border-slate-800"
                }
              `}
            >

              <div className="
                flex items-start justify-between
                gap-4 mb-6
              ">

                <div>

                  <div className="flex items-center gap-2">

                    {editingId ? (
                      <Pencil
                        size={19}
                        className="text-blue-400"
                      />
                    ) : (
                      <Plus
                        size={20}
                        className="text-green-400"
                      />
                    )}

                    <h2 className="text-xl md:text-2xl font-semibold">
                      {editingId
                        ? "Edit Holding"
                        : "Add Holding"}
                    </h2>

                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {editingId
                      ? "Update your investment details."
                      : "Add a stock to start tracking it in your portfolio."}
                  </p>

                </div>

                {editingId && (

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="
                      p-2 rounded-lg
                      text-slate-500
                      hover:text-white
                      hover:bg-slate-800
                      transition
                    "
                  >
                    <X size={19} />
                  </button>

                )}

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {/* SYMBOL */}

                <div>

                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Stock Symbol
                  </label>

                  <input
                    className={`
                      w-full
                      bg-slate-950
                      border border-slate-800
                      p-3.5 rounded-xl
                      outline-none text-white
                      placeholder:text-slate-600
                      focus:border-green-500
                      transition
                      ${
                        editingId
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }
                    `}
                    placeholder="e.g. AAPL"
                    value={form.symbol}
                    disabled={Boolean(editingId)}
                    onChange={(e) =>
                      handleChange(
                        "symbol",
                        e.target.value.toUpperCase()
                      )
                    }
                  />

                </div>

                {/* COMPANY */}

                <div>

                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Company Name
                  </label>

                  <input
                    className={`
                      w-full
                      bg-slate-950
                      border border-slate-800
                      p-3.5 rounded-xl
                      outline-none text-white
                      placeholder:text-slate-600
                      focus:border-green-500
                      transition
                      ${
                        editingId
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }
                    `}
                    placeholder="e.g. Apple Inc."
                    value={form.company}
                    disabled={Boolean(editingId)}
                    onChange={(e) =>
                      handleChange(
                        "company",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* QUANTITY */}

                <div>

                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="
                      w-full
                      bg-slate-950
                      border border-slate-800
                      p-3.5 rounded-xl
                      outline-none text-white
                      placeholder:text-slate-600
                      focus:border-green-500
                      transition
                    "
                    placeholder="Number of shares"
                    value={form.quantity}
                    onChange={(e) =>
                      handleChange(
                        "quantity",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* BUY PRICE */}

                <div>

                  <label className="block text-xs font-medium text-slate-500 mb-2">
                    Buy Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="
                      w-full
                      bg-slate-950
                      border border-slate-800
                      p-3.5 rounded-xl
                      outline-none text-white
                      placeholder:text-slate-600
                      focus:border-green-500
                      transition
                    "
                    placeholder="Price per share"
                    value={form.buyPrice}
                    onChange={(e) =>
                      handleChange(
                        "buyPrice",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`
                    px-6 py-3 rounded-xl
                    font-semibold
                    flex items-center justify-center gap-2
                    transition
                    ${
                      saving
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : editingId
                        ? "bg-blue-500 hover:bg-blue-400 text-white"
                        : "bg-green-500 hover:bg-green-400 text-slate-950"
                    }
                  `}
                >

                  {editingId ? (
                    <Save size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Holding"
                    : "Add Holding"}

                </button>

                {editingId && (

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="
                      px-6 py-3 rounded-xl
                      bg-slate-800
                      border border-slate-700
                      text-slate-300
                      hover:bg-slate-700
                      hover:text-white
                      font-semibold
                      flex items-center gap-2
                      transition
                      disabled:opacity-50
                    "
                  >

                    <X size={17} />

                    Cancel

                  </button>

                )}

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
                  Your Holdings
                </h2>

              </div>

              <p className="text-sm text-slate-500 mt-1">
                Your current investments and their performance.
              </p>

            </div>

            {portfolio.length === 0 ? (

              <div className="
                rounded-xl
                border border-slate-800
                bg-slate-900
                p-12 text-center
              ">

                <div className="
                  w-14 h-14 mx-auto
                  rounded-xl bg-slate-800
                  flex items-center justify-center
                  mb-5
                ">

                  <BriefcaseBusiness
                    size={26}
                    className="text-slate-500"
                  />

                </div>

                <h2 className="text-xl font-semibold">
                  No holdings added yet
                </h2>

                <p className="
                  text-sm text-slate-500
                  mt-2 max-w-md mx-auto
                ">
                  Add your first stock above to start
                  tracking your portfolio and investment
                  performance.
                </p>

              </div>

            ) : (

              <div className="grid lg:grid-cols-2 gap-5">

                {portfolio.map((holding) => (

                  <PortfolioCard
                    key={holding._id}
                    holding={holding}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />

                ))}

              </div>

            )}

          </section>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="
            mt-10 border-t
            border-slate-800 pt-5
          ">

            <p className="
              text-xs text-slate-600
              text-center leading-relaxed
            ">
              Money Mentor AI provides educational information
              only. It is not professional financial advice or
              a recommendation to buy or sell securities.
            </p>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Portfolio;