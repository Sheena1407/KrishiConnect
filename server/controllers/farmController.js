const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');

// @desc    Get all farms of logged-in user
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm by ID
// @route   GET /api/farms/:id
// @access  Private
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    const crops = await Crop.find({ farmId: farm._id });
    const soilReports = await SoilReport.find({ farmId: farm._id }).sort({ createdAt: -1 });
    res.json({ success: true, farm, crops, soilReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    const {
      farmName,
      location,
      area,
      soilType,
      irrigationType,
      waterSource,
      farmingMethod,
      description,
    } = req.body;

    if (!farmName || !location || !area) {
      return res.status(400).json({
        success: false,
        message: 'Farm name, location, and area are required',
      });
    }

    const farm = await Farm.create({
      userId: req.user._id,
      farmName,
      location,
      area: parseFloat(area),
      soilType: soilType || 'Black Soil',
      irrigationType: irrigationType || 'Drip Irrigation',
      waterSource: waterSource || 'Borewell',
      farmingMethod: farmingMethod || 'Organic Farming',
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Farm registered successfully!',
      farm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const {
      farmName,
      location,
      area,
      soilType,
      irrigationType,
      waterSource,
      farmingMethod,
      description,
    } = req.body;

    if (farmName) farm.farmName = farmName;
    if (location) farm.location = location;
    if (area) farm.area = parseFloat(area);
    if (soilType) farm.soilType = soilType;
    if (irrigationType) farm.irrigationType = irrigationType;
    if (waterSource) farm.waterSource = waterSource;
    if (farmingMethod) farm.farmingMethod = farmingMethod;
    if (description !== undefined) farm.description = description;

    const updated = await farm.save();
    res.json({
      success: true,
      message: 'Farm details updated successfully',
      farm: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Clean up dependent crops
    await Crop.deleteMany({ farmId: farm._id });
    await farm.deleteOne();

    res.json({
      success: true,
      message: 'Farm and associated crops deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
};
