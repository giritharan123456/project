const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  population: {
    type: Number,
    required: true
  },
  populationGrowth: {
    type: Number,
    default: 0 // percentage
  },
  incomeLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  urbanDevelopment: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  searchTrends: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  competitors: {
    type: Map,
    of: Number,
    default: {} // business category -> count
  },
  demandScores: {
    type: Map,
    of: Number,
    default: {} // business category -> score
  },
  marketGapScores: {
    type: Map,
    of: Number,
    default: {} // business category -> score
  },
  feasibilityScore: { type: Number, default: 0, min: 0, max: 100 },
  opportunityScore: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Area', areaSchema);
