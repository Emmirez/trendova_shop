import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminNotificationRoutes from "./routes/adminNotificationRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import lookRoutes from './routes/lookRoutes.js';
import instagramRoutes from "./routes/instagramRoutes.js";

dotenv.config();

const app = express();

//  Security middleware
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      return callback(null, true); 
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight requests
app.options("*", cors());

//  Rate limiting
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
//   message: { message: "Too many requests, please try again later." },
// });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many auth attempts, please try again later." },
});

// app.use(globalLimiter);

//  Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//  Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

//  Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users/addresses", addressRoutes);
app.use("/api/users/wishlist", wishlistRoutes);
app.use('/api/looks', lookRoutes);
app.use("/api/instagram", instagramRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);

//  Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

//  Global error handler
app.use(errorHandler);

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
