/*
 * ----------------------------------------
 * EXPORT HELPERS
 * ----------------------------------------
 */

export const isDateColumn = (columnName) =>
  String(columnName ?? "")
    .trim()
    .toLowerCase() === "date";

export const isIncomeColumn = (columnName) =>
  columnName === "Income";

export const isExpenseColumn = (columnName) =>
  columnName === "Expense";

/*
 * ----------------------------------------
 * DATE FORMAT
 * ----------------------------------------
 */

const padNumber = (number) =>
  String(number).padStart(2, "0");

const parseDateString = (dateString) => {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = String(dateString)
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDateForExport = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = parseDateString(dateString);

  if (!date) {
    return dateString;
  }

  return `${padNumber(date.getDate())}/${padNumber(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
};

/*
 * ----------------------------------------
 * CELL VALUE
 * ----------------------------------------
 */

export const formatCellValue = (
  columnName,
  value,
) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (isDateColumn(columnName)) {
    return formatDateForExport(value);
  }

  return String(value);
};

/*
 * ----------------------------------------
 * TOTALS
 * ----------------------------------------
 */

export const calculateColumnTotal = (
  rows,
  columnName,
) => {
  return rows.reduce((total, row) => {
    const value = Number(
      String(row?.[columnName] ?? "").replace(
        /,/g,
        "",
      ),
    );

    return Number.isFinite(value)
      ? total + value
      : total;
  }, 0);
};

export const hasTotals = (columns) =>
  columns.includes("Income") ||
  columns.includes("Expense");

export const createTotalRow = (
  columns,
  rows,
) => {
  const hasIncome = columns.includes("Income");
  const hasExpense = columns.includes("Expense");

  if (!hasIncome && !hasExpense) {
    return null;
  }

  return columns.map((columnName, index) => {
    if (index === 0) {
      return "TOTAL";
    }

    if (columnName === "Income") {
      return calculateColumnTotal(
        rows,
        "Income",
      );
    }

    if (columnName === "Expense") {
      return calculateColumnTotal(
        rows,
        "Expense",
      );
    }

    return "";
  });
};

/*
 * ----------------------------------------
 * EXPORT DATA
 * ----------------------------------------
 */

export const createExportRows = (
  columns,
  rows,
) => {
  return rows.map((row) =>
    columns.map((columnName) =>
      formatCellValue(
        columnName,
        row?.[columnName],
      ),
    ),
  );
};

/*
 * ----------------------------------------
 * FILENAME
 * ----------------------------------------
 */

export const sanitizeFileName = (
  name,
  fallback = "Sheet",
) => {
  const sanitized = String(name ?? "")
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");

  const withoutControlCharacters = Array.from(
    sanitized,
  )
    .filter((character) => {
      const code = character.charCodeAt(0);

      return code >= 32 && code !== 127;
    })
    .join("");

  return withoutControlCharacters || fallback;
};