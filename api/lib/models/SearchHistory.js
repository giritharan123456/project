const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  query: { type: String, required: true },
  type: { type: String, enum: ['pincode', 'district', 'category', 'general'], default: 'general' },
  resultCount: { type: Number, default: 0 },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  pincode: { type: String },
  district: { type: String },
  category: { type: String },
}, { timestamps: true });

searchHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
