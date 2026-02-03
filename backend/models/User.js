const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,    
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true   
  },
  walletPrivateKey: {
    type: String,
    required: true
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// REMOVE these lines if they exist:
// userSchema.index({ username: 1 });
// userSchema.index({ walletAddress: 1 });

module.exports = mongoose.model('User', userSchema);