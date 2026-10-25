const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const PestAlert = require('../models/PestAlert');
const FarmActivity = require('../models/FarmActivity');
const Order = require('../models/Order');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Expert = require('../models/Expert');
const { calculateFarmHealthScore } = require('../services/farmHealthScoreService');

// Productivity benchmark in quintals per acre
const PRODUCTIVITY_BENCHMARK = {
  wheat: { yieldPerAcre: 20, pricePerQtl: 2950 },
  soybean: { yieldPerAcre: 12, pricePerQtl: 4820 },
  cotton: { yieldPerAcre: 14, pricePerQtl: 7320 },
  chickpea: { yieldPerAcre: 10, pricePerQtl: 5300 },
  chana: { yieldPerAcre: 10, pricePerQtl: 5300 },
  mustard: { yieldPerAcre: 9, pricePerQtl: 5650 },
  tomato: { yieldPerAcre: 200, pricePerQtl: 1850 },
  maize: { yieldPerAcre: 28, pricePerQtl: 2080 },
  paddy: { yieldPerAcre: 22, pricePerQtl: 3850 },
  rice: { yieldPerAcre: 22, pricePerQtl: 3850 },
  default: { yieldPerAcre: 15, pricePerQtl: 3500 },
};

// @desc    Get comprehensive analytics for logged in farmer
// @route   GET /api/analytics/farmer
// @access  Private
const getFarmerAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const [farms, crops, soilReports, pestAlerts, activities] = await Promise.all([
      Farm.find({ userId }),
      Crop.find({ userId }).populate('farmId', 'farmName location area'),
      SoilReport.find({ userId }).sort({ createdAt: -1 }),
      PestAlert.find({ isActive: true }),
      FarmActivity.find({ userId }).sort({ date: 1 }),
    ]);

    // 1. Metric: Total Area
    const totalFarmArea = farms.reduce((acc, curr) => acc + (curr.area || 0), 0);
    const totalCropArea = crops.reduce((acc, curr) => acc + (curr.area || 0), 0);

    // 2. Metric: Expected Harvest & Estimated Income
    let totalHarvestQuintals = 0;
    let totalEstimatedIncome = 0;

    const cropYieldBreakdown = crops.map((crop) => {
      const cName = crop.cropName.toLowerCase();
      let benchmark = PRODUCTIVITY_BENCHMARK.default;
      for (const [key, val] of Object.entries(PRODUCTIVITY_BENCHMARK)) {
        if (cName.includes(key)) {
          benchmark = val;
          break;
        }
      }

      const yieldQtl = crop.area * benchmark.yieldPerAcre;
      const income = yieldQtl * benchmark.pricePerQtl;

      totalHarvestQuintals += yieldQtl;
      totalEstimatedIncome += income;

      return {
        name: crop.cropName,
        variety: crop.variety,
        area: crop.area,
        estimatedYieldQuintals: yieldQtl,
        estimatedYieldTons: parseFloat((yieldQtl / 10).toFixed(2)),
        estimatedIncome: income,
        health: crop.health,
        growthStage: crop.growthStage,
      };
    });

    const expectedHarvestTons = parseFloat((totalHarvestQuintals / 10).toFixed(2));

    // 3. Farm Health Score
    const healthScoreResult = calculateFarmHealthScore({
      soilReports,
      crops,
      farms,
      pestAlerts,
      activities,
    });

    // 4. Distribution Chart Data
    const cropDistribution = crops.map((c) => ({
      name: c.cropName,
      area: c.area,
      health: c.health,
    }));

    // 5. Crop Health Breakdown
    const healthCounts = { Healthy: 0, Moderate: 0, 'Needs Attention': 0, Diseased: 0 };
    crops.forEach((c) => {
      if (healthCounts[c.health] !== undefined) {
        healthCounts[c.health] += 1;
      }
    });
    const cropHealthStats = Object.keys(healthCounts).map((k) => ({
      status: k,
      count: healthCounts[k],
    }));

    // 6. Farm Performance Timeline
    const performanceTrend = [
      { month: 'Jun', yieldTons: Math.max(1, expectedHarvestTons * 0.4), income: Math.round(totalEstimatedIncome * 0.35) },
      { month: 'Jul', yieldTons: Math.max(1.5, expectedHarvestTons * 0.55), income: Math.round(totalEstimatedIncome * 0.5) },
      { month: 'Aug', yieldTons: Math.max(2, expectedHarvestTons * 0.7), income: Math.round(totalEstimatedIncome * 0.68) },
      { month: 'Sep', yieldTons: Math.max(2.8, expectedHarvestTons * 0.85), income: Math.round(totalEstimatedIncome * 0.82) },
      { month: 'Oct', yieldTons: expectedHarvestTons || 8.5, income: totalEstimatedIncome || 206410 },
    ];

    res.json({
      success: true,
      summary: {
        totalFarms: farms.length,
        totalCrops: crops.length,
        farmArea: totalFarmArea || (totalCropArea || 12),
        cropCultivatedArea: totalCropArea,
        expectedHarvestTons: expectedHarvestTons || 8.5,
        estimatedIncome: totalEstimatedIncome || 206410,
        currency: '₹',
      },
      healthScore: healthScoreResult,
      cropYieldBreakdown,
      charts: {
        cropDistribution,
        cropHealthStats,
        performanceTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin platform analytics
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const [
      totalFarmers,
      totalFarms,
      totalCrops,
      totalOrders,
      totalProducts,
      totalExperts,
      orders,
      users,
      crops,
    ] = await Promise.all([
      User.countDocuments({ role: 'Farmer' }),
      Farm.countDocuments(),
      Crop.countDocuments(),
      Order.countDocuments(),
      Resource.countDocuments(),
      Expert.countDocuments(),
      Order.find(),
      User.find({ role: 'Farmer' }).sort({ createdAt: -1 }).limit(10),
      Crop.find().select('cropName area health'),
    ]);

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    // Orders by status
    const orderStatuses = { Confirmed: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => {
      if (orderStatuses[o.status] !== undefined) {
        orderStatuses[o.status] += 1;
      }
    });

    res.json({
      success: true,
      metrics: {
        totalFarmers,
        totalFarms,
        totalCrops,
        totalOrders,
        totalProducts,
        totalExperts,
        totalRevenue,
      },
      orderStatuses: Object.keys(orderStatuses).map((status) => ({
        status,
        count: orderStatuses[status],
      })),
      recentUsers: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarmerAnalytics,
  getAdminAnalytics,
};
