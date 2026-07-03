const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() { return !this.googleId; }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['guest', 'user', 'admin'],
    default: 'user'
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  savedComparisons: [{
    name: { type: String },
    areaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
    createdAt: { type: Date, default: Date.now }
  }],
  recentSearches: [{
    type: String
  }],
  favoriteAreas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
