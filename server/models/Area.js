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
  literacyRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  },
  ageDistribution: {
    youth: { type: Number, default: 28 },  // 0-25
    working: { type: Number, default: 55 }, // 26-55
    senior: { type: Number, default: 17 }   // 56+
  },
  residentialVsCommercial: {
    residential: { type: Number, default: 70 },
    commercial: { type: Number, default: 20 },
    industrial: { type: Number, default: 10 }
  },
  trafficLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  landmarks: [{
    name: String,
    type: { type: String, enum: ['Temple', 'Hospital', 'School', 'Market', 'Park', 'Station', 'Mall', 'Other'], default: 'Other' }
  }],
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
