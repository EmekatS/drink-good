const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/checkout", (req, res) => {
  const { username } = req.body;
  const carts = db.carts.getAll();
  const cart = carts[username];

  if (!cart || cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const total = cart.reduce((sum, p) => sum + p.price, 0);

  carts[username] = [];
  db.carts.saveAll(carts);

  res.json({ message: "Order successful", total, cart });
});

module.exports = router;
