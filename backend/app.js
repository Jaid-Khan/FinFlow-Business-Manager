const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

// Security Middleware
app.use(helmet());

app.use(
  cors({
    origin: "https://finflowbusiness.netlify.app",
    credentials: true,
  })
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

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

module.exports = app;