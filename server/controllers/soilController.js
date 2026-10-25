const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');

// Helper to calculate score and tailored recommendations
const evaluateSoil = (pH, nitrogen, phosphorus, potassium, moisture, organicCarbon) => {
  let score = 0;
  const recommendations = [];

  // 1. pH evaluation (Optimal 6.5 - 7.5)
  if (pH >= 6.5 && pH <= 7.5) {
    score += 20;
  } else if (pH >= 6.0 && pH < 6.5) {
    score += 15;
    recommendations.push('Soil pH is slightly acidic (6.0 - 6.5). Consider a light application of agricultural lime (200 kg/acre).');
  } else if (pH < 6.0) {
    score += 8;
    recommendations.push('Soil is strongly acidic (pH < 6.0). Add agricultural lime or dolomite to raise pH and prevent aluminium toxicity.');
  } else if (pH > 7.5 && pH <= 8.2) {
    score += 14;
    recommendations.push('Soil is mildly alkaline. Apply organic compost and elemental sulphur (15-20 kg/acre) to optimize nutrient uptake.');
  } else {
    score += 6;
    recommendations.push('High soil alkalinity (pH > 8.2). Incorporate agricultural gypsum and farmyard manure to correct sodicity.');
  }

  // 2. Nitrogen (Optimal 280 - 450 kg/ha)
  if (nitrogen >= 280 && nitrogen <= 450) {
    score += 18;
  } else if (nitrogen < 280) {
    score += 10;
    recommendations.push('Available Nitrogen is low (<280 kg/ha). Apply split-dose Urea or intercrop with nitrogen-fixing leguminous pulses.');
  } else {
    score += 14;
    recommendations.push('Nitrogen is abundant. Avoid excess urea application to prevent crop lodging and insect vulnerability.');
  }

  // 3. Phosphorus (Optimal 25 - 55 kg/ha)
  if (phosphorus >= 25 && phosphorus <= 55) {
    score += 18;
  } else if (phosphorus < 25) {
    score += 9;
    recommendations.push('Phosphorus is low (<25 kg/ha). Apply Single Super Phosphate (SSP) or DAP directly into the root zone at sowing.');
  } else {
    score += 15;
  }

  // 4. Potassium (Optimal 150 - 300 kg/ha)
  if (potassium >= 150 && potassium <= 300) {
    score += 16;
  } else if (potassium < 150) {
    score += 8;
    recommendations.push('Potassium is deficient (<150 kg/ha). Apply Muriate of Potash (MOP) to enhance pest resistance and fruit firmness.');
  } else {
    score += 14;
  }

  // 5. Moisture (Optimal 30 - 60 %)
  if (moisture >= 35 && moisture <= 65) {
    score += 14;
  } else if (moisture < 35) {
    score += 6;
    recommendations.push('Soil moisture is low (<35%). Schedule immediate drip or sprinkler irrigation to prevent root drought stress.');
  } else {
    score += 8;
    recommendations.push('High soil moisture detected (>65%). Ensure surface drainage to prevent waterlogging and root rot.');
  }

  // 6. Organic Carbon (Optimal > 0.75 %)
  if (organicCarbon >= 0.75) {
    score += 14;
  } else if (organicCarbon >= 0.5) {
    score += 10;
    recommendations.push('Organic carbon is moderate (0.5 - 0.75%). Incorporate 2 tons of well-rotted vermicompost before next crop sowing.');
  } else {
    score += 5;
    recommendations.push('Organic carbon is critically low (<0.5%). Practice green manuring with Sesbania/Dhaincha and avoid residue burning.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Soil parameters are in excellent balance! Maintain current organic management and balanced fertilization.');
  }

  return {
    healthScore: Math.min(100, Math.max(30, score)),
    recommendations,
  };
};

// @desc    Get all soil reports for user
// @route   GET /api/soil
// @access  Private
const getSoilReports = async (req, res) => {
  try {
    const reports = await SoilReport.find({ userId: req.user._id })
      .populate('farmId', 'farmName location area soilType')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new soil test report & calculate health score
// @route   POST /api/soil
// @access  Private
const createSoilReport = async (req, res) => {
  try {
    const { farmId, pH, nitrogen, phosphorus, potassium, moisture, organicCarbon } = req.body;

    if (!farmId || pH === undefined || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Farm, pH, Nitrogen, Phosphorus, and Potassium values are required',
      });
    }

    const farm = await Farm.findOne({ _id: farmId, userId: req.user._id });
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found or does not belong to you' });
    }

    const numPH = parseFloat(pH);
    const numN = parseFloat(nitrogen);
    const numP = parseFloat(phosphorus);
    const numK = parseFloat(potassium);
    const numM = parseFloat(moisture) || 45;
    const numOC = parseFloat(organicCarbon) || 0.65;

    const { healthScore, recommendations } = evaluateSoil(numPH, numN, numP, numK, numM, numOC);

    const report = await SoilReport.create({
      userId: req.user._id,
      farmId,
      pH: numPH,
      nitrogen: numN,
      phosphorus: numP,
      potassium: numK,
      moisture: numM,
      organicCarbon: numOC,
      healthScore,
      recommendations,
    });

    const populated = await SoilReport.findById(report._id).populate('farmId', 'farmName location area soilType');

    res.status(201).json({
      success: true,
      message: 'Soil health report generated and saved successfully!',
      report: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete soil report
// @route   DELETE /api/soil/:id
// @access  Private
const deleteSoilReport = async (req, res) => {
  try {
    const report = await SoilReport.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }
    await report.deleteOne();
    res.json({ success: true, message: 'Soil report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSoilReports,
  createSoilReport,
  deleteSoilReport,
};
