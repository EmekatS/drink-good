const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => res.json(db.products.getAll()));

router.post("/", (req, res) => {
  const { name, price } = req.body;
  const products = db.products.getAll();
  const product = { id: products.length + 1, name, price };
  products.push(product);
  db.products.saveAll(products);
  res.json({ message: "Product added", product });
});

module.exports = router;
