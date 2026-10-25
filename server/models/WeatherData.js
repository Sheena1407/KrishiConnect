const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    windSpeed: {
      type: Number,
      required: true,
    },
    rainProbability: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      default: 'Partly Cloudy',
    },
    forecastDate: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: 'Krishi-Weather Engine',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WeatherData', weatherDataSchema);
