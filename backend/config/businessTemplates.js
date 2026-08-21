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

const BUSINESS_TEMPLATES = {
  "General Business": {
    name: "General Business",
    defaultSheets: [
      "Daily Transactions",
      "Expenses",
      "Sales & Income",
      "Bills & Payments",
      "Inventory",
    ],
  },

  "Cyber Cafe": {
    name: "Cyber Cafe",
    defaultSheets: [
      "Daily Transactions",
      "Expenses",
      "Monthly Bills",
      "Online Payments",
      "Inventory",
    ],
  },

  Grocery: {
    name: "Grocery",
    defaultSheets: [
      "Daily Sales",
      "Stock Purchase",
      "Daily Expenses",
      "Inventory",
    ],
  },

  "Medical Store": {
    name: "Medical Store",
    defaultSheets: [
      "Daily Sales",
      "Supplier Payments",
      "Expenses",
      "Inventory",
    ],
  },
};

const getBusinessTemplate = (businessType) => {
  return BUSINESS_TEMPLATES[businessType] || null;
};

module.exports = {
  DEFAULT_COLUMNS,
  INVENTORY_COLUMNS,
  BUSINESS_TEMPLATES,
  getBusinessTemplate,
};