const express = require("express");
const db = require("../data/db");

const router = express.Router();

const LOYALTY_POINTS_RATE = 0.10;

const { getBlockchainService } = require("../services/blockchainService");

router.post("/checkout", async (req, res) => {
  try {
    const { username, usePoints } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    const carts = db.carts.getAll();
    const products = db.products.getAll();
    const users = db.users.getAll();
    const cart = carts[username];

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
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

    const pointsEarned = Math.floor(total * LOYALTY_POINTS_RATE * 100); // Convert to points
    user.loyaltyPoints = (user.loyaltyPoints || 0) + pointsEarned;

    const orders = db.orders.getAll();
    const order = {
      id: orders.length + 1,
      username,
      items: orderItems,
      subtotal: orderItems.reduce((sum, item) => sum + item.subtotal, 0),
      discount,
      pointsUsed,
      pointsEarned,
      total,
      status: "pending",
      walletAddress: user.walletAddress,
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    db.orders.saveAll(orders);

    db.users.saveAll(users);

    carts[username] = [];
    db.carts.saveAll(carts);

    res.json({
      message: "Order placed successfully",
      order: {
        id: order.id,
        total: order.total,
        pointsEarned: order.pointsEarned,
        pointsUsed: order.pointsUsed,
        newPointBalance: user.loyaltyPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }

  const blockchain = getBlockchainService();

if (blockchain && user.walletAddress) {
  const result = await blockchain.awardPoints(
    user.walletAddress,
    pointsEarned,
    order.id
  );
  
  if (result.success) {
    order.blockchainTxHash = result.transactionHash;
    console.log(` Points awarded on blockchain: ${result.transactionHash}`);
  }
}
});

router.get("/user/:username", (req, res) => {
  try {
    const orders = db.orders.getAll();
    const userOrders = orders.filter(o => o.username === req.params.username);

    res.json({
      orders: userOrders,
      totalOrders: userOrders.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.get("/:orderId", (req, res) => {
  try {
    const orders = db.orders.getAll();
    const order = orders.find(o => o.id === parseInt(req.params.orderId));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

router.get("/", (req, res) => {
  try {
    const orders = db.orders.getAll();
    res.json({
      orders,
      totalOrders: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

router.put("/:orderId/status", (req, res) => {
  try {
    const { status } = req.body;
    const orders = db.orders.getAll();
    const order = orders.find(o => o.id === parseInt(req.params.orderId));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    db.orders.saveAll(orders);

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
});

module.exports = router;