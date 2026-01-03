const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "users.json");
const productsFile = path.join(__dirname, "products.json");
const cartsFile = path.join(__dirname, "carts.json");
const ordersFile = path.join(__dirname, "orders.json");

function readFile(file) {
  if (!fs.existsSync(file)) {
    if (file === cartsFile) {
      fs.writeFileSync(file, "{}");
    } else {
      fs.writeFileSync(file, "[]");
    }
  }
  const data = fs.readFileSync(file, "utf-8");
  return JSON.parse(data);
}

function writeFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const users = {
  getAll: () => readFile(usersFile),
  saveAll: (data) => writeFile(usersFile, data),
};

const products = {
  getAll: () => readFile(productsFile),
  saveAll: (data) => writeFile(productsFile, data),
};


const carts = {
  getAll: () => readFile(cartsFile),
  saveAll: (data) => writeFile(cartsFile, data),
};

const orders = {
  getAll: () => readFile(ordersFile),
  saveAll: (data) => writeFile(ordersFile, data),
};

module.exports = { users, products, carts, orders };