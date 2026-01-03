const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const db = require("../data/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const users = db.users.getAll();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const wallet = ethers.Wallet.createRandom();

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      role: role || "user",
      walletAddress: wallet.address,
      walletPrivateKey: wallet.privateKey, 
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    db.users.saveAll(users);

    res.json({
      message: "User registered successfully",
      username: newUser.username,
      walletAddress: newUser.walletAddress
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const users = db.users.getAll();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        role: user.role,
        walletAddress: user.walletAddress,
        loyaltyPoints: user.loyaltyPoints || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.get("/profile/:username", (req, res) => {
  try {
    const users = db.users.getAll();
    const user = users.find(u => u.username === req.params.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      role: user.role,
      walletAddress: user.walletAddress,
      loyaltyPoints: user.loyaltyPoints || 0,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

module.exports = router;