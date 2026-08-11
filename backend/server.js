const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./app/database/db");

const chatRoutes = require("./app/routes/chatRoutes");
const stockRoutes = require("./app/routes/stockRoutes");
const newsRoutes = require("./app/routes/newsRoutes");
const expenseRoutes = require("./app/routes/expenseRoutes");
const authRoutes = require("./app/routes/authRoutes");
const watchlistRoutes = require("./app/routes/watchlistRoutes");
const portfolioRoutes = require("./app/routes/portfolioRoutes");
const portfolioHistoryRoutes = require("./app/routes/portfolioHistoryRoutes");
const dashboardRoutes = require("./app/routes/dashboardRoutes");
const ipoRoutes = require("./app/routes/ipoRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use(
  "/api/portfolio-history",
  portfolioHistoryRoutes
);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ipo", ipoRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Money Mentor AI Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});