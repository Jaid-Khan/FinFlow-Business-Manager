const express = require("express");

const authenticateUser = require("../middlewares/auth.middleware");
const {
  getMyProfile,
  updateMyProfile,
  setActiveBusiness,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authenticateUser, getMyProfile);

router.patch("/me", authenticateUser, updateMyProfile);
router.patch(
  "/active-business",
  authenticateUser,
  setActiveBusiness
);

module.exports = router;