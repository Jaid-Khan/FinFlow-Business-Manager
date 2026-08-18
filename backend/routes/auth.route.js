const express = require("express");
const { registerUser } = require("../controllers/auth.controller");
const {
  registerValidator,
} = require("../validators/auth.validator");
const handleValidationErrors = require("../validators/commonValidator");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  registerUser
);

module.exports = router;