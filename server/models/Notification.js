const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['market', 'business', 'population', 'competition', 'forecast', 'area_loaded', 'admin'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: {
    pincode: { type: String },
    areaName: { type: String },
    districtName: { type: String },
    score: { type: Number }
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false }
});

// Index for quick per-user queries sorted by date
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
