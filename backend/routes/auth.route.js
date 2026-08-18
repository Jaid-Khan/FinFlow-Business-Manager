const express = require("express");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.controller");
const handleValidationErrors = require("../validators/commonValidator");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  registerUser,
);

router.post("/login", loginValidator, handleValidationErrors, loginUser);
router.post("/logout", logoutUser);

module.exports = router;
