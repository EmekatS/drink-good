const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../data/db");

const router = express.Router();

/**
 * Register
 */
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const users = db.users.getAll();
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword,
    role: role || "user"
  });

  db.users.saveAll(users);
  res.json({ message: "User registered" });
});

/**
 * Login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = db.users.getAll();
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: { username: user.username, role: user.role }
  });
});

module.exports = router;
