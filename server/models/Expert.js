const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      enum: [
        'Soil Science',
        'Crop Management',
        'Pest Management',
        'Organic Farming',
        'Irrigation',
        'Horticulture',
      ],
      required: true,
    },
    experience: {
      type: String,
      required: true, // e.g. "12+ Years"
    },
    qualification: {
      type: String,
      default: 'Ph.D. / M.Sc. Agriculture',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    consultationFee: {
      type: Number,
      default: 0, // e.g. Free or ₹200
    },
    availability: {
      type: String,
      default: 'Mon - Sat (10 AM - 5 PM)',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    },
    languages: {
      type: [String],
      default: ['Hindi', 'English'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
