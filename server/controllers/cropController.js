const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

// @desc    Get all crops for user
// @route   GET /api/crops
// @access  Private
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id })
      .populate('farmId', 'farmName location area soilType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Private
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user._id }).populate(
      'farmId',
      'farmName location area'
    );
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }
    res.json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
const createCrop = async (req, res) => {
  try {
    const {
      farmId,
      cropName,
      variety,
      area,
      sowingDate,
      expectedHarvestDate,
      growthStage,
      health,
      irrigationStatus,
      fertilizerUsed,
      notes,
    } = req.body;

    if (!farmId || !cropName || !area || !sowingDate || !expectedHarvestDate) {
      return res.status(400).json({
        success: false,
        message: 'Farm, crop name, area, sowing date, and harvest date are required',
      });
    }

    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Specified farm does not belong to you or does not exist',
      });
    }

    const crop = await Crop.create({
      userId: req.user._id,
      farmId,
      cropName,
      variety: variety || 'Standard Variety',
      area: parseFloat(area),
      sowingDate: new Date(sowingDate),
      expectedHarvestDate: new Date(expectedHarvestDate),
      growthStage: growthStage || 'Vegetative',
      health: health || 'Healthy',
      irrigationStatus: irrigationStatus || 'Adequate',
      fertilizerUsed: fertilizerUsed || 'Standard N-P-K',
      notes: notes || '',
    });

    const populated = await Crop.findById(crop._id).populate('farmId', 'farmName location area');

    res.status(201).json({
      success: true,
      message: 'Crop record added successfully!',
      crop: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    const {
      farmId,
      cropName,
      variety,
      area,
      sowingDate,
      expectedHarvestDate,
      growthStage,
      health,
      irrigationStatus,
      fertilizerUsed,
      notes,
    } = req.body;

    if (farmId) crop.farmId = farmId;
    if (cropName) crop.cropName = cropName;
    if (variety) crop.variety = variety;
    if (area) crop.area = parseFloat(area);
    if (sowingDate) crop.sowingDate = new Date(sowingDate);
    if (expectedHarvestDate) crop.expectedHarvestDate = new Date(expectedHarvestDate);
    if (growthStage) crop.growthStage = growthStage;
    if (health) crop.health = health;
    if (irrigationStatus) crop.irrigationStatus = irrigationStatus;
    if (fertilizerUsed !== undefined) crop.fertilizerUsed = fertilizerUsed;
    if (notes !== undefined) crop.notes = notes;

    const updated = await crop.save();
    const populated = await Crop.findById(updated._id).populate('farmId', 'farmName location area');

    res.json({
      success: true,
      message: 'Crop details updated successfully',
      crop: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user._id });
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    await crop.deleteOne();
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
};
