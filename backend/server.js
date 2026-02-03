require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { getBlockchainService } = require('./services/blockchainService');

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Connect to MongoDB
connectDB();

// Initialize blockchain connection
getBlockchainService();

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Beverage E-Commerce API with Blockchain Loyalty Points",
    version: "2.0.0 - MongoDB Edition",
    endpoints: {
      auth: {
        register: "POST /auth/register",
        login: "POST /auth/login",
        profile: "GET /auth/profile/:username"
      },
      products: {
        getAll: "GET /products",
        getOne: "GET /products/:id",
        create: "POST /products",
        update: "PUT /products/:id",
        delete: "DELETE /products/:id"
      },
      cart: {
        view: "GET /cart/:username",
        add: "POST /cart/add",
        update: "PUT /cart/update",
        remove: "POST /cart/remove",
        clear: "DELETE /cart/clear/:username"
      },
      orders: {
        checkout: "POST /orders/checkout",
        getAll: "GET /orders",
        getUserOrders: "GET /orders/user/:username",
        getOne: "GET /orders/:orderId",
        updateStatus: "PUT /orders/:orderId/status"
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Backend server running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
  console.log(` Beverage E-Commerce with Blockchain Loyalty System`);
  console.log(` Database: MongoDB`);
});