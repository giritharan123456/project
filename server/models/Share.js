const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareToken: {
    type: String,
    unique: true,
    required: true
  },
  itemType: {
    type: String,
    enum: ['area', 'business', 'comparison'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemData: {
    name: String,
    pincode: String,
    district: String,
    category: String
  },
  accessCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

shareSchema.index({ user: 1, createdAt: -1 });
shareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Share', shareSchema);
