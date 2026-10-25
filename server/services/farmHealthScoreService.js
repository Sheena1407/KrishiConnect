// KrishiConnect Unique Farm Health Score Engine

const calculateFarmHealthScore = ({
  soilReports = [],
  crops = [],
  farms = [],
  pestAlerts = [],
  activities = [],
}) => {
  // 1. Soil Health Component (Weight 30%)
  let soilScore = 75;
  if (soilReports.length > 0) {
    const latestSoil = soilReports[0];
    soilScore = latestSoil.healthScore || 75;
  }
  const soilStatus =
    soilScore >= 80 ? 'Good' : soilScore >= 60 ? 'Moderate' : 'Needs Attention';

  // 2. Crop Health Component (Weight 25%)
  let cropScore = 80;
  if (crops.length > 0) {
    let healthyCount = 0;
    crops.forEach((c) => {
      if (c.health === 'Healthy') healthyCount += 1;
      else if (c.health === 'Moderate') healthyCount += 0.7;
      else if (c.health === 'Needs Attention') healthyCount += 0.4;
      else healthyCount += 0.2;
    });
    cropScore = Math.round((healthyCount / crops.length) * 100);
  }
  const cropStatus =
    cropScore >= 80 ? 'Healthy' : cropScore >= 65 ? 'Moderate' : 'Needs Attention';

  // 3. Water Management Component (Weight 20%)
  let waterScore = 78;
  const dripCount = farms.filter((f) => f.irrigationType === 'Drip Irrigation').length;
  if (farms.length > 0) {
    if (dripCount > 0) waterScore = 90;
    else waterScore = 72;
  }
  const waterStatus =
    waterScore >= 85 ? 'Optimized' : waterScore >= 70 ? 'Needs Attention' : 'Suboptimal';

  // 4. Pest Risk Component (Weight 15%)
  let pestScore = 88;
  const highRiskPests = pestAlerts.filter(
    (p) => p.riskLevel === 'High' && p.isActive !== false
  );
  if (highRiskPests.length > 1) {
    pestScore = 65;
  } else if (highRiskPests.length === 1) {
    pestScore = 76;
  }
  const pestStatus =
    pestScore >= 80 ? 'Low' : pestScore >= 68 ? 'Moderate' : 'High Alert';

  // 5. Activity Adherence Component (Weight 10%)
  let activityScore = 80;
  if (activities.length > 0) {
    const completed = activities.filter((a) => a.status === 'Completed').length;
    activityScore = Math.min(100, Math.round((completed / activities.length) * 100) + 15);
  }

  // Calculate Overall Composite Score (0-100)
  const compositeScore = Math.round(
    soilScore * 0.3 +
      cropScore * 0.25 +
      waterScore * 0.2 +
      pestScore * 0.15 +
      activityScore * 0.1
  );

  // Generate 2-3 specific suggestions based on lowest areas
  const suggestions = [];
  if (soilScore < 80) {
    suggestions.push(
      'Apply 2-3 tons of organic compost or vermicompost to elevate organic carbon and soil microbial activity.'
    );
  }
  if (waterScore < 85) {
    suggestions.push(
      'Upgrade from flood to micro-drip irrigation to save up to 45% water and improve root aeration.'
    );
  }
  if (pestScore < 80) {
    suggestions.push(
      'Deploy yellow sticky and pheromone traps across farm borders to control active insect pests early.'
    );
  }
  if (cropScore < 80) {
    suggestions.push(
      'Perform targeted micronutrient foliar feeding (zinc, boron, iron) to boost crop vigor and foliage health.'
    );
  }
  if (suggestions.length < 2) {
    suggestions.push(
      'Maintain continuous mulching in vegetable rows to conserve soil moisture and prevent weed flushes.'
    );
    suggestions.push(
      'Schedule periodic soil testing every 6 months to track nitrogen and phosphorus depletion.'
    );
  }

  return {
    score: Math.min(100, Math.max(25, compositeScore)),
    maxScore: 100,
    metrics: {
      soil: { score: soilScore, label: 'Soil Health', status: soilStatus, color: soilScore >= 75 ? 'success' : 'warning' },
      crops: { score: cropScore, label: 'Crops Health', status: cropStatus, color: cropScore >= 75 ? 'success' : 'warning' },
      water: { score: waterScore, label: 'Water Management', status: waterStatus, color: waterScore >= 80 ? 'success' : 'warning' },
      pest: { score: pestScore, label: 'Pest Risk', status: pestStatus, color: pestScore >= 75 ? 'success' : 'danger' },
    },
    suggestions: suggestions.slice(0, 3),
  };
};

module.exports = {
  calculateFarmHealthScore,
};
