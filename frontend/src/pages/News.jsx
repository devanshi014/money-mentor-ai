
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import NewsCard from "../components/NewsCard";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH NEWS
  // ======================================================

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/news");

      console.log("News API Response:", response.data);

      const data = response.data;

      let articles = [];

      if (Array.isArray(data)) {
        articles = data;
      } else if (Array.isArray(data.news)) {
        articles = data.news;
      } else if (Array.isArray(data.articles)) {
        articles = data.articles;
      } else if (Array.isArray(data.data)) {
        articles = data.data;
      }

      setNews(articles);

      if (articles.length === 0) {
        setError("No financial news was returned by the backend.");
      }
    } catch (err) {
      console.error(
        "News API Error:",
        err.response?.data || err.message
      );

      setNews([]);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load financial news."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FORMAT TIME
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
  // NORMALIZE ARTICLE
  // ======================================================

  const normalizeArticle = (item) => {
    const source =
      typeof item.source === "object"
        ? item.source?.name
        : item.source;

    const title =
      item.title ||
      item.headline ||
      item.name ||
      "Financial News";

    const description =
      item.description ||
      item.summary ||
      item.content ||
      "";

    const image =
      item.image ||
      item.imageUrl ||
      item.image_url ||
      item.thumbnail ||
      item.urlToImage ||
      "";

    const url =
      item.url ||
      item.link ||
      "";

    const time =
      item.time ||
      item.publishedAt ||
      item.datetime ||
      item.published ||
      item.date ||
      "";

    return {
      id:
        item.id ||
        item._id ||
        item.url ||
        `${title}-${Math.random()}`,

      source:
        source || "Financial News",

      title,

      description,

      image,

      url,

      time: formatTime(time),
    };
  };

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN AREA */}

      <div className="flex-1 min-w-0 flex flex-col">

        {/* NAVBAR */}

        <Navbar />

        {/* CONTENT */}

        <main className="flex-1 p-5 md:p-8 overflow-y-auto">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <span className="text-blue-400 text-lg">
                  📰
                </span>

                <p className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
                  Market Updates
                </p>

              </div>

              <h1 className="text-3xl md:text-4xl font-bold">
                Financial News
              </h1>

              <p className="text-slate-400 mt-2">
                Stay updated with the latest financial and stock market news.
              </p>

            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchNews}
              disabled={loading}
              className={`
                px-5
                py-3
                rounded-lg
                font-semibold
                transition
                ${
                  loading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }
              `}
            >
              {loading
                ? "Loading..."
                : "🔄 Refresh News"}
            </button>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">

              <div className="text-5xl mb-4">
                📰
              </div>

              <h2 className="text-xl font-semibold">
                Loading Financial News
              </h2>

              <p className="text-slate-400 mt-2">
                Fetching the latest market updates...
              </p>

            </div>

          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && news.length === 0 && (

            <div className="bg-slate-900 border border-red-500/20 rounded-xl p-10 text-center">

              <div className="text-5xl mb-4">
                ⚠️
              </div>

              <h2 className="text-xl font-semibold">
                Unable to Load News
              </h2>

              <p className="text-slate-400 mt-2">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchNews}
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                🔄 Try Again
              </button>

            </div>

          )}

          {/* ==================================================
              NEWS COUNT
          ================================================== */}

          {!loading && news.length > 0 && (

            <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 mb-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-400 text-sm">
                    Latest Articles
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {news.length}
                  </p>

                </div>

                <div className="text-4xl">
                  📰
                </div>

              </div>

            </div>

          )}

          {/* ==================================================
              NEWS GRID
          ================================================== */}

          {!loading && news.length > 0 && (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {news.map((item, index) => {

                const article = normalizeArticle(item);

                return (

                  <div
                    key={article.id || index}
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
                      source={article.source}
                      title={article.title}
                      description={article.description}
                      image={article.image}
                      url={article.url}
                      time={article.time}
                    />

                  </div>

                );

              })}

            </div>

          )}

          {/* DISCLAIMER */}

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

export default News;

