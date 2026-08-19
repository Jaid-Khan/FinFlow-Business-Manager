const express = require("express");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
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
router.post("/refresh-token", refreshAccessToken);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  handleValidationErrors,
  forgotPassword,
);

router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  handleValidationErrors,
  resetPassword,
);

module.exports = router;
