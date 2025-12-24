const express = require("express");
const db = require("../data/db");

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  const users = db.users.getAll();
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password, role: role || "user" });
  db.users.saveAll(users);
  res.json({ message: "User registered" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = db.users.getAll();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

module.exports = router;
