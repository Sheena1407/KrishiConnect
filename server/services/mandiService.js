// KrishiConnect Mandi Price Tracker Service

const MANDI_RECORDS = [
  {
    id: 'm1',
    crop: 'Chickpea (Chana)',
    variety: 'Desi Chana',
    mandi: 'Bhopal Mandi',
    state: 'Madhya Pradesh',
    price: 5300,
    unit: '₹/qtl',
    change: 2.3,
    trend: 'up',
    minPrice: 5100,
    maxPrice: 5450,
    arrivals: '450 Tons',
    lastUpdated: 'Today, 08:30 AM',
  },
  {
    id: 'm2',
    crop: 'Cotton',
    variety: 'Medium Staple',
    mandi: 'Rajkot Mandi',
    state: 'Gujarat',
    price: 7320,
    unit: '₹/qtl',
    change: 1.8,
    trend: 'up',
    minPrice: 7000,
    maxPrice: 7500,
    arrivals: '820 Tons',
    lastUpdated: 'Today, 09:15 AM',
  },
  {
    id: 'm3',
    crop: 'Maize',
    variety: 'Yellow Hybrid',
    mandi: 'Dewas Mandi',
    state: 'Madhya Pradesh',
    price: 2080,
    unit: '₹/qtl',
    change: -0.6,
    trend: 'down',
    minPrice: 1980,
    maxPrice: 2150,
    arrivals: '340 Tons',
    lastUpdated: 'Today, 09:45 AM',
  },
  {
    id: 'm4',
    crop: 'Mustard',
    variety: 'Black Sarson',
    mandi: 'Jaipur Mandi',
    state: 'Rajasthan',
    price: 5650,
    unit: '₹/qtl',
    change: 3.1,
    trend: 'up',
    minPrice: 5400,
    maxPrice: 5780,
    arrivals: '600 Tons',
    lastUpdated: 'Today, 10:00 AM',
  },
  {
    id: 'm5',
    crop: 'Wheat',
    variety: 'Sharbati (Sehore)',
    mandi: 'Sehore Mandi',
    state: 'Madhya Pradesh',
    price: 2950,
    unit: '₹/qtl',
    change: 1.2,
    trend: 'up',
    minPrice: 2800,
    maxPrice: 3100,
    arrivals: '950 Tons',
    lastUpdated: 'Today, 09:00 AM',
  },
  {
    id: 'm6',
    crop: 'Soybean',
    variety: 'JS-335 Yellow',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    price: 4820,
    unit: '₹/qtl',
    change: -1.4,
    trend: 'down',
    minPrice: 4650,
    maxPrice: 4950,
    arrivals: '1200 Tons',
    lastUpdated: 'Today, 08:45 AM',
  },
  {
    id: 'm7',
    crop: 'Tomato',
    variety: 'Hybrid Red',
    mandi: 'Ujjain Mandi',
    state: 'Madhya Pradesh',
    price: 1850,
    unit: '₹/qtl',
    change: 4.5,
    trend: 'up',
    minPrice: 1600,
    maxPrice: 2100,
    arrivals: '280 Tons',
    lastUpdated: 'Today, 07:30 AM',
  },
  {
    id: 'm8',
    crop: 'Paddy (Basmati)',
    variety: 'Pusa 1121',
    mandi: 'Karnal Mandi',
    state: 'Haryana',
    price: 3850,
    unit: '₹/qtl',
    change: 0.8,
    trend: 'up',
    minPrice: 3600,
    maxPrice: 4050,
    arrivals: '780 Tons',
    lastUpdated: 'Today, 10:15 AM',
  },
  {
    id: 'm9',
    crop: 'Onion',
    variety: 'Nasik Red',
    mandi: 'Lasalgaon Mandi',
    state: 'Maharashtra',
    price: 2450,
    unit: '₹/qtl',
    change: -2.1,
    trend: 'down',
    minPrice: 2200,
    maxPrice: 2650,
    arrivals: '1400 Tons',
    lastUpdated: 'Today, 08:00 AM',
  },
  {
    id: 'm10',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    mandi: 'Agra Mandi',
    state: 'Uttar Pradesh',
    price: 1420,
    unit: '₹/qtl',
    change: 1.5,
    trend: 'up',
    minPrice: 1300,
    maxPrice: 1550,
    arrivals: '850 Tons',
    lastUpdated: 'Today, 09:30 AM',
  },
  {
    id: 'm11',
    crop: 'Groundnut',
    variety: 'Bold Peanut',
    mandi: 'Gondal Mandi',
    state: 'Gujarat',
    price: 6150,
    unit: '₹/qtl',
    change: 2.7,
    trend: 'up',
    minPrice: 5900,
    maxPrice: 6350,
    arrivals: '520 Tons',
    lastUpdated: 'Today, 10:05 AM',
  },
  {
    id: 'm12',
    crop: 'Turmeric',
    variety: 'Salem Curcumin',
    mandi: 'Nizamabad Mandi',
    state: 'Telangana',
    price: 13800,
    unit: '₹/qtl',
    change: 5.2,
    trend: 'up',
    minPrice: 13000,
    maxPrice: 14500,
    arrivals: '190 Tons',
    lastUpdated: 'Today, 10:30 AM',
  },
];

const getMandiPrices = (query = {}) => {
  let list = [...MANDI_RECORDS];

  if (query.crop && query.crop !== 'all') {
    const c = query.crop.toLowerCase();
    list = list.filter((item) => item.crop.toLowerCase().includes(c));
  }

  if (query.mandi && query.mandi !== 'all') {
    const m = query.mandi.toLowerCase();
    list = list.filter((item) => item.mandi.toLowerCase().includes(m));
  }

  if (query.state && query.state !== 'all') {
    const s = query.state.toLowerCase();
    list = list.filter((item) => item.state.toLowerCase().includes(s));
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.crop.toLowerCase().includes(s) ||
        item.mandi.toLowerCase().includes(s) ||
        item.variety.toLowerCase().includes(s) ||
        item.state.toLowerCase().includes(s)
    );
  }

  if (query.sortBy === 'price_high') {
    list.sort((a, b) => b.price - a.price);
  } else if (query.sortBy === 'price_low') {
    list.sort((a, b) => a.price - b.price);
  } else if (query.sortBy === 'change') {
    list.sort((a, b) => b.change - a.change);
  }

  return list;
};

module.exports = {
  getMandiPrices,
  MANDI_RECORDS,
};
