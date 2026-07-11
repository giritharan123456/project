const mongoose = require('mongoose');

const businessCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  demand: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  supply: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  gap: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  description: {
    type: String
  },
  icon: {
    type: String
  },
  minInvestment: { type: Number, default: 500000 },
  maxInvestment: { type: Number, default: 5000000 },
  typicalMargin: { type: Number },
  growthRate: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('BusinessCategory', businessCategorySchema);
