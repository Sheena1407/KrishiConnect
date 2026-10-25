// KrishiConnect Conversational Assistant Service

const KNOWLEDGE_BASE = [
  {
    keywords: ['suitable', 'crop', 'soil', 'which crop', 'grow'],
    response:
      'To select the most profitable and suitable crop:\n1. For Black Cotton Soil: Wheat, Soybean, Cotton, and Chickpea thrive best due to high moisture retention.\n2. For Sandy Loam: Mustard, Potato, Maize, and groundnut perform exceptionally well.\n3. For Alluvial Soil: Paddy, Wheat, Sugarcane, and vegetable crops provide highest yields.\n\nTip: You can use our interactive **Crop Advisor** tool in the menu to get a custom recommendation tailored to your exact soil pH and water availability!',
    suggestions: ['How to check soil pH?', 'What is best season for Wheat?', 'Best fertilizer for Soybean'],
  },
  {
    keywords: ['irrigate', 'water', 'when to water', 'moisture', 'irrigation'],
    response:
      'Effective Irrigation Rules:\n1. **Morning or Late Evening**: Always irrigate before 9:00 AM or after 5:30 PM to reduce evaporative water loss.\n2. **Critical Growth Stages**:\n   - Wheat: Crown Root Initiation (CRI) at 21 days is vital.\n   - Gram/Chickpea: Pre-flowering and pod development.\n   - Soybean: Flowering and pod filling.\n3. Check soil moisture 2 inches below the surface: if soil easily balls together without crumbling, moisture is adequate.\n\nCheck your **Weather tab** before irrigating to avoid wasting water before expected rainfall.',
    suggestions: ['Does drip irrigation save money?', 'Rain forecast for today', 'Mulching techniques'],
  },
  {
    keywords: ['yellow', 'leaves', 'leaf yellow', 'peela', 'spots'],
    response:
      'Yellowing leaves usually point to one of these common issues:\n1. **Nitrogen Deficiency**: Older, lower leaves turn uniformly pale yellow from the tip backwards. Remedy: Apply quick-acting Urea or vermicompost tea.\n2. **Iron/Zinc Chlorosis**: Young top leaves turn yellow while leaf veins stay dark green. Remedy: Foliar spray of Chelated Zinc + Ferrous Sulphate (0.5%).\n3. **Overwatering or Waterlogging**: Roots suffocate and cannot absorb nutrients. Allow the soil surface to dry before next irrigation.\n4. **Viral Disease (Mosaic)**: Mottled yellow-green patches. Control whiteflies with Neem oil or Acetamiprid.\n\nVisit our **Crop Doctor** section to diagnose specific crop symptoms!',
    suggestions: ['How to make Neem spray?', 'Organic fertilizers', 'How to test soil'],
  },
  {
    keywords: ['soil health', 'improve soil', 'organic carbon', 'fertility', 'ph'],
    response:
      'To systematically build healthy, fertile soil:\n1. **Add Organic Matter**: Incorporate 2-3 tonnes of well-rotted Farm Yard Manure (FYM) or 1 tonne of vermicompost per acre annually.\n2. **Green Manuring**: Grow Dhaincha (Sesbania) or Sunn hemp for 45 days and plough it into the soil before the main crop.\n3. **Soil pH Correction**:\n   - If acidic (pH < 6.0): Add agricultural lime.\n   - If alkaline (pH > 8.0): Add agricultural gypsum.\n4. **Crop Rotation**: Never plant identical crop families back-to-back. Rotate cereals with nitrogen-fixing pulses.\n\nGenerate your instant **Soil Health Score** in our Soil Health module!',
    suggestions: ['How to calculate Soil Score?', 'Green manure crops', 'Vermicompost benefits'],
  },
  {
    keywords: ['rain', 'heavy rain', 'storm', 'monsoon', 'barish'],
    response:
      'Precautionary Checklist Before Heavy Rain:\n1. **Clear Drainage Channels**: Clear silt and weeds from field bunds and outlets so standing water drains out within 24 hours.\n2. **Stop Fertilizing & Spraying**: Hold all pesticide sprays and urea top-dressing — heavy rain washes chemicals into water bodies.\n3. **Support & Trellis**: Stake vulnerable crops like tomatoes, bananas, or papaya to prevent wind lodging.\n4. **Elevate Harvested Produce**: Move any harvested grains or produce under elevated waterproof tarpaulins immediately.',
    suggestions: ['Check live weather forecast', 'Post-rain fungal prevention', 'Crop insurance claim'],
  },
  {
    keywords: ['fertilizer', 'urea', 'dap', 'npk', 'potash', 'khad'],
    response:
      'Balanced Fertilizer Guidelines (The 4R Principle: Right Source, Right Rate, Right Time, Right Place):\n1. **Basal Dose**: Apply complete Phosphorus (DAP/SSP) and Potash (MOP) at sowing time in the root zone.\n2. **Split Nitrogen**: Never apply all Nitrogen at once. Split Urea into 2-3 equal doses at tillering and grand growth.\n3. **Bio-fertilizers**: Inoculate seeds with Rhizobium (for pulses) or Azotobacter (for cereals) + PSB (Phosphate Solubilizing Bacteria) to boost nutrient uptake by 25%.\n4. **Zinc & Sulphur**: Indian soils are widely deficient in Zinc and Sulphur. Apply Zinc Sulphate 21% @ 10 kg/acre every 2 years.',
    suggestions: ['Organic manure alternatives', 'Buy fertilizers in Krishi Market', 'Soil test cost'],
  },
  {
    keywords: ['scheme', 'government', 'subsidy', 'kisan', 'pm kisan'],
    response:
      'Key Government Agricultural Schemes for Farmers:\n1. **PM-KISAN**: ₹6,000/year direct income support provided in 3 equal installments of ₹2,000 directly to bank accounts.\n2. **PMFBY (Crop Insurance)**: Low premium (1.5% - 2%) crop insurance against non-preventable natural risks, drought, and floods.\n3. **Kisan Credit Card (KCC)**: Low interest working capital loans at 4% effective interest with prompt repayment.\n4. **Sub-Mission on Agricultural Mechanization (SMAM)**: 40-50% subsidy on modern farm equipment, rotavators, and laser land levelers.\n5. **Soil Health Card Scheme**: Free government soil nutrient assessment every 2 years through local Krishi Vigyan Kendras (KVK).',
    suggestions: ['How to apply for KCC?', 'Crop insurance timeline', 'Talk to Krishi Expert'],
  },
];

const answerFarmerQuery = (query = '') => {
  const cleanQuery = query.toLowerCase().trim();

  if (!cleanQuery) {
    return {
      reply: 'Namaste Farmer! How can I assist you with your crops, soil, weather, or market today?',
      suggestions: ['Which crop is suitable for my soil?', 'When should I irrigate?', 'How to improve soil health?'],
    };
  }

  // Find best matching item
  let bestMatch = null;
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (cleanQuery.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 2) {
    return {
      reply: bestMatch.response,
      suggestions: bestMatch.suggestions,
    };
  }

  // General helpful fallback response
  return {
    reply: `Namaste! Regarding "${query}": For best farm results, ensure balanced nutrition (NPK + organic compost), monitor soil moisture before irrigating, and check daily weather. You can also consult our verified Agricultural Scientists under the **Ask an Expert** tab or run your crop symptoms through the **Crop Doctor**!`,
    suggestions: [
      'Which crop is suitable for my soil?',
      'When should I irrigate?',
      'How do I improve soil health?',
      'What should I do if leaves turn yellow?',
    ],
  };
};

module.exports = {
  answerFarmerQuery,
  KNOWLEDGE_BASE,
};
