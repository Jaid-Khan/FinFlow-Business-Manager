const express = require("express");

const authenticateUser = require("../middlewares/auth.middleware");

const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/business.controller");

const router = express.Router();

router.post("/", authenticateUser, createBusiness);

router.get("/", authenticateUser, getBusinesses);

router.get("/:id", authenticateUser, getBusinessById);

router.patch("/:id", authenticateUser, updateBusiness);

router.delete("/:id", authenticateUser, deleteBusiness);

module.exports = router;