const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

// Security: Helmet sets sensible HTTP headers
app.use(helmet());

// Rate limiting: basic global rate limiter to reduce brute-force and scraping
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

// CORS: tighten to allowed origins (set via ALLOWED_ORIGINS env var, comma separated)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser or server-to-server requests with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
