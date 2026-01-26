const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    if (!username || !productId || !quantity) {
      return res.status(400).json({ message: "Username, productId, and quantity required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ username });
    if (!cart) {
      cart = new Cart({ username, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const cart = await Cart.findOne({ username });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
});

router.post("/remove", async (req, res) => {
  try {
    const { username, productId } = req.body;

    const cart = await Cart.findOne({ username });
    if (!cart) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
});

router.delete("/clear/:username", async (req, res) => {
  try {
    const cart = await Cart.findOne({ username: req.params.username });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const cart = await Cart.findOne({ username: req.params.username })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.json({ items: [], total: 0, itemCount: 0 });
    }

    const detailedCart = cart.items.map(item => {
      const product = item.productId;
      return {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const total = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({ items: detailedCart, total, itemCount: cart.items.length });
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
});

module.exports = router;