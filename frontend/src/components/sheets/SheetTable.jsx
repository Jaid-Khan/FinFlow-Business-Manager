import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SheetTable({ sheet }) {
  const [columns, setColumns] = useState(sheet.columns || []);
  const [rows, setRows] = useState(sheet.rows || []);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingColumn, setEditingColumn] = useState(null);
  const [columnName, setColumnName] = useState("");

  const [newColumnName, setNewColumnName] = useState("");
  const [draggedColumnIndex, setDraggedColumnIndex] = useState(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);

  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = () => {
      setContextMenu(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // -----------------------------
  // CONTEXT MENU
  // -----------------------------

  const handleColumnContextMenu = (event, columnIndex) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      type: "column",
      index: columnIndex,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleRowContextMenu = (event, rowIndex) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      type: "row",
      index: rowIndex,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // -----------------------------
  // ROW OPERATIONS
  // -----------------------------

  const handleAddRow = () => {
    const newRow = {};

    columns.forEach((column) => {
      newRow[column] = "";
    });

    setRows((currentRows) => [...currentRows, newRow]);
    clearMessages();
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    setRows((currentRows) =>
      currentRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [columnName]: value,
            }
          : row
      )
    );

    clearMessages();
  };

  const handleDeleteRow = (rowIndex) => {
    setRows((currentRows) =>
      currentRows.filter((_, index) => index !== rowIndex)
    );

    clearMessages();
    closeContextMenu();
  };

  const handleEditRow = (rowIndex) => {
    closeContextMenu();
    clearMessages();

    const firstColumn = columns[0];

    if (!firstColumn) {
      return;
    }

    const rowInput = document.querySelector(
      `[data-row-index="${rowIndex}"][data-column-name="${CSS.escape(
        firstColumn
      )}"]`
    );

    if (rowInput) {
      rowInput.focus();
      rowInput.select();
    }
  };

  // -----------------------------
  // COLUMN OPERATIONS
  // -----------------------------

  const handleStartColumnEdit = (columnIndex) => {
    setEditingColumn(columnIndex);
    setColumnName(columns[columnIndex]);
    clearMessages();
    closeContextMenu();
  };

  const handleCancelColumnEdit = () => {
    setEditingColumn(null);
    setColumnName("");
  };

  const handleSaveColumnEdit = (columnIndex) => {
    const trimmedName = columnName.trim();

    if (!trimmedName) {
      setError("Column name cannot be empty.");
      return;
    }

    const duplicate = columns.some(
      (column, index) =>
        index !== columnIndex &&
        column.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      setError("Column name must be unique.");
      return;
    }

    const oldColumnName = columns[columnIndex];

    const updatedColumns = columns.map((column, index) =>
      index === columnIndex ? trimmedName : column
    );

    const updatedRows = rows.map((row) => {
      const updatedRow = {};

      Object.keys(row).forEach((key) => {
        if (key === oldColumnName) {
          updatedRow[trimmedName] = row[key];
        } else {
          updatedRow[key] = row[key];
        }
      });

      return updatedRow;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);

    setEditingColumn(null);
    setColumnName("");
    clearMessages();
  };

  const handleAddColumn = () => {
    const trimmedName = newColumnName.trim();

    if (!trimmedName) {
      setError("Column name is required.");
      return;
    }

    const duplicate = columns.some(
      (column) =>
        column.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicate) {
      setError("Column name must be unique.");
      return;
    }

    setColumns((currentColumns) => [
      ...currentColumns,
      trimmedName,
    ]);

    setRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        [trimmedName]: "",
      }))
    );

    setNewColumnName("");
    clearMessages();
  };

  const handleDeleteColumn = (columnIndex) => {
    if (columns.length === 1) {
      setError("A sheet must have at least one column.");
      closeContextMenu();
      return;
    }

    const columnToDelete = columns[columnIndex];

    setColumns((currentColumns) =>
      currentColumns.filter(
        (_, index) => index !== columnIndex
      )
    );

    setRows((currentRows) =>
      currentRows.map((row) => {
        const updatedRow = { ...row };
        delete updatedRow[columnToDelete];
        return updatedRow;
      })
    );

    if (editingColumn === columnIndex) {
      setEditingColumn(null);
      setColumnName("");
    }

    clearMessages();
    closeContextMenu();
  };

  // -----------------------------
  // COLUMN DRAG & DROP
  // -----------------------------

  const handleColumnDragStart = (event, index) => {
    setDraggedColumnIndex(index);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  };

  const handleColumnDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleColumnDrop = (event, targetIndex) => {
    event.preventDefault();

    if (draggedColumnIndex === null) {
      return;
    }

    if (draggedColumnIndex === targetIndex) {
      setDraggedColumnIndex(null);
      return;
    }

    const reorderedColumns = [...columns];

    const [movedColumn] = reorderedColumns.splice(
      draggedColumnIndex,
      1
    );

    reorderedColumns.splice(
      targetIndex,
      0,
      movedColumn
    );

    const reorderedRows = rows.map((row) => {
      const reorderedRow = {};

      reorderedColumns.forEach((column) => {
        reorderedRow[column] = row[column] ?? "";
      });

      return reorderedRow;
    });

    setColumns(reorderedColumns);
    setRows(reorderedRows);
    setDraggedColumnIndex(null);
    clearMessages();
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnIndex(null);
  };

  // -----------------------------
  // ROW DRAG & DROP
  // -----------------------------

  const handleRowDragStart = (event, index) => {
    setDraggedRowIndex(index);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      String(index)
    );
  };

  const handleRowDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleRowDrop = (event, targetIndex) => {
    event.preventDefault();

    if (draggedRowIndex === null) {
      return;
    }

    if (draggedRowIndex === targetIndex) {
      setDraggedRowIndex(null);
      return;
    }

    const reorderedRows = [...rows];

    const [movedRow] = reorderedRows.splice(
      draggedRowIndex,
      1
    );

    reorderedRows.splice(
      targetIndex,
      0,
      movedRow
    );

    setRows(reorderedRows);
    setDraggedRowIndex(null);
    clearMessages();
  };

  const handleRowDragEnd = () => {
    setDraggedRowIndex(null);
  };

  // -----------------------------
  // SAVE
  // -----------------------------

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/sheets/${sheet._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            columns,
            rows,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save sheet changes"
        );
      }

      setColumns(data.sheet.columns || []);
      setRows(data.sheet.rows || []);

      setSuccess("Changes saved successfully.");
    } catch (error) {
      console.error("Save sheet error:", error);

      setError(
        error.message || "Failed to save sheet changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // -----------------------------
  // TOTALS
  // -----------------------------

  const calculateTotal = (columnName) => {
    return rows.reduce((total, row) => {
      const value = Number(
        String(row[columnName] ?? "").replace(/,/g, "")
      );

      return Number.isFinite(value) ? total + value : total;
    }, 0);
  };

  const hasIncomeColumn = columns.includes("Income");
  const hasExpenseColumn = columns.includes("Expense");

  return (
    <section>
      {/* HEADER */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {sheet.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {columns.length} columns · {rows.length} rows
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            + Add Row
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ADD COLUMN */}
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <input
          type="text"
          value={newColumnName}
          onChange={(event) =>
            setNewColumnName(event.target.value)
          }
          placeholder="Enter new column name"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAddColumn();
            }
          }}
        />

        <button
          type="button"
          onClick={handleAddColumn}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          + Add Column
        </button>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 z-10 border-b border-r border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
                #
              </th>

              {columns.map((columnName, columnIndex) => (
                <th
                  key={columnName}
                  draggable={editingColumn !== columnIndex}
                  onContextMenu={(event) =>
                    handleColumnContextMenu(
                      event,
                      columnIndex
                    )
                  }
                  onDragStart={(event) =>
                    handleColumnDragStart(
                      event,
                      columnIndex
                    )
                  }
                  onDragOver={handleColumnDragOver}
                  onDrop={(event) =>
                    handleColumnDrop(
                      event,
                      columnIndex
                    )
                  }
                  onDragEnd={handleColumnDragEnd}
                  className={`min-w-35 border-b border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 ${
                    draggedColumnIndex === columnIndex
                      ? "opacity-40"
                      : ""
                  }`}
                  title="Right-click for options"
                >
                  {editingColumn === columnIndex ? (
                    <div className="flex min-w-35 flex-col gap-2">
                      <input
                        type="text"
                        value={columnName}
                        onChange={(event) =>
                          setColumnName(
                            event.target.value
                          )
                        }
                        autoFocus
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-normal outline-none focus:border-gray-500"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSaveColumnEdit(
                              columnIndex
                            );
                          }

                          if (event.key === "Escape") {
                            handleCancelColumnEdit();
                          }
                        }}
                      />

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleSaveColumnEdit(
                              columnIndex
                            )
                          }
                          className="rounded bg-gray-900 px-2 py-1 text-xs text-white"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleCancelColumnEdit
                          }
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="cursor-grab select-none active:cursor-grabbing">
                      {columnName}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  draggable
                  onDragStart={(event) =>
                    handleRowDragStart(
                      event,
                      rowIndex
                    )
                  }
                  onDragOver={handleRowDragOver}
                  onDrop={(event) =>
                    handleRowDrop(event, rowIndex)
                  }
                  onDragEnd={handleRowDragEnd}
                  className={`hover:bg-gray-50 ${
                    draggedRowIndex === rowIndex
                      ? "opacity-40"
                      : ""
                  }`}
                >
                  <td
                    onContextMenu={(event) =>
                      handleRowContextMenu(
                        event,
                        rowIndex
                      )
                    }
                    className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500"
                    title="Right-click for row options"
                  >
                    <div className="flex items-center gap-2">
                      <span className="cursor-grab select-none active:cursor-grabbing">
                        ⋮⋮
                      </span>

                      <span>{rowIndex + 1}</span>
                    </div>
                  </td>

                  {columns.map((columnName) => (
                    <td
                      key={columnName}
                      className="border-b border-r border-gray-200 p-0"
                    >
                      <input
                        type="text"
                        value={row[columnName] ?? ""}
                        data-row-index={rowIndex}
                        data-column-name={columnName}
                        onChange={(event) =>
                          handleCellChange(
                            rowIndex,
                            columnName,
                            event.target.value
                          )
                        }
                        className="w-full min-w-35 bg-transparent px-4 py-3 text-sm text-gray-700 outline-none focus:bg-gray-50"
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-12 text-center"
                >
                  <p className="text-sm font-medium text-gray-700">
                    No rows available
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Click "+ Add Row" to add data to this
                    sheet.
                  </p>
                </td>
              </tr>
            )}
          </tbody>

          {/* TOTALS */}
          {(hasIncomeColumn || hasExpenseColumn) && (
            <tfoot className="bg-gray-50">
              <tr>
                <td className="border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                  Total
                </td>

                {columns.map((columnName) => (
                  <td
                    key={columnName}
                    className="border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    {columnName === "Income"
                      ? calculateTotal(
                          "Income"
                        ).toLocaleString()
                      : columnName === "Expense"
                      ? calculateTotal(
                          "Expense"
                        ).toLocaleString()
                      : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Drag column headers left/right to reorder columns.
        Drag rows up/down to reorder rows. Right-click a
        column or row for available actions.
      </p>

      {/* CONTEXT MENU */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          onClick={(event) => event.stopPropagation()}
          className="fixed z-50 min-w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          {contextMenu.type === "column" && (
            <>
              <button
                type="button"
                onClick={() =>
                  handleStartColumnEdit(
                    contextMenu.index
                  )
                }
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Column
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteColumn(
                    contextMenu.index
                  )
                }
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete Column
              </button>
            </>
          )}

          {contextMenu.type === "row" && (
            <>
              <button
                type="button"
                onClick={() =>
                  handleEditRow(contextMenu.index)
                }
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Row
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteRow(contextMenu.index)
                }
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete Row
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default SheetTable;