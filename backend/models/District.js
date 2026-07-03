const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('District', districtSchema);
