const express = require("express");

const authenticateUser = require("../middlewares/auth.middleware");
const requireActiveBusiness = require("../middlewares/business.middleware");

const {
  getSheets,
  createSheet,
  getSheetById,
  updateSheet,
  deleteSheet,
} = require("../controllers/sheet.controller");

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  requireActiveBusiness,
  getSheets
);

router.post(
  "/",
  authenticateUser,
  requireActiveBusiness,
  createSheet
);

router.get(
  "/:id",
  authenticateUser,
  requireActiveBusiness,
  getSheetById
);

router.patch(
  "/:id",
  authenticateUser,
  requireActiveBusiness,
  updateSheet
);

router.delete(
  "/:id",
  authenticateUser,
  requireActiveBusiness,
  deleteSheet
);

module.exports = router;