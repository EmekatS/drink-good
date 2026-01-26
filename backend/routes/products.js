const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json({ products, totalProducts: products.length });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      description: description || "",
      stock: stock || 0
    });

    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, stock, isActive } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (price) product.price = parseFloat(price);
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

module.exports = router;