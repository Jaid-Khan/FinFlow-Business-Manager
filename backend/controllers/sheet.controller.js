const mongoose = require("mongoose");
const Sheet = require("../models/Sheet");
const { DEFAULT_SHEET_TEMPLATES } = require("../config/sheetTemplates");

// Creates the fixed set of default template sheets for a user the
// first time they have none. Runs lazily from getSheets so the
// auth/register flow never has to know about sheets.

const createEmptyRows = (columns, count = 5) => {
  return Array.from({ length: count }, () => {
    const row = {};

    columns.forEach((column) => {
      row[column] = "";
    });

    return row;
  });
};

const provisionDefaultSheets = async (userId) => {
  const defaultSheets = DEFAULT_SHEET_TEMPLATES.map((template) => ({
    userId,
    name: template.name,
    columns: [...template.columns],
    rows: createEmptyRows(template.columns, 5),
  }));

  await Sheet.insertMany(defaultSheets);
};

const getSheets = async (req, res) => {
  try {
    const existingCount = await Sheet.countDocuments({
      userId: req.user.userId,
    });

    if (existingCount === 0) {
      await provisionDefaultSheets(req.user.userId);
    }

    const sheets = await Sheet.find({
      userId: req.user.userId,
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

    const sheetColumns = Array.isArray(columns) ? columns : [];

    const sheetRows =
      Array.isArray(rows) && rows.length > 0
        ? rows
        : createEmptyRows(sheetColumns, 5);

    const sheet = await Sheet.create({
      userId: req.user.userId,
      name: name.trim(),
      columns: sheetColumns,
      rows: sheetRows,
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
