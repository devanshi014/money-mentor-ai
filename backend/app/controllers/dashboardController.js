const {
  getUserDashboard,
} = require("../services/dashboardService");

// ===============================
// Get Dashboard
// ===============================

const getDashboard = async (req, res) => {
  try {
    const dashboard =
      await getUserDashboard(req.user.id);

    res.status(200).json(dashboard);
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard data.",
    });
  }
};

module.exports = {
  getDashboard,
};