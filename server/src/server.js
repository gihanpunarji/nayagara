const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");
const cloudinaryServeMiddleware = require("./middleware/cloudinaryServe");
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

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001", 
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

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
app.use("/api", adminReferralRoutes);
app.use("/api/admin", adminRoutes); // Use admin routes

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
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
