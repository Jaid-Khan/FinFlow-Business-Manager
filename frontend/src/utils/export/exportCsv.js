import {
  createExportRows,
  createTotalRow,
  sanitizeFileName,
} from "./exportHelpers";

/*
 * ----------------------------------------
 * CSV ESCAPING
 * ----------------------------------------
 */

const escapeCsvValue = (value) => {
  const stringValue = String(
    value ?? "",
  );

  /*
   * CSV requires quotes when the value
   * contains comma, quote or newline.
   */
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(
      /"/g,
      '""',
    )}"`;
  }

  return stringValue;
};

/*
 * ----------------------------------------
 * EXPORT CSV
 * ----------------------------------------
 */

export const exportToCsv = (
  sheetName,
  columns,
  rows,
) => {
  const exportRows = createExportRows(
    columns,
    rows,
  );

  const totalRow = createTotalRow(
    columns,
    rows,
  );

  const csvRows = [
    columns.map(escapeCsvValue).join(","),
    ...exportRows.map((row) =>
      row.map(escapeCsvValue).join(","),
    ),
  ];

  if (totalRow) {
    csvRows.push(
      totalRow
        .map(escapeCsvValue)
        .join(","),
    );
  }

  /*
   * BOM helps Excel correctly detect UTF-8.
   */
  const csvContent =
    "\uFEFF" + csvRows.join("\r\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  const fileName =
    `${sanitizeFileName(sheetName)}.csv`;

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};