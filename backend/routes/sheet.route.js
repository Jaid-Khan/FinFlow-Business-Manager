const express = require("express");

const authenticateUser = require("../middlewares/auth.middleware");

const {
  getSheets,
  createSheet,
  getSheetById,
  updateSheet,
  deleteSheet,
} = require("../controllers/sheet.controller");

const router = express.Router();

router.get("/", authenticateUser, getSheets);

router.post("/", authenticateUser, createSheet);

router.get("/:id", authenticateUser, getSheetById);

router.patch("/:id", authenticateUser, updateSheet);

router.delete("/:id", authenticateUser, deleteSheet);

module.exports = router;
