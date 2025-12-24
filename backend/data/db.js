const fs = require("fs");
const path = require("path");

// File paths
const usersFile = path.join(__dirname, "users.json");
const productsFile = path.join(__dirname, "products.json");
const cartsFile = path.join(__dirname, "carts.json");

// Helper to read JSON file
function readFile(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]"); 
  const data = fs.readFileSync(file, "utf-8");
  return JSON.parse(data);
}

// Helper to write JSON file
function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Users
const users = {
  getAll: () => readFile(usersFile),
  saveAll: (data) => writeFile(usersFile, data),
};

// Products
const products = {
  getAll: () => readFile(productsFile),
  saveAll: (data) => writeFile(productsFile, data),
};

// Carts
const carts = {
  getAll: () => readFile(cartsFile),
  saveAll: (data) => writeFile(cartsFile, data),
};

module.exports = { users, products, carts };
