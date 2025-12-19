const Analytics = require("../models/Analytics");

const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    let daysAgo = 30;
    switch (timeRange) {
      case '7d': daysAgo = 7; break;
      case '30d': daysAgo = 30; break;
      case '90d': daysAgo = 90; break;
      case '1y': daysAgo = 365; break;
      default: daysAgo = 30;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch all analytics data using the model
    const [
      totalRevenue,
      activeUsers,
      totalOrders,
      activeSellers,
      totalProducts,
      topCategories,
      topSellers,
      revenueOverTime,
      userActivityOverTime
    ] = await Promise.all([
      Analytics.getTotalRevenue(startDateStr),
      Analytics.getActiveUsersCount(startDateStr),
      Analytics.getTotalOrdersCount(startDateStr),
      Analytics.getActiveSellersCount(),
      Analytics.getTotalProductsCount(startDateStr),
      Analytics.getTopCategories(startDateStr, 6),
      Analytics.getTopSellers(startDateStr, 5),
      Analytics.getRevenueOverTime(startDateStr),
      Analytics.getUserActivityOverTime(startDateStr)
    ]);

    // Prepare KPI data
    const kpiData = [
      {
        title: 'Total Revenue',
        value: totalRevenue,
        color: 'green'
      },
      {
        title: 'Active Users',
        value: activeUsers,
        color: 'blue'
      },
      {
        title: 'Total Orders',
        value: totalOrders,
        color: 'purple'
      },
      {
        title: 'Active Sellers',
        value: activeSellers,
        color: 'orange'
      },
      {
        title: 'Products Listed',
        value: totalProducts,
        color: 'indigo'
      }
    ];

    res.json({
      success: true,
      data: {
        kpiData,
        topCategories,
        topSellers,
        revenueOverTime,
        userActivityOverTime,
        timeRange,
        periodStart: startDateStr
      }
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics
};
