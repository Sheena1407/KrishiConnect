const PestAlert = require('../models/PestAlert');

// @desc    Get all pest alerts
// @route   GET /api/pests
// @access  Public / Private
const getPestAlerts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.crop) {
      filter.crop = new RegExp(req.query.crop, 'i');
    }
    if (req.query.riskLevel) {
      filter.riskLevel = req.query.riskLevel;
    }
    const alerts = await PestAlert.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new pest alert (Admin only)
// @route   POST /api/pests
// @access  Private/Admin
const createPestAlert = async (req, res) => {
  try {
    const { crop, pestName, symptoms, riskLevel, prevention, recommendation } = req.body;
    if (!crop || !pestName || !symptoms || !prevention || !recommendation) {
      return res.status(400).json({
        success: false,
        message: 'Crop, pest name, symptoms, prevention, and recommendation are required',
      });
    }

    const alert = await PestAlert.create({
      crop,
      pestName,
      symptoms,
      riskLevel: riskLevel || 'Medium',
      prevention,
      recommendation,
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Pest alert published!', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update / toggle pest alert
// @route   PUT /api/pests/:id
// @access  Private
const updatePestAlert = async (req, res) => {
  try {
    const alert = await PestAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Pest alert not found' });
    }

    const { crop, pestName, symptoms, riskLevel, prevention, recommendation, isActive } = req.body;
    if (crop) alert.crop = crop;
    if (pestName) alert.pestName = pestName;
    if (symptoms) alert.symptoms = symptoms;
    if (riskLevel) alert.riskLevel = riskLevel;
    if (prevention) alert.prevention = prevention;
    if (recommendation) alert.recommendation = recommendation;
    if (isActive !== undefined) alert.isActive = isActive;

    const updated = await alert.save();
    res.json({ success: true, message: 'Pest alert updated', alert: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete pest alert (Admin only)
// @route   DELETE /api/pests/:id
// @access  Private/Admin
const deletePestAlert = async (req, res) => {
  try {
    const alert = await PestAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Pest alert not found' });
    }
    await alert.deleteOne();
    res.json({ success: true, message: 'Pest alert removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPestAlerts,
  createPestAlert,
  updatePestAlert,
  deletePestAlert,
};
