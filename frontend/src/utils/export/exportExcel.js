import * as XLSX from "xlsx";

import {
  createExportRows,
  createTotalRow,
  sanitizeFileName,
} from "./exportHelpers";

/*
 * ----------------------------------------
 * EXPORT EXCEL
 * ----------------------------------------
 */

export const exportToExcel = (
  sheetName,
  columns,
  rows,
) => {
  if (!columns || columns.length === 0) {
    throw new Error(
      "No columns available for Excel export.",
    );
  }

  /*
   * ----------------------------------------
   * HEADER + DATA
   * ----------------------------------------
   */

  const exportRows = createExportRows(
    columns,
    rows,
  );

  const worksheetData = [
    columns,
    ...exportRows,
  ];

  /*
   * ----------------------------------------
   * TOTALS
   * ----------------------------------------
   */

  const totalRow = createTotalRow(
    columns,
    rows,
  );

  if (totalRow) {
    worksheetData.push(totalRow);
  }

  /*
   * ----------------------------------------
   * WORKSHEET
   * ----------------------------------------
   */

  const worksheet = XLSX.utils.aoa_to_sheet(
    worksheetData,
  );

  /*
   * ----------------------------------------
   * WORKBOOK
   * ----------------------------------------
   */

  const workbook = XLSX.utils.book_new();

  const safeSheetName = (
    sheetName || "Sheet"
  )
    .substring(0, 31)
    .replace(/[:\\/?*[\]]/g, "");

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    safeSheetName || "Sheet",
  );

  /*
   * ----------------------------------------
   * SAVE
   * ----------------------------------------
   */

  const fileName =
    `${sanitizeFileName(sheetName, "Sheet")}.xlsx`;

  XLSX.writeFile(
    workbook,
    fileName,
  );
};