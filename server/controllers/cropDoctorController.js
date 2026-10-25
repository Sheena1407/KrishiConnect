const { diagnoseCrop, CROP_DISEASES_DB } = require('../services/cropDoctorService');

// @desc    Diagnose crop symptoms
// @route   POST /api/crop-doctor/diagnose
// @access  Public / Private
const diagnose = async (req, res) => {
  try {
    const { crop, symptom } = req.body;
    if (!symptom) {
      return res.status(400).json({
        success: false,
        message: 'Please select a crop symptom to diagnose',
      });
    }

    const diagnosis = diagnoseCrop(crop, symptom);
    res.json({
      success: true,
      diagnosis,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all supported diseases and symptoms
// @route   GET /api/crop-doctor/list
// @access  Public / Private
const getSupportedDiseases = async (req, res) => {
  try {
    res.json({
      success: true,
      count: CROP_DISEASES_DB.length,
      diseases: CROP_DISEASES_DB,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  diagnose,
  getSupportedDiseases,
};
