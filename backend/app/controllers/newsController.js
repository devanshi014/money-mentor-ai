const { getLatestNews } = require("../services/newsService");

const getNews = async (req, res) => {
  try {
    const news = await getLatestNews();

    res.status(200).json(news);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch latest news.",
    });
  }
};

module.exports = {
  getNews,
};