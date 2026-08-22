const mongoose = require("mongoose");

const sheetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    columns: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: function (columns) {
          const normalizedColumns = columns.map((column) =>
            column.trim().toLowerCase()
          );

          return new Set(normalizedColumns).size === normalizedColumns.length;
        },
        message: "Sheet columns must be unique",
      },
    },

    rows: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sheet", sheetSchema);