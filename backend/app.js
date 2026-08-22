const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sanitizeInput = require("./middlewares/sanitizeInput");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const sheetRoutes = require("./routes/sheet.route");

const app = express();

// Security Middleware
app.use(helmet());

app.use(
  cors({
    origin: [
      "https://finflowbusiness.netlify.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

// Request Logging
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(sanitizeInput);

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/sheets", sheetRoutes);

module.exports = app;
