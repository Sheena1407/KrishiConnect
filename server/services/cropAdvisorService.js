// KrishiConnect Rule-Based Crop Advisor Service

const CROP_CATALOG = [
  {
    name: 'Wheat',
    varietyOptions: ['Sharbati', 'DBW-187', 'GW-322', 'Lok-1'],
    seasons: ['Rabi', 'Winter'],
    soilPreferences: ['Black Soil', 'Alluvial Soil', 'Clay Soil'],
    phRange: [6.0, 7.5],
    waterRequirement: 'Moderate', // 4-5 irrigations
    durationDays: '110 - 125 Days',
    suitabilityBase: 92,
    expectedYieldPerAcre: '18 - 24 Quintals',
    basicCare: 'Apply CRI irrigation at 21 days after sowing. Top-dress with Urea at tillering and jointing stages.',
    profitPotential: 'High (Stable MSP support)',
    marketDemand: 'Very High',
    description: 'Premier cereal crop for Rabi season with robust government procurement and stable pricing.',
  },
  {
    name: 'Soybean',
    varietyOptions: ['JS-335', 'JS-9560', 'NRC-86', 'RVS-2001-4'],
    seasons: ['Kharif', 'Monsoon'],
    soilPreferences: ['Black Soil', 'Clay Soil', 'Alluvial Soil'],
    phRange: [6.2, 7.8],
    waterRequirement: 'Moderate (Rainfed/Drip)',
    durationDays: '85 - 100 Days',
    suitabilityBase: 90,
    expectedYieldPerAcre: '10 - 15 Quintals',
    basicCare: 'Seed inoculate with Rhizobium culture before sowing. Maintain weed-free condition during first 45 days.',
    profitPotential: 'High (High oil & protein content)',
    marketDemand: 'High',
    description: 'Gold standard pulse-oilseed crop for black cotton soils in central and western India.',
  },
  {
    name: 'Chickpea (Chana)',
    varietyOptions: ['Desi JG-11', 'JAKI-9218', 'Kabuli Dollar', 'Ujjawal'],
    seasons: ['Rabi', 'Winter'],
    soilPreferences: ['Black Soil', 'Alluvial Soil', 'Sandy Loam'],
    phRange: [6.0, 8.0],
    waterRequirement: 'Low', // 1-2 irrigations
    durationDays: '95 - 110 Days',
    suitabilityBase: 88,
    expectedYieldPerAcre: '8 - 12 Quintals',
    basicCare: 'Avoid excessive vegetative watering. Nip apical buds at 30 days to induce maximum branching and pods.',
    profitPotential: 'Very High (High market rates)',
    marketDemand: 'Very High',
    description: 'High-margin legume with low water footprint, replenishes atmospheric nitrogen in soil.',
  },
  {
    name: 'Cotton',
    varietyOptions: ['Bt Hybrid', 'RCH-659', 'Bhakti', 'Ankur-3028'],
    seasons: ['Kharif', 'Summer'],
    soilPreferences: ['Black Soil', 'Deep Alluvial Soil'],
    phRange: [6.5, 8.0],
    waterRequirement: 'High',
    durationDays: '150 - 170 Days',
    suitabilityBase: 85,
    expectedYieldPerAcre: '12 - 18 Quintals',
    basicCare: 'Practice drip fertigation. Regularly scout for bollworms using pheromone traps.',
    profitPotential: 'Exceptional (White Gold cash crop)',
    marketDemand: 'Very High',
    description: 'Major commercial textile crop suited for warm climates with deep, moisture-retentive soils.',
  },
  {
    name: 'Mustard',
    varietyOptions: ['Pusa Bold', 'Giriraj', 'Varuna', 'RH-749'],
    seasons: ['Rabi', 'Winter'],
    soilPreferences: ['Alluvial Soil', 'Sandy Loam', 'Red Soil'],
    phRange: [6.0, 7.8],
    waterRequirement: 'Low to Moderate',
    durationDays: '105 - 120 Days',
    suitabilityBase: 87,
    expectedYieldPerAcre: '8 - 11 Quintals',
    basicCare: 'Ensure sulphur application (20 kg/acre) at sowing for optimal oil content. Watch for aphids in Jan.',
    profitPotential: 'High (Consistent oil market demand)',
    marketDemand: 'High',
    description: 'Hardy oilseed crop ideal for semi-arid tracts with low water requirements.',
  },
  {
    name: 'Tomato',
    varietyOptions: ['Abhinav', 'Arka Rakshak', 'Himsona', 'Pusa Ruby'],
    seasons: ['Kharif', 'Rabi', 'Zaid'],
    soilPreferences: ['Sandy Loam', 'Red Soil', 'Alluvial Soil'],
    phRange: [6.0, 7.0],
    waterRequirement: 'Moderate (Continuous drip)',
    durationDays: '120 - 140 Days',
    suitabilityBase: 82,
    expectedYieldPerAcre: '180 - 250 Quintals',
    basicCare: 'Stake plants with bamboo trellis. Prune bottom suckers and feed with calcium nitrate during fruiting.',
    profitPotential: 'High (Frequent cash flow)',
    marketDemand: 'Daily Consumable',
    description: 'High-value horticulture crop offering regular weekly harvest returns when well-managed.',
  },
  {
    name: 'Maize (Corn)',
    varietyOptions: ['Pioneer 3396', 'DeKalb 9108', 'Kaveri 50', 'Ganga-11'],
    seasons: ['Kharif', 'Zaid', 'Rabi'],
    soilPreferences: ['Alluvial Soil', 'Red Soil', 'Sandy Loam', 'Black Soil'],
    phRange: [5.8, 7.5],
    waterRequirement: 'Moderate',
    durationDays: '90 - 110 Days',
    suitabilityBase: 86,
    expectedYieldPerAcre: '25 - 35 Quintals',
    basicCare: 'Maintain good drainage. Provide split nitrogen at knee-high and tasseling stages.',
    profitPotential: 'Moderate to High (Poultry & industrial demand)',
    marketDemand: 'High',
    description: 'Fast-growing versatile cereal suitable for grain, silage, and industrial starch.',
  },
];

const adviseCrops = ({
  location = 'Bhopal',
  soilType = 'Black Soil',
  soilPH = 7.0,
  season = 'Rabi',
  waterAvailability = 'Moderate',
  farmSize = 5,
}) => {
  const ph = parseFloat(soilPH) || 7.0;

  const scoredCrops = CROP_CATALOG.map((crop) => {
    let score = crop.suitabilityBase;

    // Season match
    if (crop.seasons.includes(season)) {
      score += 5;
    } else {
      score -= 20;
    }

    // Soil match
    if (crop.soilPreferences.includes(soilType)) {
      score += 4;
    } else {
      score -= 8;
    }

    // pH match
    if (ph >= crop.phRange[0] && ph <= crop.phRange[1]) {
      score += 4;
    } else {
      const diff = Math.min(Math.abs(ph - crop.phRange[0]), Math.abs(ph - crop.phRange[1]));
      score -= Math.round(diff * 8);
    }

    // Water availability match
    if (waterAvailability === 'Low' && crop.waterRequirement === 'High') {
      score -= 18;
    } else if (waterAvailability === 'High' && crop.waterRequirement === 'High') {
      score += 4;
    } else if (waterAvailability === 'Low' && crop.waterRequirement.includes('Low')) {
      score += 6;
    }

    // Keep score bounded
    const finalScore = Math.min(98, Math.max(45, score));

    return {
      ...crop,
      suitabilityScore: finalScore,
      suitabilityRating:
        finalScore >= 88 ? 'Highly Recommended' : finalScore >= 75 ? 'Recommended' : 'Moderate Suitability',
    };
  });

  // Sort descending by suitability score
  scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    queryParameters: {
      location,
      soilType,
      soilPH: ph,
      season,
      waterAvailability,
      farmSize: parseFloat(farmSize) || 5,
    },
    topRecommendations: scoredCrops.slice(0, 4),
    allEvaluations: scoredCrops,
  };
};

module.exports = {
  adviseCrops,
  CROP_CATALOG,
};
