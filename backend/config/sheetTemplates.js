const DEFAULT_COLUMNS = [
  "Date",
  "Description",
  "Category",
  "Income",
  "Expense",
  "Payment Method",
  "Notes",
  "Created At",
  "Updated At",
];

const INVENTORY_COLUMNS = [
  "Item Name",
  "Category",
  "Quantity",
  "Unit",
  "Purchase Price",
  "Selling Price",
  "Supplier",
  "Low Stock Limit",
  "Stock Value",
  "Last Updated",
];

// Fixed set of default sheets every user gets automatically.
// Order here determines the order they are created in, which in
// turn determines their default display order (sheets are sorted
// by createdAt ascending when listed).
const DEFAULT_SHEET_TEMPLATES = [
  {
    name: "Daily Transactions",
    columns: DEFAULT_COLUMNS,
  },
  {
    name: "Expenses",
    columns: DEFAULT_COLUMNS,
  },
  {
    name: "Sales & Income",
    columns: DEFAULT_COLUMNS,
  },
  {
    name: "Bills & Payments",
    columns: DEFAULT_COLUMNS,
  },
  {
    name: "Inventory",
    columns: INVENTORY_COLUMNS,
  },
];

module.exports = {
  DEFAULT_COLUMNS,
  INVENTORY_COLUMNS,
  DEFAULT_SHEET_TEMPLATES,
};
