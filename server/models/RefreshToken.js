const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  revoked: {
    type: Boolean,
    default: false
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for efficient lookup
refreshTokenSchema.index({ user: 1, revoked: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);