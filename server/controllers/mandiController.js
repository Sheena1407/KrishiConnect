const { getMandiPrices } = require('../services/mandiService');

// @desc    Get Mandi prices with filters
// @route   GET /api/mandi
// @access  Public / Private
const getMandi = async (req, res) => {
  try {
    const list = getMandiPrices(req.query);
    res.json({
      success: true,
      count: list.length,
      markets: list,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMandi,
};
