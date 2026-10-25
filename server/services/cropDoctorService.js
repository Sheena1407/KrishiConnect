// KrishiConnect Crop Doctor Expert Diagnosis Engine

const CROP_DISEASES_DB = [
  {
    crop: 'Wheat',
    symptom: 'Yellow leaves',
    problem: 'Nitrogen Deficiency or Yellow Stripe Rust (Puccinia striiformis)',
    symptomsObserved: 'Uniform pale yellowing starting from older lower leaves, or linear yellow stripes running parallel along leaf veins.',
    recommendedAction: 'Apply top dressing of Urea (30 kg/acre) if deficiency. If fungal stripe rust is seen, spray Propiconazole 25% EC @ 1 ml/liter of water.',
    prevention: 'Use rust-resistant varieties (like DBW-187, DBW-222). Ensure balanced N-P-K fertilization at sowing.',
    severity: 'Medium to High',
  },
  {
    crop: 'Wheat',
    symptom: 'Brown spots',
    problem: 'Spot Blotch (Bipolaris sorokiniana)',
    symptomsObserved: 'Small, dark brown elliptic spots on leaves that enlarge and coalesce into irregular necrosis surrounded by yellowish halos.',
    recommendedAction: 'Spray Mancozeb 75% WP @ 2.5 g/liter or Azoxystrobin + Difenoconazole @ 1 ml/liter.',
    prevention: 'Seed treatment with Trichoderma viride @ 5g/kg seed or Carbendazim @ 2g/kg before sowing.',
    severity: 'Medium',
  },
  {
    crop: 'Wheat',
    symptom: 'Wilting',
    problem: 'Foot Rot / Seedling Blight',
    symptomsObserved: 'Seedlings turn dull green, wilt rapidly, and stem base rots near the soil surface.',
    recommendedAction: 'Drench root zone with Carbendazim 50% WP @ 2g/liter of water. Avoid waterlogging.',
    prevention: 'Ensure proper field drainage and avoid excessive deep sowing.',
    severity: 'High',
  },
  {
    crop: 'Soybean',
    symptom: 'Yellow leaves',
    problem: 'Yellow Mosaic Virus (MYMV) transmitted by Whitefly',
    symptomsObserved: 'Bright yellow speckles on young leaves which rapidly spread into bright yellow and green mosaic patches.',
    recommendedAction: 'Spray Thiamethoxam 25% WG @ 0.5g/liter or Acetamiprid 20% SP @ 0.3g/liter to control vector whiteflies.',
    prevention: 'Install yellow sticky traps (15 traps/acre). Grow resistant varieties like JS-20-34 or NRC-86.',
    severity: 'High',
  },
  {
    crop: 'Soybean',
    symptom: 'Leaf holes',
    problem: 'Semilooper / Spodoptera Tobacco Caterpillar Infestation',
    symptomsObserved: 'Large irregular holes eaten through leaves, defoliation leaving only the skeletonized leaf veins.',
    recommendedAction: 'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/liter or Emamectin Benzoate 5% SG @ 0.5 g/liter.',
    prevention: 'Install pheromone traps (5 traps/acre). Hand-pick egg masses during early seedling stage.',
    severity: 'High',
  },
  {
    crop: 'Soybean',
    symptom: 'Wilting',
    problem: 'Rhizoctonia Aerial Blight / Charcoal Rot',
    symptomsObserved: 'Water-soaked brownish lesions on lower stems followed by sudden drying and wilting under dry/hot spells.',
    recommendedAction: 'Foliar spray of Carbendazim + Mancozeb (Sixer/Saaf) @ 2g/liter. Provide light irrigation.',
    prevention: 'Crop rotation with non-legume crops. Enrich soil with organic compost and Trichoderma.',
    severity: 'High',
  },
  {
    crop: 'Cotton',
    symptom: 'Leaf holes',
    problem: 'Pink Bollworm (Pectinophora gossypiella)',
    symptomsObserved: 'Rosetted flowers, bored holes on developing bolls with frass and stained lint.',
    recommendedAction: 'Install pheromone traps with Gossyplure. Spray Profenofos 50% EC @ 2 ml/liter or Spinetoram 11.7% SC @ 1 ml/liter.',
    prevention: 'Destroy crop residues after harvest. Avoid extending cotton season beyond 160-180 days.',
    severity: 'Critical',
  },
  {
    crop: 'Cotton',
    symptom: 'Yellow leaves',
    problem: 'Cotton Leaf Curl Virus / Jassid Infestation',
    symptomsObserved: 'Leaves curling upward or downward, margins turning yellow, thickening of veins.',
    recommendedAction: 'Spray Flonicamid 50% WG @ 0.4 g/liter or Imidacloprid 17.8% SL @ 0.5 ml/liter.',
    prevention: 'Grow CLCuD-resistant hybrids. Eradicate weed hosts from field borders.',
    severity: 'High',
  },
  {
    crop: 'Chickpea (Chana)',
    symptom: 'Wilting',
    problem: 'Fusarium Wilt (Fusarium oxysporum f. sp. ciceris)',
    symptomsObserved: 'Drooping of upper petioles, brownish discoloration of internal vascular tissue when the tap root is split open.',
    recommendedAction: 'No curative fungicide once inside vascular bundle. Drench surrounding healthy plants with Carbendazim @ 1g/L.',
    prevention: 'Plant wilt-resistant varieties (JG-11, JAKI 9218). Seed treat with Trichoderma viride @ 10g/kg.',
    severity: 'High',
  },
  {
    crop: 'Chickpea (Chana)',
    symptom: 'Insect damage',
    problem: 'Gram Pod Borer (Helicoverpa armigera)',
    symptomsObserved: 'Round neat holes drilled into green pods with caterpillar half inserted inside.',
    recommendedAction: 'Spray Chlorantraniliprole 18.5% SC @ 0.3 ml/liter or Indoxacarb 14.5% SC @ 1 ml/liter.',
    prevention: 'Intercrop with coriander or mustard. Erect bird perches (20/acre) for natural predation.',
    severity: 'High',
  },
  {
    crop: 'Tomato',
    symptom: 'Brown spots',
    problem: 'Early Blight (Alternaria solani)',
    symptomsObserved: 'Concentric target-board ring patterns in dark brown spots on lower foliage.',
    recommendedAction: 'Foliar spray of Mancozeb 75% WP @ 2.5 g/liter or Difenoconazole 25% EC @ 1 ml/liter.',
    prevention: 'Avoid overhead watering. Mulch soil surface to prevent soil splash onto lower foliage.',
    severity: 'Medium',
  },
  {
    crop: 'Tomato',
    symptom: 'Yellow leaves',
    problem: 'Tomato Leaf Curl Virus (ToLCV)',
    symptomsObserved: 'Severe curling, puckering of leaves, stunting of the bush, flowers drop prematurely.',
    recommendedAction: 'Spray Acetamiprid 20% SP @ 0.3 g/liter to control whitefly vector.',
    prevention: 'Raise nursery under nylon insect net (40-50 mesh). Plant border barrier crops like maize.',
    severity: 'High',
  },
  {
    crop: 'Mustard',
    symptom: 'Insect damage',
    problem: 'Mustard Aphid (Lipaphis erysimi)',
    symptomsObserved: 'Dense colonies of small greenish insects clustering on flower buds, inflorescence, and young pods.',
    recommendedAction: 'Spray Dimethoate 30% EC @ 1.7 ml/liter or Neem oil (10,000 ppm) @ 3 ml/liter.',
    prevention: 'Sow early before 20th October to escape peak aphid infestation in January-February.',
    severity: 'High',
  },
  {
    crop: 'General',
    symptom: 'Slow growth',
    problem: 'Root Compaction, Zinc/Iron Deficiency or Moisture Stress',
    symptomsObserved: 'Plants appear stunted, root development is poor, internodes are shortened.',
    recommendedAction: 'Foliar spray of chelated micronutrient mixture (Grade-2) @ 2.5 g/liter. Aerate root soil lightly.',
    prevention: 'Incorporate well-decomposed FYM or vermicompost (2 tons/acre) during land preparation.',
    severity: 'Low to Medium',
  },
];

const diagnoseCrop = (cropName = '', symptom = '') => {
  const normCrop = cropName.trim().toLowerCase();
  const normSymptom = symptom.trim().toLowerCase();

  let match = CROP_DISEASES_DB.find(
    (item) =>
      item.crop.toLowerCase() === normCrop &&
      item.symptom.toLowerCase() === normSymptom
  );

  if (!match) {
    match = CROP_DISEASES_DB.find(
      (item) => item.symptom.toLowerCase() === normSymptom
    );
  }

  if (!match) {
    match = CROP_DISEASES_DB.find(
      (item) => item.crop.toLowerCase() === normCrop
    ) || CROP_DISEASES_DB[0];
  }

  return {
    crop: cropName || match.crop,
    symptom: symptom || match.symptom,
    problem: match.problem,
    symptomsObserved: match.symptomsObserved,
    recommendedAction: match.recommendedAction,
    prevention: match.prevention,
    severity: match.severity,
    disclaimer:
      'Information provided is for educational and advisory purposes. Consult a qualified local agricultural scientist or KVK expert for severe crop conditions.',
  };
};

module.exports = {
  diagnoseCrop,
  CROP_DISEASES_DB,
};
