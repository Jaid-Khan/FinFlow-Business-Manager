const mongoose = require("mongoose");
const Sheet = require("../models/Sheet");

const getSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find({
      userId: req.user.userId,
      businessId: req.business._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      sheets,
    });
  } catch (error) {
    console.error("Get sheets error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createSheet = async (req, res) => {
  try {
    const { name, columns, rows } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sheet name is required",
      });
    }

    const sheet = await Sheet.create({
      userId: req.user.userId,
      businessId: req.business._id,
      name: name.trim(),
      columns: Array.isArray(columns) ? columns : [],
      rows: Array.isArray(rows) ? rows : [],
    });

    return res.status(201).json({
      success: true,
      message: "Sheet created successfully",
      sheet,
    });
  } catch (error) {
    console.error("Create sheet error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSheetById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sheet ID",
      });
    }

    const sheet = await Sheet.findOne({
      _id: id,
      userId: req.user.userId,
      businessId: req.business._id,
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    return res.status(200).json({
      success: true,
      sheet,
    });
  } catch (error) {
    console.error("Get sheet error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, columns, rows } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sheet ID",
      });
    }

    const sheet = await Sheet.findOne({
      _id: id,
      userId: req.user.userId,
      businessId: req.business._id,
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Sheet name cannot be empty",
        });
      }

      sheet.name = name.trim();
    }

    if (columns !== undefined) {
      if (!Array.isArray(columns)) {
        return res.status(400).json({
          success: false,
          message: "Columns must be an array",
        });
      }

      sheet.columns = columns;
    }

    if (rows !== undefined) {
      if (!Array.isArray(rows)) {
        return res.status(400).json({
          success: false,
          message: "Rows must be an array",
        });
      }

      sheet.rows = rows;
    }

    await sheet.save();

    return res.status(200).json({
      success: true,
      message: "Sheet updated successfully",
      sheet,
    });
  } catch (error) {
    console.error("Update sheet error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteSheet = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sheet ID",
      });
    }

    const sheet = await Sheet.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
      businessId: req.business._id,
    });

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Sheet not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sheet deleted successfully",
    });
  } catch (error) {
    console.error("Delete sheet error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getSheets,
  createSheet,
  getSheetById,
  updateSheet,
  deleteSheet,
};