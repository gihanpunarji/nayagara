const express = require("express"); // Restart trigger 2
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");
const cloudinaryServeMiddleware = require("./middleware/cloudinaryServe");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoute");
const orderRoutes = require("./routes/orderRoute");
const walletRoutes = require("./routes/walletRoutes");
const adminReferralRoutes = require("./routes/adminReferralRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Import admin routes
const referralRoutes = require("./routes/referralRoutes"); // Import referral routes
const storeRoutes = require("./routes/storeRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Allowed origins list
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "https://nayagara.lk",
  "https://www.nayagara.lk",
  "https://sellers.nayagara.lk",
  "http://sellers.localhost:5173",
  "http://sellers.localhost:5174",
  "http://sellers.localhost:5175",
];



// Dynamic CORS configuration to fix caching issues
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Optional: Allow all during debugging if needed, but safer to block
        // callback(new Error('Not allowed by CORS'));
        // For production stability given recent issues, lets log and allow? 
        // No, stick to whitelist but reflect it properly.
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

// Force Vary: Origin to prevent Vercel/CDN from serving wrong cached CORS headers
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

// Debug Logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

// Serve images from Cloudinary with fallback to local files
app.use('/uploads', cloudinaryServeMiddleware);
// Serve static files from uploads directory (fallback)
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", walletRoutes);
app.use("/api/admin/referrals", adminReferralRoutes);
app.use("/api/admin", adminRoutes); // Use admin routes
app.use("/api/referral", referralRoutes); // Use referral routes
app.use("/api/store", storeRoutes);
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Schedule cleanup of expired reset tokens every hour
    setInterval(async () => {
      try {
        await User.cleanupExpiredTokens();
      } catch (error) {
        console.error("Failed to cleanup expired tokens:", error);
      }
    }, 60 * 60 * 1000); // Run every hour

    // Run cleanup immediately on startup
    setTimeout(async () => {
      try {
        await User.cleanupExpiredTokens();
      } catch (error) {
        console.error("Failed to cleanup expired tokens on startup:", error);
      }
    }, 5000); // Wait 5 seconds after startup
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

// Export for Vercel serverless
module.exports = app;
