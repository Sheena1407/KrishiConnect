const { getWeatherForLocation } = require('../services/weatherService');

// @desc    Get weather for city or farm location
// @route   GET /api/weather
// @access  Public / Private
const getWeather = async (req, res) => {
  try {
    const location = req.query.location || 'Bhopal';
    const data = await getWeatherForLocation(location);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWeather,
};
