const express = require("express");
const db = require("../data/db");

const router = express.Router();

/**
 * Add to cart (with quantity)
 */
router.post("/add", (req, res) => {
  const { username, productId, quantity } = req.body;

  const products = db.products.getAll();
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const carts = db.carts.getAll();
  if (!carts[username]) carts[username] = [];

  const existingItem = carts[username].find(
    item => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[username].push({ productId, quantity });
  }

  db.carts.saveAll(carts);
  res.json({ message: "Item added to cart" });
});

/**
 * Remove item from cart
 */
router.post("/remove", (req, res) => {
  const { username, productId } = req.body;

  const carts = db.carts.getAll();
  if (!carts[username]) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  carts[username] = carts[username].filter(
    item => item.productId !== productId
  );

  db.carts.saveAll(carts);
  res.json({ message: "Item removed from cart" });
});

/**
 * View cart
 */
router.get("/:username", (req, res) => {
  const carts = db.carts.getAll();
  const products = db.products.getAll();

  const cart = carts[req.params.username] || [];

  const detailedCart = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      total: product.price * item.quantity
    };
  });

  res.json(detailedCart);
});

module.exports = router;
