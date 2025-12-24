const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/add", (req, res) => {
  const { username, productId } = req.body;
  const products = db.products.getAll();
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const carts = db.carts.getAll();
  if (!carts[username]) carts[username] = [];
  carts[username].push(product);
  db.carts.saveAll(carts);

  res.json({ message: "Added to cart", cart: carts[username] });
});

router.get("/:username", (req, res) => {
  const carts = db.carts.getAll();
  res.json(carts[req.params.username] || []);
});

module.exports = router;
