const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
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
    cropName: {
      type: String,
      required: [true, 'Please provide crop name'],
      trim: true,
    },
    variety: {
      type: String,
      default: 'Standard Hybrid',
      trim: true,
    },
    area: {
      type: Number,
      required: [true, 'Please provide area under cultivation (acres)'],
      min: 0.1,
    },
    sowingDate: {
      type: Date,
      required: [true, 'Please provide sowing date'],
    },
    expectedHarvestDate: {
      type: Date,
      required: [true, 'Please provide expected harvest date'],
    },
    growthStage: {
      type: String,
      enum: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest Ready'],
      default: 'Vegetative',
    },
    health: {
      type: String,
      enum: ['Healthy', 'Moderate', 'Needs Attention', 'Diseased'],
      default: 'Healthy',
    },
    irrigationStatus: {
      type: String,
      enum: ['Adequate', 'Due Soon', 'Overdue', 'Not Needed'],
      default: 'Adequate',
    },
    fertilizerUsed: {
      type: String,
      default: 'Vermicompost & DAP',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
