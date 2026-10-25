const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    pH: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    nitrogen: {
      type: Number,
      required: true, // kg/ha
      min: 0,
    },
    phosphorus: {
      type: Number,
      required: true, // kg/ha
      min: 0,
    },
    potassium: {
      type: Number,
      required: true, // kg/ha
      min: 0,
    },
    moisture: {
      type: Number,
      required: true, // %
      min: 0,
      max: 100,
    },
    organicCarbon: {
      type: Number,
      required: true, // %
      min: 0,
    },
    healthScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoilReport', soilReportSchema);
