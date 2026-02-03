const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { getBlockchainService } = require("../services/blockchainService");

const router = express.Router();
const LOYALTY_POINTS_RATE = 0.10;

router.post("/checkout", async (req, res) => {
  try {
    const { username, usePoints } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ username }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map(item => {
      const product = item.productId;
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    let total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    let pointsUsed = 0;
    let discount = 0;

    if (usePoints && user.loyaltyPoints > 0) {
      discount = Math.min(user.loyaltyPoints * 0.01, total);
      pointsUsed = Math.floor(discount * 100);
      total -= discount;
      user.loyaltyPoints -= pointsUsed;
    }

    const pointsEarned = Math.floor(total * LOYALTY_POINTS_RATE * 100);
    user.loyaltyPoints += pointsEarned;

    const order = new Order({
      username,
      items: orderItems,
      subtotal: orderItems.reduce((sum, item) => sum + item.subtotal, 0),
      discount,
      pointsUsed,
      pointsEarned,
      total,
      status: "pending",
      walletAddress: user.walletAddress
    });

    await order.save();

    const blockchain = getBlockchainService();
    if (blockchain && user.walletAddress) {
      console.log(`🔗 Awarding ${pointsEarned} points on blockchain...`);
      const result = await blockchain.awardPoints(
        user.walletAddress,
        pointsEarned,
        order._id.toString()
      );
      if (result.success) {
        order.blockchainTxHash = result.transactionHash;
        await order.save();
        console.log(`✅ Blockchain TX: ${result.transactionHash}`);
      }
    }

    await user.save();
    cart.items = [];
    await cart.save();

    res.json({
      message: "Order placed successfully",
      order: {
        id: order._id,
        total: order.total,
        pointsEarned: order.pointsEarned,
        pointsUsed: order.pointsUsed,
        newPointBalance: user.loyaltyPoints,
        blockchainTx: order.blockchainTxHash
      }
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
});

router.get("/user/:username", async (req, res) => {
  try {
    const orders = await Order.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json({ orders, totalOrders: orders.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders, totalOrders: orders.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
});

module.exports = router;