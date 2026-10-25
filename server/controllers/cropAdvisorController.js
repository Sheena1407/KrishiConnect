const { adviseCrops, CROP_CATALOG } = require('../services/cropAdvisorService');

// @desc    Get crop recommendation
// @route   POST /api/crop-advisor/recommend
// @access  Public / Private
const getRecommendations = async (req, res) => {
  try {
    const { location, soilType, soilPH, season, waterAvailability, farmSize } = req.body;
    const result = adviseCrops({
      location,
      soilType,
      soilPH,
      season,
      waterAvailability,
      farmSize,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all crops catalog
// @route   GET /api/crop-advisor/crops
// @access  Public / Private
const getCatalog = async (req, res) => {
  try {
    res.json({ success: true, count: CROP_CATALOG.length, crops: CROP_CATALOG });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendations,
  getCatalog,
};
