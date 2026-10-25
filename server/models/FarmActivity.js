const mongoose = require('mongoose');

const farmActivitySchema = new mongoose.Schema(
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
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    activityType: {
      type: String,
      enum: ['Irrigation', 'Fertilizer', 'Pest inspection', 'Sowing', 'Harvesting', 'Soil testing', 'General'],
      default: 'General',
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    time: {
      type: String,
      default: '07:00 AM',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Overdue'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmActivity', farmActivitySchema);
