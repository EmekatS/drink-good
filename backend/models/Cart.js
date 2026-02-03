const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true    // Keep this (creates index automatically)
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

//  REMOVE this line if it exists:
// cartSchema.index({ username: 1 });

module.exports = mongoose.model('Cart', cartSchema);