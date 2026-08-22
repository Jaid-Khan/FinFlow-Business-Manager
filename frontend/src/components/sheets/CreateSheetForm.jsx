import { useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import { createSheet } from "../../services/sheetService";

const DEFAULT_STARTER_COLUMNS = ["Date", "Description", "Amount"];

function CreateSheetForm({ onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [columns, setColumns] = useState(DEFAULT_STARTER_COLUMNS);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleColumnChange = (index, value) => {
    setColumns((currentColumns) =>
      currentColumns.map((column, columnIndex) =>
        columnIndex === index ? value : column
      )
    );
  };

  const handleAddColumnField = () => {
    setColumns((currentColumns) => [...currentColumns, ""]);
  };

  const handleRemoveColumnField = (index) => {
    setColumns((currentColumns) =>
      currentColumns.filter((_, columnIndex) => columnIndex !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Sheet name is required.");
      return;
    }

    const trimmedColumns = columns
      .map((column) => column.trim())
      .filter((column) => column.length > 0);

    if (trimmedColumns.length === 0) {
      setError("Add at least one column.");
      return;
    }

    const normalizedColumns = trimmedColumns.map((column) =>
      column.toLowerCase()
    );

    const hasDuplicates =
      new Set(normalizedColumns).size !== normalizedColumns.length;

    if (hasDuplicates) {
      setError("Column names must be unique.");
      return;
    }

    setIsSaving(true);

    try {
      const data = await createSheet({
        name: trimmedName,
        columns: trimmedColumns,
        rows: [],
      });

      onCreated(data.sheet);
    } catch (error) {
      console.error("Create sheet error:", error);

      setError(error.message || "Failed to create sheet");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="sheetName"
        label="Sheet Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="e.g. Vendor Payments"
        required
      />

      <div>
        <p className="mb-2 block text-sm font-medium text-gray-700">
          Columns
        </p>

        <div className="space-y-2">
          {columns.map((column, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={column}
                onChange={(event) =>
                  handleColumnChange(index, event.target.value)
                }
                placeholder={`Column ${index + 1}`}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-gray-500"
              />

              <button
                type="button"
                onClick={() => handleRemoveColumnField(index)}
                disabled={columns.length === 1}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Remove column ${index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddColumnField}
          className="mt-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          + Add another column
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        )}

        <Button type="submit" loading={isSaving}>
          Create Sheet
        </Button>
      </div>
    </form>
  );
}

export default CreateSheetForm;
