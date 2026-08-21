import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SheetTable({ sheet }) {
  const [rows, setRows] = useState(() => sheet.rows || []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddRow = () => {
    const newRow = {};

    sheet.columns.forEach((columnName) => {
      newRow[columnName] = "";
    });

    setRows((currentRows) => [...currentRows, newRow]);
    setError("");
    setSuccess("");
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

    setError("");
    setSuccess("");
  };

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

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {sheet.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {sheet.columns.length} columns · {rows.length} rows
          </p>
        </div>

        <div className="flex gap-2">
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

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-max border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                #
              </th>

              {sheet.columns.map((columnName) => (
                <th
                  key={columnName}
                  className="border-b border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50"
                >
                  <td className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                    {rowIndex + 1}
                  </td>

                  {sheet.columns.map((columnName) => (
                    <td
                      key={columnName}
                      className="border-b border-r border-gray-200 p-0"
                    >
                      <input
                        type="text"
                        value={row[columnName] ?? ""}
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
                  colSpan={sheet.columns.length + 1}
                  className="px-4 py-12 text-center"
                >
                  <p className="text-sm font-medium text-gray-700">
                    No rows available
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Click "+ Add Row" to add data to this sheet.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SheetTable;