import {
  flexRender,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

function SheetTable({ sheet }) {
  const columns = sheet.columns.map((columnName) => ({
    accessorKey: columnName,
    header: columnName,
    cell: ({ getValue }) => getValue() ?? "",
  }));

  const data = sheet.rows || [];

  const features = tableFeatures({});

  const table = useTable({
    data,
    columns,
    features,
  });

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-max border-collapse text-left">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-r border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-r border-gray-200 px-4 py-3 text-sm text-gray-700"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-gray-500"
              >
                No rows available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SheetTable;