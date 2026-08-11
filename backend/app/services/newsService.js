const axios = require("axios");

// ======================================================
// NEWS API KEY
// ======================================================

const API_KEY = process.env.NEWS_API_KEY;

// ======================================================
// Get Image From Article Page
// ======================================================

const getArticleImage = async (url) => {
  try {
    if (!url) {
      return "";
    }

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      maxRedirects: 5,
    });

    const html = response.data;

    if (!html || typeof html !== "string") {
      return "";
    }

    // ==================================================
    // Find og:image
    // ==================================================

    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    );

    if (ogImageMatch?.[1]) {
      return ogImageMatch[1];
    }

    // ==================================================
    // Alternative og:image format
    // ==================================================

    const ogImageReverseMatch = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["'][^>]*>/i
    );

    if (ogImageReverseMatch?.[1]) {
      return ogImageReverseMatch[1];
    }

    // ==================================================
    // Twitter image fallback
    // ==================================================

    const twitterImageMatch = html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
    );

    if (twitterImageMatch?.[1]) {
      return twitterImageMatch[1];
    }

    // ==================================================
    // Alternative Twitter image format
    // ==================================================

    const twitterImageReverseMatch = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["'][^>]*>/i
    );

    if (twitterImageReverseMatch?.[1]) {
      return twitterImageReverseMatch[1];
    }

    return "";
  } catch (error) {
    console.error(
      "Article Image Error:",
      url,
      error.response?.status ||
        error.message
    );

    return "";
  }
};

// ======================================================
// Get Latest Financial News
// ======================================================

const getLatestNews = async () => {
  try {
    // ==================================================
    // Check API Key
    // ==================================================

    if (!API_KEY) {
      throw new Error(
        "NEWS_API_KEY is missing from environment variables."
      );
    }

    // ==================================================
    // NewsAPI Request
    // ==================================================

    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          category: "business",
          country: "us",
          pageSize: 12,
          apiKey: API_KEY,
        },
      }
    );

    // ==================================================
    // Validate API Response
    // ==================================================

    if (!response.data) {
      throw new Error(
        "Empty response received from News API."
      );
    }

    if (response.data.status !== "ok") {
      throw new Error(
        response.data.message ||
          "News API returned an error."
      );
    }

    // ==================================================
    // Get Articles
    // ==================================================

    const articles = Array.isArray(
      response.data.articles
    )
      ? response.data.articles
      : [];

    // ==================================================
    // Filter Valid Articles
    // ==================================================

    const validArticles = articles.filter(
      (article) =>
        article &&
        article.title &&
        article.url
    );

    // ==================================================
    // Process Articles
    // ==================================================

    const formattedArticles = [];

    for (const article of validArticles) {
      // ==================================================
      // First use NewsAPI image
      // ==================================================

      let image =
        article.urlToImage ||
        "";

      // ==================================================
      // If NewsAPI has no image,
      // fetch image from article page
      // ==================================================

      if (!image) {
        image =
          await getArticleImage(
            article.url
          );
      }

      // ==================================================
      // Add Formatted Article
      // ==================================================

      formattedArticles.push({
        title: article.title,

        source:
          article.source?.name ||
          "Unknown Source",

        description:
          article.description ||
          "",

        image: image || "",

        url: article.url,

        publishedAt:
          article.publishedAt ||
          "",
      });
    }

    // ==================================================
    // Return Articles
    // ==================================================

    return formattedArticles;
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "NEWS API ERROR"
    );

    console.error(
      error.response?.data ||
        error.message
    );

    console.error(
      "================================="
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch financial news."
    );
  }
};

// ======================================================
// Export
// ======================================================

module.exports = {
  getLatestNews,
};