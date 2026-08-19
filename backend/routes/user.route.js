const express = require("express");

const authenticateUser = require("../middlewares/auth.middleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateUser, getMyProfile);

router.patch("/me", authenticateUser, updateMyProfile);

module.exports = router;