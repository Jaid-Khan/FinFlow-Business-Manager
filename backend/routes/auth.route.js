const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");
const handleValidationErrors = require("../validators/commonValidator");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  registerUser
);

router.post(
  "/login",
  loginValidator,
  handleValidationErrors,
  loginUser
);

module.exports = router;