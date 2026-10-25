const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmName: {
      type: String,
      required: [true, 'Please provide farm name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide farm location'],
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Please provide farm area in acres'],
      min: [0.1, 'Area must be at least 0.1 acre'],
    },
    soilType: {
      type: String,
      enum: ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Clay Soil', 'Sandy Loam', 'Laterite Soil'],
      default: 'Black Soil',
    },
    irrigationType: {
      type: String,
      enum: ['Drip Irrigation', 'Sprinkler', 'Canal/Flood', 'Tube Well', 'Rainfed'],
      default: 'Drip Irrigation',
    },
    waterSource: {
      type: String,
      enum: ['Borewell', 'Canal', 'River', 'Pond/Lake', 'Rainwater Harvesting'],
      default: 'Borewell',
    },
    farmingMethod: {
      type: String,
      enum: ['Organic Farming', 'Conventional', 'Natural/Zero Budget', 'Hydroponics', 'Precision Farming'],
      default: 'Organic Farming',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);
