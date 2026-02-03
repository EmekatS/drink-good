const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: Number,
  subtotal: Number
});

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  pointsUsed: {
    type: Number,
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  walletAddress: {
    type: String
  },
  blockchainTxHash: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
orderSchema.index({ username: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ blockchainTxHash: 1 });

module.exports = mongoose.model('Order', orderSchema);