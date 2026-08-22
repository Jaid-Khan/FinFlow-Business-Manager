import { useCallback, useEffect, useRef, useState } from "react";

import { updateSheet } from "../../services/sheetService";

/*
 * ----------------------------------------
 * DATE HELPERS
 * ----------------------------------------
 */

const padNumber = (number) => String(number).padStart(2, "0");

const getTodayString = () => {
  const today = new Date();

  return `${today.getFullYear()}-${padNumber(
    today.getMonth() + 1,
  )}-${padNumber(today.getDate())}`;
};

const parseDateString = (dateString) => {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = parseDateString(dateString);

  if (!date || Number.isNaN(date.getTime())) {
    return dateString;
  }

  return `${padNumber(date.getDate())}/${padNumber(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
};

const formatDateForInput = (date) => {
  return `${date.getFullYear()}-${padNumber(
    date.getMonth() + 1,
  )}-${padNumber(date.getDate())}`;
};

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let index = 0; index < firstDayOfWeek; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
};

/*
 * ----------------------------------------
 * DATE PICKER
 * ----------------------------------------
 */

function DatePicker({
  value,
  onConfirm,
  onCancel,
  anchorRect,
  placement,
}) {
  const initialDate = parseDateString(value) || new Date();

  const [selectedDate, setSelectedDate] = useState(
    formatDateForInput(initialDate),
  );

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      1,
    ),
  );

  const pickerRef = useRef(null);

  /*
   * ----------------------------------------
   * CALENDAR POSITION
   * ----------------------------------------
   *
   * Calendar center is aligned with the
   * selected cell's vertical center.
   *
   * Default:
   *   Open on RIGHT side.
   *
   * If there isn't enough room:
   *   Open on LEFT side.
   */

  const CALENDAR_WIDTH = 260;
  const CALENDAR_HEIGHT = 330;
  const VIEWPORT_PADDING = 8;
  const GAP = 8;

  let calendarLeft = 0;
  let calendarTop = 0;

  if (anchorRect) {
    if (placement === "right") {
      /*
       * The calendar's center is aligned
       * near the right edge of the cell.
       */
      calendarLeft =
        anchorRect.right -
        CALENDAR_WIDTH / 2 +
        GAP;
    } else {
      /*
       * The calendar's center is aligned
       * near the left edge of the cell.
       */
      calendarLeft =
        anchorRect.left -
        CALENDAR_WIDTH / 2 -
        GAP;
    }

    /*
     * Vertical center of calendar =
     * vertical center of selected cell.
     */
    calendarTop =
      anchorRect.top +
      anchorRect.height / 2 -
      CALENDAR_HEIGHT / 2;
  }

  /*
   * ----------------------------------------
   * VIEWPORT BOUNDARY PROTECTION
   * ----------------------------------------
   */

  if (typeof window !== "undefined") {
    const maxLeft =
      window.innerWidth -
      CALENDAR_WIDTH -
      VIEWPORT_PADDING;

    const maxTop =
      window.innerHeight -
      CALENDAR_HEIGHT -
      VIEWPORT_PADDING;

    calendarLeft = Math.max(
      VIEWPORT_PADDING,
      Math.min(calendarLeft, maxLeft),
    );

    calendarTop = Math.max(
      VIEWPORT_PADDING,
      Math.min(calendarTop, maxTop),
    );
  }

  /*
   * ----------------------------------------
   * KEYBOARD HANDLING
   * ----------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }

      if (event.key === "Enter") {
        event.preventDefault();

        if (selectedDate) {
          onConfirm(selectedDate);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [selectedDate, onCancel, onConfirm]);

  /*
   * ----------------------------------------
   * OUTSIDE CLICK
   * ----------------------------------------
   */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        onCancel();
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [onCancel]);

  /*
   * ----------------------------------------
   * MONTH DATA
   * ----------------------------------------
   */

  const currentYear = visibleMonth.getFullYear();
  const currentMonth = visibleMonth.getMonth();

  const calendarDays = getCalendarDays(
    currentYear,
    currentMonth,
  );

  const monthLabel = visibleMonth.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  );

  const today = getTodayString();

  /*
   * ----------------------------------------
   * MONTH NAVIGATION
   * ----------------------------------------
   */

  const handlePreviousMonth = () => {
    setVisibleMonth(
      new Date(
        currentYear,
        currentMonth - 1,
        1,
      ),
    );
  };

  const handleNextMonth = () => {
    setVisibleMonth(
      new Date(
        currentYear,
        currentMonth + 1,
        1,
      ),
    );
  };

  /*
   * ----------------------------------------
   * TODAY
   * ----------------------------------------
   */

  const handleToday = () => {
    const todayDate = new Date();

    const todayString = formatDateForInput(
      todayDate,
    );

    setSelectedDate(todayString);

    setVisibleMonth(
      new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        1,
      ),
    );
  };

  /*
   * ----------------------------------------
   * DATE SELECT
   * ----------------------------------------
   */

const handleDateSelect = (date) => {
  if (!date) {
    return;
  }

  const dateString = formatDateForInput(date);

  setSelectedDate(dateString);

  // Date select hote hi immediately confirm
  onConfirm(dateString);
};

  /*
   * ----------------------------------------
   * DONE
   * ----------------------------------------
   */

  return (
    <div
      ref={pickerRef}
      className="fixed z-100 w-65 rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
      style={{
        left: `${calendarLeft}px`,
        top: `${calendarTop}px`,
      }}
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      {/* HEADER */}

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
          aria-label="Previous month"
        >
          ‹
        </button>

        <p className="text-sm font-semibold text-gray-800">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* WEEK DAYS */}

      <div className="mb-1 grid grid-cols-7">
        {[
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sa",
        ].map((day) => (
          <div
            key={day}
            className="py-1 text-center text-[11px] font-medium text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* CALENDAR */}

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="h-8"
              />
            );
          }

          const dateString =
            formatDateForInput(date);

          const isSelected =
            selectedDate === dateString;

          const isToday =
            today === dateString;

          return (
            <button
              key={dateString}
              type="button"
              onClick={() =>
                handleDateSelect(date)
              }
              className={`relative flex h-8 items-center justify-center rounded-lg text-xs transition ${
                isSelected
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {date.getDate()}

              {isToday && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gray-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER */}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
        <button
          type="button"
          onClick={handleToday}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Today
        </button>

      <button
  type="button"
  onClick={onCancel}
  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
>
  Cancel
</button>
      </div>

      <p className="mt-2 text-center text-[10px] text-gray-400">
        Press Enter to confirm · Esc to cancel
      </p>
    </div>
  );
}

/*
 * ----------------------------------------
 * MAIN SHEET TABLE
 * ----------------------------------------
 */

function SheetTable({ sheet }) {
  const [columns, setColumns] = useState(
    sheet.columns || [],
  );

  const [rows, setRows] = useState(
    sheet.rows || [],
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("Saved");

  const [editingColumn, setEditingColumn] =
    useState(null);

  const [columnName, setColumnName] =
    useState("");

  const [newColumnName, setNewColumnName] =
    useState("");

  const [draggedColumnIndex, setDraggedColumnIndex] =
    useState(null);

  const [draggedRowIndex, setDraggedRowIndex] =
    useState(null);

  const [contextMenu, setContextMenu] =
    useState(null);

  /*
   * ----------------------------------------
   * DATE PICKER STATE
   * ----------------------------------------
   */

  const [activeDateCell, setActiveDateCell] =
    useState(null);

  const [datePickerPosition, setDatePickerPosition] =
    useState(null);

  const contextMenuRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  /*
   * ----------------------------------------
   * AUTOSAVE
   * ----------------------------------------
   */

  const sheetId = sheet?._id;

  const saveSheet = useCallback(
    async (columnsToSave, rowsToSave) => {
      if (!sheetId) {
        return;
      }

      setIsSaving(true);
      setError("");
      setSuccess("");

      try {
        const data = await updateSheet(sheetId, {
          columns: columnsToSave,
          rows: rowsToSave,
        });

        if (!isMountedRef.current) {
          return;
        }

        setColumns(data.sheet.columns || []);
        setRows(data.sheet.rows || []);

        setSuccess("Saved");
      } catch (error) {
        console.error("Save sheet error:", error);

        if (!isMountedRef.current) {
          return;
        }

        setError(
          error.message ||
            "Failed to save sheet changes",
        );

        setSuccess("");
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [sheetId],
  );

  const scheduleAutosave = useCallback(
    (nextColumns, nextRows) => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(
          autosaveTimerRef.current,
        );
      }

      setError("");
      setSuccess("");

      autosaveTimerRef.current =
        window.setTimeout(() => {
          autosaveTimerRef.current = null;

          saveSheet(nextColumns, nextRows);
        }, 1500);
    },
    [saveSheet],
  );

  /*
   * ----------------------------------------
   * COMPONENT MOUNT / CLEANUP
   * ----------------------------------------
   */

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (autosaveTimerRef.current) {
        window.clearTimeout(
          autosaveTimerRef.current,
        );
      }
    };
  }, []);

  /*
   * ----------------------------------------
   * CONTEXT MENU
   * ----------------------------------------
   */

  useEffect(() => {
    const handleDocumentClick = () => {
      setContextMenu(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    document.addEventListener(
      "click",
      handleDocumentClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /*
   * ----------------------------------------
   * DATE COLUMN
   * ----------------------------------------
   */

  const isDateColumn = (columnName) =>
    columnName.trim().toLowerCase() === "date";

  const handleOpenDatePicker = (
    rowIndex,
    columnName,
    event,
  ) => {
    clearMessages();
    closeContextMenu();

    let anchorRect = null;

    /*
     * When opened by clicking the actual
     * date cell, use currentTarget.
     */
    if (event?.currentTarget) {
      anchorRect =
        event.currentTarget.getBoundingClientRect();
    } else {
      /*
       * When opened through "Edit Row",
       * find the Date cell directly.
       */
      const selector =
        `[data-row-index="${rowIndex}"][data-column-name="${CSS.escape(
          columnName,
        )}"]`;

      const element =
        document.querySelector(selector);

      if (element) {
        anchorRect =
          element.getBoundingClientRect();
      }
    }

    if (!anchorRect) {
      return;
    }

    const calendarWidth = 260;
    const gap = 8;
    const viewportPadding = 8;

    /*
     * Calculate the position if the calendar
     * opens on the RIGHT.
     */
    const rightCalendarLeft =
      anchorRect.right -
      calendarWidth / 2 +
      gap;

    const rightCalendarRight =
      rightCalendarLeft +
      calendarWidth;

    /*
     * Check whether the complete calendar
     * fits on the right side of viewport.
     */
    const hasEnoughSpaceOnRight =
      rightCalendarLeft >=
        viewportPadding &&
      rightCalendarRight <=
        window.innerWidth -
          viewportPadding;

    /*
     * If right doesn't fit, use LEFT.
     */
    const placement =
      hasEnoughSpaceOnRight
        ? "right"
        : "left";

    setDatePickerPosition({
      anchorRect,
      placement,
    });

    setActiveDateCell({
      rowIndex,
      columnName,
    });
  };

  const handleConfirmDate = (
    rowIndex,
    columnName,
    value,
  ) => {
    setActiveDateCell(null);
    setDatePickerPosition(null);

    handleCellChange(
      rowIndex,
      columnName,
      value,
    );
  };

  const handleCancelDatePicker = () => {
    setActiveDateCell(null);
    setDatePickerPosition(null);
  };

  /*
   * ----------------------------------------
   * COLUMN CONTEXT MENU
   * ----------------------------------------
   */

  const handleColumnContextMenu = (
    event,
    columnIndex,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setContextMenu({
      type: "column",
      index: columnIndex,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleRowContextMenu = (
    event,
    rowIndex,
  ) => {
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

  /*
   * ----------------------------------------
   * ROW OPERATIONS
   * ----------------------------------------
   */

  const handleAddRow = () => {
    const newRow = {};

    columns.forEach((column) => {
      newRow[column] = "";
    });

    const updatedRows = [...rows, newRow];

    setRows(updatedRows);

    clearMessages();

    scheduleAutosave(
      columns,
      updatedRows,
    );
  };

  const handleCellChange = (
    rowIndex,
    columnName,
    value,
  ) => {
    const updatedRows = rows.map(
      (row, index) =>
        index === rowIndex
          ? {
              ...row,
              [columnName]: value,
            }
          : row,
    );

    setRows(updatedRows);

    clearMessages();

    scheduleAutosave(
      columns,
      updatedRows,
    );
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter(
      (_, index) => index !== rowIndex,
    );

    setRows(updatedRows);

    clearMessages();
    closeContextMenu();

    scheduleAutosave(
      columns,
      updatedRows,
    );
  };

  const handleEditRow = (rowIndex) => {
    closeContextMenu();
    clearMessages();

    const firstColumn = columns[0];

    if (!firstColumn) {
      return;
    }

    /*
     * If first column is Date, open the
     * date picker instead of normal input.
     */
    if (isDateColumn(firstColumn)) {
      handleOpenDatePicker(
        rowIndex,
        firstColumn,
      );

      return;
    }

    const rowInput = document.querySelector(
      `[data-row-index="${rowIndex}"][data-column-name="${CSS.escape(
        firstColumn,
      )}"]`,
    );

    if (rowInput) {
      rowInput.focus();
      rowInput.select();
    }
  };

  /*
   * ----------------------------------------
   * COLUMN OPERATIONS
   * ----------------------------------------
   */

  const handleStartColumnEdit = (
    columnIndex,
  ) => {
    setEditingColumn(columnIndex);
    setColumnName(columns[columnIndex]);

    clearMessages();
    closeContextMenu();
  };

  const handleCancelColumnEdit = () => {
    setEditingColumn(null);
    setColumnName("");
  };

  const handleSaveColumnEdit = (
    columnIndex,
  ) => {
    const trimmedName = columnName.trim();

    if (!trimmedName) {
      setError(
        "Column name cannot be empty.",
      );

      setSuccess("");

      return;
    }

    const duplicate = columns.some(
      (column, index) =>
        index !== columnIndex &&
        column.toLowerCase() ===
          trimmedName.toLowerCase(),
    );

    if (duplicate) {
      setError(
        "Column name must be unique.",
      );

      setSuccess("");

      return;
    }

    const oldColumnName =
      columns[columnIndex];

    const updatedColumns = columns.map(
      (column, index) =>
        index === columnIndex
          ? trimmedName
          : column,
    );

    const updatedRows = rows.map((row) => {
      const updatedRow = {};

      Object.keys(row).forEach((key) => {
        if (key === oldColumnName) {
          updatedRow[trimmedName] =
            row[key];
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

    scheduleAutosave(
      updatedColumns,
      updatedRows,
    );
  };

  const handleAddColumn = () => {
    const trimmedName =
      newColumnName.trim();

    if (!trimmedName) {
      setError(
        "Column name is required.",
      );

      setSuccess("");

      return;
    }

    const duplicate = columns.some(
      (column) =>
        column.toLowerCase() ===
        trimmedName.toLowerCase(),
    );

    if (duplicate) {
      setError(
        "Column name must be unique.",
      );

      setSuccess("");

      return;
    }

    const updatedColumns = [
      ...columns,
      trimmedName,
    ];

    const updatedRows = rows.map((row) => ({
      ...row,
      [trimmedName]: "",
    }));

    setColumns(updatedColumns);
    setRows(updatedRows);

    setNewColumnName("");

    clearMessages();

    scheduleAutosave(
      updatedColumns,
      updatedRows,
    );
  };

  const handleDeleteColumn = (
    columnIndex,
  ) => {
    if (columns.length === 1) {
      setError(
        "A sheet must have at least one column.",
      );

      setSuccess("");
      closeContextMenu();

      return;
    }

    const columnToDelete =
      columns[columnIndex];

    const updatedColumns =
      columns.filter(
        (_, index) =>
          index !== columnIndex,
      );

    const updatedRows = rows.map((row) => {
      const updatedRow = {
        ...row,
      };

      delete updatedRow[columnToDelete];

      return updatedRow;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);

    if (
      editingColumn === columnIndex
    ) {
      setEditingColumn(null);
      setColumnName("");
    }

    /*
     * Close date picker if its column
     * has just been deleted.
     */
    if (
      activeDateCell?.columnName ===
      columnToDelete
    ) {
      setActiveDateCell(null);
      setDatePickerPosition(null);
    }

    clearMessages();
    closeContextMenu();

    scheduleAutosave(
      updatedColumns,
      updatedRows,
    );
  };

  /*
   * ----------------------------------------
   * COLUMN DRAG & DROP
   * ----------------------------------------
   */

  const handleColumnDragStart = (
    event,
    index,
  ) => {
    setDraggedColumnIndex(index);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index),
    );
  };

  const handleColumnDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  };

  const handleColumnDrop = (
    event,
    targetIndex,
  ) => {
    event.preventDefault();

    if (
      draggedColumnIndex === null
    ) {
      return;
    }

    if (
      draggedColumnIndex === targetIndex
    ) {
      setDraggedColumnIndex(null);

      return;
    }

    const reorderedColumns = [
      ...columns,
    ];

    const [movedColumn] =
      reorderedColumns.splice(
        draggedColumnIndex,
        1,
      );

    reorderedColumns.splice(
      targetIndex,
      0,
      movedColumn,
    );

    const reorderedRows = rows.map(
      (row) => {
        const reorderedRow = {};

        reorderedColumns.forEach(
          (column) => {
            reorderedRow[column] =
              row[column] ?? "";
          },
        );

        return reorderedRow;
      },
    );

    setColumns(reorderedColumns);
    setRows(reorderedRows);
    setDraggedColumnIndex(null);

    clearMessages();

    scheduleAutosave(
      reorderedColumns,
      reorderedRows,
    );
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnIndex(null);
  };

  /*
   * ----------------------------------------
   * ROW DRAG & DROP
   * ----------------------------------------
   */

  const handleRowDragStart = (
    event,
    index,
  ) => {
    setDraggedRowIndex(index);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      String(index),
    );
  };

  const handleRowDragOver = (event) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";
  };

  const handleRowDrop = (
    event,
    targetIndex,
  ) => {
    event.preventDefault();

    if (
      draggedRowIndex === null
    ) {
      return;
    }

    if (
      draggedRowIndex === targetIndex
    ) {
      setDraggedRowIndex(null);

      return;
    }

    const reorderedRows = [...rows];

    const [movedRow] =
      reorderedRows.splice(
        draggedRowIndex,
        1,
      );

    reorderedRows.splice(
      targetIndex,
      0,
      movedRow,
    );

    setRows(reorderedRows);
    setDraggedRowIndex(null);

    clearMessages();

    scheduleAutosave(
      columns,
      reorderedRows,
    );
  };

  const handleRowDragEnd = () => {
    setDraggedRowIndex(null);
  };

  /*
   * ----------------------------------------
   * MANUAL SAVE
   * ----------------------------------------
   */

  const handleSaveChanges = async () => {
    if (autosaveTimerRef.current) {
      window.clearTimeout(
        autosaveTimerRef.current,
      );

      autosaveTimerRef.current = null;
    }

    await saveSheet(
      columns,
      rows,
    );
  };

  /*
   * ----------------------------------------
   * TOTALS
   * ----------------------------------------
   */

  const calculateTotal = (
    columnName,
  ) => {
    return rows.reduce(
      (total, row) => {
        const value = Number(
          String(
            row[columnName] ?? "",
          ).replace(/,/g, ""),
        );

        return Number.isFinite(value)
          ? total + value
          : total;
      },
      0,
    );
  };

  const hasIncomeColumn =
    columns.includes("Income");

  const hasExpenseColumn =
    columns.includes("Expense");

  /*
   * ----------------------------------------
   * RENDER
   * ----------------------------------------
   */

  return (
    <section>
      {/* HEADER */}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {sheet.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {columns.length} columns ·{" "}
            {rows.length} rows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SAVE STATUS */}

          <div className="mr-2 flex items-center">
            {isSaving ? (
              <span className="text-sm font-medium text-gray-500">
                Saving...
              </span>
            ) : error ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                  !
                </span>

                Save failed
              </span>
            ) : success === "Saved" ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-bold">
                  ✓
                </span>

                Saved
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs">
                  •
                </span>

                Unsaved changes
              </span>
            )}
          </div>

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
            {isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ADD COLUMN */}

      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row">
        <input
          type="text"
          value={newColumnName}
          onChange={(event) =>
            setNewColumnName(
              event.target.value,
            )
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

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
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

              {columns.map(
                (
                  columnName,
                  columnIndex,
                ) => (
                  <th
                    key={columnName}
                    draggable={
                      editingColumn !==
                      columnIndex
                    }
                    onContextMenu={(event) =>
                      handleColumnContextMenu(
                        event,
                        columnIndex,
                      )
                    }
                    onDragStart={(event) =>
                      handleColumnDragStart(
                        event,
                        columnIndex,
                      )
                    }
                    onDragOver={
                      handleColumnDragOver
                    }
                    onDrop={(event) =>
                      handleColumnDrop(
                        event,
                        columnIndex,
                      )
                    }
                    onDragEnd={
                      handleColumnDragEnd
                    }
                    className={`min-w-35 border-b border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 ${
                      draggedColumnIndex ===
                      columnIndex
                        ? "opacity-40"
                        : ""
                    }`}
                    title="Right-click for options"
                  >
                    {editingColumn ===
                    columnIndex ? (
                      <div className="flex min-w-35 flex-col gap-2">
                        <input
                          type="text"
                          value={columnName}
                          onChange={(event) =>
                            setColumnName(
                              event.target
                                .value,
                            )
                          }
                          autoFocus
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm font-normal outline-none focus:border-gray-500"
                          onKeyDown={(event) => {
                            if (
                              event.key ===
                              "Enter"
                            ) {
                              handleSaveColumnEdit(
                                columnIndex,
                              );
                            }

                            if (
                              event.key ===
                              "Escape"
                            ) {
                              handleCancelColumnEdit();
                            }
                          }}
                        />

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveColumnEdit(
                                columnIndex,
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
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map(
                (row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    draggable
                    onDragStart={(event) =>
                      handleRowDragStart(
                        event,
                        rowIndex,
                      )
                    }
                    onDragOver={
                      handleRowDragOver
                    }
                    onDrop={(event) =>
                      handleRowDrop(
                        event,
                        rowIndex,
                      )
                    }
                    onDragEnd={
                      handleRowDragEnd
                    }
                    className={`hover:bg-gray-50 ${
                      draggedRowIndex ===
                      rowIndex
                        ? "opacity-40"
                        : ""
                    }`}
                  >
                    <td
                      onContextMenu={(event) =>
                        handleRowContextMenu(
                          event,
                          rowIndex,
                        )
                      }
                      className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500"
                      title="Right-click for row options"
                    >
                      <div className="flex items-center gap-2">
                        <span className="cursor-grab select-none active:cursor-grabbing">
                          ⋮⋮
                        </span>

                        <span>
                          {rowIndex + 1}
                        </span>
                      </div>
                    </td>

                    {columns.map(
                      (columnName) => {
                        const isDate =
                          isDateColumn(
                            columnName,
                          );

                        const isActiveDateCell =
                          activeDateCell
                            ?.rowIndex ===
                            rowIndex &&
                          activeDateCell
                            ?.columnName ===
                            columnName;

                        return (
                          <td
                            key={columnName}
                            className="relative border-b border-r border-gray-200 p-0"
                          >
                            {isDate ? (
                              <>
                                <button
                                  type="button"
                                  draggable={false}
                                  data-row-index={
                                    rowIndex
                                  }
                                  data-column-name={
                                    columnName
                                  }
                                  onDragStart={(
                                    event,
                                  ) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                  }}
                                  onClick={(
                                    event,
                                  ) => {
                                    event.stopPropagation();

                                    handleOpenDatePicker(
                                      rowIndex,
                                      columnName,
                                      event,
                                    );
                                  }}
                                  className={`flex min-h-12 w-full min-w-35 items-center justify-between gap-2 bg-transparent px-4 py-3 text-left text-sm outline-none transition ${
                                    row[
                                      columnName
                                    ]
                                      ? "text-gray-700"
                                      : "text-gray-400"
                                  } hover:bg-gray-50 focus:bg-gray-50`}
                                >
                                  <span>
                                    {row[
                                      columnName
                                    ]
                                      ? formatDateForDisplay(
                                          row[
                                            columnName
                                          ],
                                        )
                                      : "Select date"}
                                  </span>

                                  <span
                                    className="text-base"
                                    aria-hidden="true"
                                  >
                                    📅
                                  </span>
                                </button>

                                {isActiveDateCell && (
                                  <DatePicker
                                    value={
                                      row[
                                        columnName
                                      ] || ""
                                    }
                                    anchorRect={
                                      datePickerPosition?.anchorRect
                                    }
                                    placement={
                                      datePickerPosition?.placement
                                    }
                                    onConfirm={(
                                      value,
                                    ) =>
                                      handleConfirmDate(
                                        rowIndex,
                                        columnName,
                                        value,
                                      )
                                    }
                                    onCancel={
                                      handleCancelDatePicker
                                    }
                                  />
                                )}
                              </>
                            ) : (
                              <input
                                type="text"
                                value={
                                  row[
                                    columnName
                                  ] ?? ""
                                }
                                data-row-index={
                                  rowIndex
                                }
                                data-column-name={
                                  columnName
                                }
                                onChange={(
                                  event,
                                ) =>
                                  handleCellChange(
                                    rowIndex,
                                    columnName,
                                    event
                                      .target
                                      .value,
                                  )
                                }
                                className="w-full min-w-35 bg-transparent px-4 py-3 text-sm text-gray-700 outline-none focus:bg-gray-50"
                              />
                            )}
                          </td>
                        );
                      },
                    )}
                  </tr>
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length + 1
                  }
                  className="px-4 py-12 text-center"
                >
                  <p className="text-sm font-medium text-gray-700">
                    No rows available
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Click "+ Add Row" to
                    add data to this
                    sheet.
                  </p>
                </td>
              </tr>
            )}
          </tbody>

          {/* TOTALS */}

          {(hasIncomeColumn ||
            hasExpenseColumn) && (
            <tfoot className="bg-gray-50">
              <tr>
                <td className="border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                  Total
                </td>

                {columns.map(
                  (columnName) => (
                    <td
                      key={columnName}
                      className="border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                    >
                      {columnName ===
                      "Income"
                        ? calculateTotal(
                            "Income",
                          ).toLocaleString()
                        : columnName ===
                            "Expense"
                          ? calculateTotal(
                              "Expense",
                            ).toLocaleString()
                          : ""}
                    </td>
                  ),
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Changes are automatically saved after
        1.5 seconds. You can also manually save
        using "Save Changes". Drag column
        headers left/right to reorder columns.
        Drag rows up/down to reorder rows.
        Right-click a column or row for
        available actions.
      </p>

      {/* CONTEXT MENU */}

      {contextMenu && (
        <div
          ref={contextMenuRef}
          onClick={(event) =>
            event.stopPropagation()
          }
          className="fixed z-50 min-w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          {contextMenu.type ===
            "column" && (
            <>
              <button
                type="button"
                onClick={() =>
                  handleStartColumnEdit(
                    contextMenu.index,
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
                    contextMenu.index,
                  )
                }
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Delete Column
              </button>
            </>
          )}

          {contextMenu.type ===
            "row" && (
            <>
              <button
                type="button"
                onClick={() =>
                  handleEditRow(
                    contextMenu.index,
                  )
                }
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Row
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteRow(
                    contextMenu.index,
                  )
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