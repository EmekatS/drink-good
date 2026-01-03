const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/add", (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    if (!username || !productId || !quantity) {
      return res.status(400).json({ message: "Username, productId, and quantity required" });
    }

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
    res.json({ message: "Item added to cart", cart: carts[username] });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
});

router.put("/update", (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const carts = db.carts.getAll();
    if (!carts[username]) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const item = carts[username].find(item => item.productId === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    db.carts.saveAll(carts);
    res.json({ message: "Cart updated", cart: carts[username] });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
});


router.post("/remove", (req, res) => {
  try {
    const { username, productId } = req.body;

    const carts = db.carts.getAll();
    if (!carts[username]) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    carts[username] = carts[username].filter(
      item => item.productId !== productId
    );

    db.carts.saveAll(carts);
    res.json({ message: "Item removed from cart", cart: carts[username] });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
});

router.delete("/clear/:username", (req, res) => {
  try {
    const { username } = req.params;
    const carts = db.carts.getAll();
    carts[username] = [];
    db.carts.saveAll(carts);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
});

router.get("/:username", (req, res) => {
  try {
    const carts = db.carts.getAll();
    const products = db.products.getAll();

    const cart = carts[req.params.username] || [];

    const detailedCart = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const total = detailedCart.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      items: detailedCart,
      total,
      itemCount: cart.length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
});

module.exports = router;