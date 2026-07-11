const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state: {
    type: String,
    default: 'Tamil Nadu'
  },
  headquarters: {
    type: String,
    required: false
  },
  area: {
    type: Number,
    required: false // in square kilometers - will be fetched from API
  },
  population: {
    type: Number,
    required: false // will be fetched from API
  },
  density: {
    type: Number,
    required: false // per square kilometer - will be fetched from API
  },
  totalBusinesses: {
    type: Number,
    default: 0
  },
  urbanizationRate: {
    type: Number,
    required: false
  },
  averageIncome: {
    type: Number,
    required: false
  },
  literacyRate: {
    type: Number,
    required: false
  },
  coordinates: {
    lat: {
      type: Number,
      required: false // will be fetched from API
    },
    lng: {
      type: Number,
      required: false // will be fetched from API
    }
  },
}, { timestamps: true });

module.exports = mongoose.model('District', districtSchema);
