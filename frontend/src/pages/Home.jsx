import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import StockCard from "../components/StockCard";
import NewsCard from "../components/NewsCard";

import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Newspaper,
} from "lucide-react";

function Home() {
  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // ======================================================
  // GET LOGGED-IN USER
  // ======================================================

  const getUserName = () => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        return (
          user?.name ||
          user?.username ||
          user?.fullName ||
          "User"
        );
      }
    } catch (error) {
      console.error("User data error:", error);
    }

    return "User";
  };

  const userName = getUserName();

  // ======================================================
  // GET TIME-BASED GREETING
  // ======================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good evening";
    }

    return "Good night";
  };

  const greeting = getGreeting();

  // ======================================================
  // FETCH HOME DATA
  // ======================================================

  useEffect(() => {
    fetchDashboard();
    fetchStocks();
    fetchNews();
  }, []);

  // ======================================================
  // FETCH DASHBOARD
  // ======================================================

  const fetchDashboard = async () => {
    try {
      setDashboardLoading(true);

      const response = await axios.get(
        `${API_URL}/api/dashboard`
      );

      setDashboard(response.data);
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error.response?.data || error.message
      );

      setDashboard(null);
    } finally {
      setDashboardLoading(false);
    }
  };

  // ======================================================
  // FETCH STOCKS
  // ======================================================

  const fetchStocks = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/stocks`
      );

      let stockData = [];

      if (Array.isArray(response.data)) {
        stockData = response.data;
      } else if (Array.isArray(response.data.stocks)) {
        stockData = response.data.stocks;
      } else if (Array.isArray(response.data.data)) {
        stockData = response.data.data;
      }

      const normalizedStocks = stockData.map((stock) => {
        const rawChange =
          stock.change ??
          stock.changePercent ??
          stock.change_percentage ??
          stock.percentChange ??
          stock.percentageChange ??
          stock.dp ??
          0;

        const numericChange = Number(
          String(rawChange)
            .replace("%", "")
            .trim()
        );

        const rawPrice =
          stock.price ??
          stock.currentPrice ??
          stock.current_price ??
          stock.c ??
          0;

        const numericPrice = Number(
          String(rawPrice)
            .replace(/₹|,/g, "")
            .trim()
        );

        return {
          ...stock,

          symbol:
            stock.symbol ||
            stock.ticker ||
            "N/A",

          company:
            stock.company ||
            stock.name ||
            stock.companyName ||
            stock.symbol ||
            "Unknown Company",

          price: Number.isFinite(numericPrice)
            ? numericPrice
            : 0,

          change: Number.isFinite(numericChange)
            ? numericChange
            : 0,
        };
      });

      setStocks(normalizedStocks);
    } catch (error) {
      console.error(
        "Stock Error:",
        error.response?.data || error.message
      );

      setStocks([]);
    }
  };

  // ======================================================
  // FETCH NEWS
  // ======================================================

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/news`
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setNews(data);
      } else if (Array.isArray(data.news)) {
        setNews(data.news);
      } else if (Array.isArray(data.articles)) {
        setNews(data.articles);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error(
        "News Error:",
        error.response?.data || error.message
      );

      setNews([]);
    }
  };

  // ======================================================
  // DASHBOARD SUMMARY
  // ======================================================

  const summary = dashboard?.summary || {};

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
  // FORMAT NEWS TIME
  // ======================================================

  const formatTime = (time) => {
    if (!time) {
      return "Recently published";
    }

    try {
      const date = new Date(time);

      if (Number.isNaN(date.getTime())) {
        return time;
      }

      return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return time;
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
          MAIN AREA
      ================================================== */}

      <div className="flex-1 min-w-0">

        {/* ==================================================
            NAVBAR
        ================================================== */}

        <Navbar />

        <main className="px-5 py-7 md:px-8 lg:px-10 max-w-[1600px] mx-auto">

          {/* ==================================================
              WELCOME SECTION
          ================================================== */}

          <section className="mb-10">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <span className="w-2 h-2 rounded-full bg-green-400" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
                    Personal Finance
                  </span>

                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {greeting}, {userName}
                </h1>

                <p className="text-slate-400 mt-3 text-sm md:text-base max-w-2xl">
                  Here's a quick overview of your portfolio,
                  market activity, and the latest financial news.
                </p>

              </div>

              {/* Market Status */}

              <div
                className="
                  hidden
                  md:flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  bg-slate-900
                  border
                  border-slate-800
                "
              >

                <div className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />

                </div>

                <div>

                  <p className="text-xs font-medium text-slate-300">
                    Market Status
                  </p>

                  <p className="text-xs text-green-400 mt-0.5">
                    Live market data
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              FINANCIAL SNAPSHOT
          ================================================== */}

          <section>

            <div className="flex items-end justify-between mb-5">

              <div>

                <div className="flex items-center gap-2">

                  <BarChart3
                    size={19}
                    className="text-green-400"
                  />

                  <h2 className="text-xl md:text-2xl font-semibold">
                    Financial Snapshot
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Your portfolio at a glance
                </p>

              </div>

            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

              <DashboardCard
                title="Portfolio Value"
                value={
                  dashboardLoading
                    ? "Loading..."
                    : formatCurrency(currentValue)
                }
                icon={<Wallet />}
                color="bg-green-500"
              />

              <DashboardCard
                title="Total Investment"
                value={
                  dashboardLoading
                    ? "Loading..."
                    : formatCurrency(totalInvestment)
                }
                icon={<TrendingUp />}
                color="bg-blue-500"
              />

              <DashboardCard
                title="Profit / Loss"
                value={
                  dashboardLoading
                    ? "Loading..."
                    : `${
                        totalProfit >= 0
                          ? "+"
                          : "-"
                      }${formatCurrency(
                        Math.abs(totalProfit)
                      )}`
                }
                icon={<PiggyBank />}
                color={
                  totalProfit >= 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }
              />

              <DashboardCard
                title="Total Holdings"
                value={
                  dashboardLoading
                    ? "Loading..."
                    : totalHoldings
                }
                icon={<Landmark />}
                color="bg-purple-500"
              />

            </div>

          </section>

          {/* ==================================================
              PORTFOLIO PERFORMANCE
          ================================================== */}

          <section className="mt-7">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* ROI */}

                <div className="flex items-center gap-4">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      roi >= 0
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >

                    {roi >= 0 ? (
                      <ArrowUpRight
                        size={22}
                        className="text-green-400"
                      />
                    ) : (
                      <ArrowDownRight
                        size={22}
                        className="text-red-400"
                      />
                    )}

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Portfolio ROI
                    </p>

                    <p
                      className={`text-2xl font-bold mt-1 ${
                        roi >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {roi >= 0 ? "+" : ""}
                      {roi.toFixed(2)}%
                    </p>

                  </div>

                </div>

                {/* Divider */}

                <div className="hidden md:block h-10 w-px bg-slate-800" />

                {/* Profit */}

                <div className="md:text-right">

                  <p className="text-sm text-slate-500">
                    Total Profit
                  </p>

                  <p
                    className={`text-xl font-semibold mt-1 ${
                      totalProfit >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {totalProfit >= 0 ? "+" : "-"}
                    {formatCurrency(
                      Math.abs(totalProfit)
                    )}
                  </p>

                </div>

                {/* Current Value */}

                <div className="md:text-right">

                  <p className="text-sm text-slate-500">
                    Current Value
                  </p>

                  <p className="text-xl font-semibold mt-1 text-blue-400">
                    {formatCurrency(currentValue)}
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              TRENDING STOCKS
          ================================================== */}

          <section className="mt-11">

            <div className="flex items-end justify-between mb-5">

              <div>

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={19}
                    className="text-blue-400"
                  />

                  <h2 className="text-xl md:text-2xl font-semibold">
                    Trending Stocks
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Latest market prices and daily movement
                </p>

              </div>

            </div>

            {stocks.length > 0 ? (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {stocks.slice(0, 6).map((stock) => {

                  const change = Number(stock.change);

                  const safeChange =
                    Number.isFinite(change)
                      ? change
                      : 0;

                  return (
                    <div
                      key={stock.symbol}
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

                      <StockCard
                        symbol={stock.symbol}
                        company={stock.company}
                        price={stock.price}
                        change={safeChange}
                        positive={safeChange >= 0}
                      />

                    </div>
                  );

                })}

              </div>

            ) : (

              <div
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-10
                  text-center
                "
              >

                <TrendingUp
                  size={30}
                  className="mx-auto text-slate-600 mb-3"
                />

                <p className="text-sm text-slate-400">
                  Loading market data...
                </p>

              </div>

            )}

          </section>

          {/* ==================================================
              FINANCIAL NEWS
          ================================================== */}

          <section className="mt-11">

            <div className="flex items-end justify-between mb-5">

              <div>

                <div className="flex items-center gap-2">

                  <Newspaper
                    size={19}
                    className="text-purple-400"
                  />

                  <h2 className="text-xl md:text-2xl font-semibold">
                    Latest Financial News
                  </h2>

                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Stay informed about markets and the economy
                </p>

              </div>

            </div>

            {news.length > 0 ? (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {news
                  .slice(0, 6)
                  .map((item, index) => {

                    const source =
                      typeof item.source === "object"
                        ? item.source?.name
                        : item.source;

                    const title =
                      item.title ||
                      item.headline ||
                      "Financial News";

                    const time =
                      item.time ||
                      item.publishedAt ||
                      item.datetime ||
                      "";

                    const image =
                      item.image ||
                      item.imageUrl ||
                      item.image_url ||
                      item.thumbnail ||
                      item.urlToImage ||
                      "";

                    const description =
                      item.description ||
                      item.summary ||
                      "";

                    return (
                      <div
                        key={
                          item.id ||
                          item.url ||
                          index
                        }
                        className="
                          rounded-xl
                          overflow-hidden
                          border
                          border-slate-800
                          bg-slate-900
                          transition-all
                          duration-200
                          hover:border-slate-700
                          hover:-translate-y-0.5
                        "
                      >

                        <NewsCard
                          source={
                            source ||
                            "Financial News"
                          }
                          title={title}
                          time={formatTime(time)}
                          description={description}
                          image={image}
                          url={item.url}
                        />

                      </div>
                    );

                  })}

              </div>

            ) : (

              <div
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-10
                  text-center
                "
              >

                <Newspaper
                  size={30}
                  className="mx-auto text-slate-600 mb-3"
                />

                <p className="text-sm text-slate-400">
                  Loading financial news...
                </p>

              </div>

            )}

          </section>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-12 border-t border-slate-800 pt-5">

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

export default Home;