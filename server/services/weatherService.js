// KrishiConnect Weather Intelligence Service

const INDIAN_CITIES = {
  bhopal: { lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh' },
  indore: { lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh' },
  ujjain: { lat: 23.1765, lon: 75.7885, state: 'Madhya Pradesh' },
  dewas: { lat: 22.9676, lon: 76.0534, state: 'Madhya Pradesh' },
  jaipur: { lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  rajkot: { lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
  nagpur: { lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  pune: { lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  ludhiana: { lat: 30.9010, lon: 75.8573, state: 'Punjab' },
  patna: { lat: 25.5941, lon: 85.1376, state: 'Bihar' },
};

const generateAgriAdvisories = (temp, humidity, rainProb, condition) => {
  const advisories = [];

  if (rainProb > 50) {
    advisories.push({
      type: 'warning',
      text: '🌧️ High rain probability detected. Postpone pesticide spraying and irrigation for 24-48 hours.',
      action: 'Delay Irrigation & Spraying',
    });
  } else if (temp > 34) {
    advisories.push({
      type: 'info',
      text: '☀️ High temperature alert. Schedule irrigation during early morning or late evening to minimize evaporation.',
      action: 'Morning Irrigation Preferred',
    });
  } else {
    advisories.push({
      type: 'success',
      text: '🌱 Optimal weather conditions today. Excellent time for field scouting and weed management.',
      action: 'Field Scouting Recommended',
    });
  }

  if (humidity > 75) {
    advisories.push({
      type: 'alert',
      text: '💧 Elevated humidity levels detected. Inspect crops closely for fungal leaf blight and rust.',
      action: 'Check for Fungal Infection',
    });
  }

  return advisories;
};

const getWeatherForLocation = async (locationQuery = 'Bhopal') => {
  const normalized = locationQuery.trim().toLowerCase().split(',')[0].trim();
  const cityInfo = INDIAN_CITIES[normalized] || {
    lat: 23.2599,
    lon: 77.4126,
    state: 'Madhya Pradesh',
  };

  // Base dynamic weather values
  const dateObj = new Date();
  const baseTemp = 28 + (normalized.length % 5) - 2;
  const humidity = 55 + (normalized.length % 20);
  const windSpeed = 10 + (normalized.length % 8);
  const rainProb = normalized.includes('rain') ? 70 : (normalized.length * 4) % 35;
  const condition = rainProb > 50 ? 'Rain Showers' : rainProb > 25 ? 'Partly Cloudy' : 'Sunny & Clear';

  // 7-day forecast
  const forecast = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (let i = 1; i <= 7; i++) {
    const fDate = new Date();
    fDate.setDate(dateObj.getDate() + i);
    const dayName = days[fDate.getDay()];
    const fRain = Math.min(85, Math.max(5, (rainProb + (i * 7) % 30)));
    const fTempMax = baseTemp + (i % 3);
    const fTempMin = fTempMax - 9;
    forecast.push({
      day: dayName,
      date: fDate.toISOString().split('T')[0],
      maxTemp: fTempMax,
      minTemp: fTempMin,
      condition: fRain > 50 ? 'Scattered Rain' : fRain > 25 ? 'Partly Cloudy' : 'Sunny',
      rainProbability: fRain,
      humidity: humidity + (i % 5),
      windSpeed: windSpeed + (i % 4),
    });
  }

  const advisories = generateAgriAdvisories(baseTemp, humidity, rainProb, condition);

  return {
    location: locationQuery.charAt(0).toUpperCase() + locationQuery.slice(1),
    state: cityInfo.state,
    current: {
      temperature: baseTemp,
      feelsLike: baseTemp + 2,
      humidity,
      windSpeed,
      rainProbability: rainProb,
      condition,
      sunrise: '06:14 AM',
      sunset: '06:05 PM',
      uvIndex: 7,
      airQuality: 'Moderate (AQI 84)',
    },
    advisories,
    forecast,
    source: 'KrishiConnect Smart Agro-Met Engine',
    lastUpdated: new Date().toISOString(),
  };
};

module.exports = {
  getWeatherForLocation,
};
