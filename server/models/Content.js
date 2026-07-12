const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    enum: ['landing', 'about', 'features', 'analysis', 'home']
  },
  title: String,
  subtitle: String,
  description: String,
  problem: String,
  solution: String,
  formula: String,
  algorithm: String,
  factors: [{
    name: String,
    description: String,
    weight: String
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  benefits: [{
    title: String,
    desc: String
  }],
  reviews: [{
    name: String,
    role: String,
    rating: Number,
    text: String
  }],
  howItWorks: [{
    step: Number,
    title: String,
    desc: String
  }],
  stats: {
    entrepreneurs: String,
    districts: String,
    pincodes: String,
    accuracy: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
