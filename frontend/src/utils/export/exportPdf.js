import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  createExportRows,
  createTotalRow,
  sanitizeFileName,
} from "./exportHelpers";

/*
 * ----------------------------------------
 * EXPORT PDF
 * ----------------------------------------
 */

export const exportToPdf = (
  sheetName,
  columns,
  rows,
) => {
  /*
   * Landscape is better for dynamic
   * Excel-like sheets with many columns.
   */
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const exportRows = createExportRows(
    columns,
    rows,
  );

  const totalRow = createTotalRow(
    columns,
    rows,
  );

  /*
   * ----------------------------------------
   * TITLE
   * ----------------------------------------
   */

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");

  doc.text(
    sheetName || "Sheet",
    14,
    15,
  );

  /*
   * ----------------------------------------
   * TABLE
   * ----------------------------------------
   */

  autoTable(doc, {
    startY: 22,

    head: [columns],

    body: exportRows,

    foot: totalRow
      ? [totalRow]
      : undefined,

    theme: "grid",

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      valign: "middle",
    },

    headStyles: {
      fontStyle: "bold",
    },

    footStyles: {
      fontStyle: "bold",
    },

    alternateRowStyles: {
      minCellHeight: 7,
    },

    margin: {
      top: 22,
      right: 10,
      bottom: 10,
      left: 10,
    },
  });

  /*
   * ----------------------------------------
   * SAVE
   * ----------------------------------------
   */

  const fileName =
    `${sanitizeFileName(sheetName)}.pdf`;

  doc.save(fileName);
};