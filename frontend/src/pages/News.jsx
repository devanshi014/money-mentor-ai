import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import NewsCard from "../components/NewsCard";

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH NEWS
  // ===============================

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/news");

      const data = response.data;

      // Handle different backend response formats
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
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FORMAT PUBLISHED TIME
  // ===============================

  const formatTime = (time) => {
    if (!time) return "";

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

  // ===============================
  // MAIN UI
  // ===============================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* ===============================
          SIDEBAR
      =============================== */}

      <Sidebar />

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <main className="flex-1 p-8 overflow-y-auto">

        {/* ===============================
            PAGE HEADER
        =============================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <p className="text-blue-400 font-semibold mb-2">
              📰 MARKET UPDATES
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Financial News
            </h1>

            <p className="text-slate-400 mt-2">
              Stay updated with the latest financial
              and stock market news.
            </p>
          </div>

          {/* ===============================
              REFRESH BUTTON
          =============================== */}

          <button
            onClick={fetchNews}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Loading..." : "🔄 Refresh News"}
          </button>
        </div>

        {/* ===============================
            NEWS COUNT
        =============================== */}

        {!loading && news.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 mb-8">
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

        {/* ===============================
            LOADING
        =============================== */}

        {loading && (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">

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

        {/* ===============================
            NEWS GRID
        =============================== */}

        {!loading && news.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {news.map((item, index) => {

              // ===============================
              // SOURCE
              // ===============================

              const source =
                typeof item.source === "object"
                  ? item.source?.name
                  : item.source;

              // ===============================
              // TITLE
              // ===============================

              const title =
                item.title ||
                item.headline ||
                "Financial News";

              // ===============================
              // DESCRIPTION
              // ===============================

              const description =
                item.description ||
                item.summary ||
                "";

              // ===============================
              // IMAGE
              // ===============================

              const image =
                item.image ||
                item.imageUrl ||
                item.urlToImage ||
                "";

              // ===============================
              // ARTICLE URL
              // ===============================

              const url =
                item.url ||
                item.link ||
                "";

              // ===============================
              // PUBLISHED TIME
              // ===============================

              const time =
                item.time ||
                item.publishedAt ||
                item.datetime ||
                item.published ||
                "";

              return (
                <NewsCard
                  key={
                    item.id ||
                    item._id ||
                    item.url ||
                    `${title}-${index}`
                  }
                  source={
                    source || "Financial News"
                  }
                  title={title}
                  description={description}
                  image={image}
                  url={url}
                  time={formatTime(time)}
                />
              );
            })}

          </div>
        )}

        {/* ===============================
            NO NEWS
        =============================== */}

        {!loading && news.length === 0 && (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">

            <div className="text-5xl mb-4">
              📰
            </div>

            <h2 className="text-xl font-semibold">
              No News Available
            </h2>

            <p className="text-slate-400 mt-2">
              We couldn't load the latest financial
              news right now.
            </p>

            <button
              onClick={fetchNews}
              className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              🔄 Try Again
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default News;