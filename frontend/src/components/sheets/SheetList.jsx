import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SheetList({ onSelectSheet }) {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSheets = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/sheets`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch sheets");
        }

        if (isMounted) {
          setSheets(data.sheets || []);
          setError("");
        }
      } catch (error) {
        console.error("Fetch sheets error:", error);

        if (isMounted) {
          setError(error.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSheets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Loading sheets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Sheets
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select a sheet to view and manage its data.
        </p>
      </div>

      {sheets.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-base font-medium text-gray-900">
            No sheets available
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            This business does not have any sheets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <button
              key={sheet._id}
              type="button"
              onClick={() => onSelectSheet(sheet)}
              className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {sheet.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {sheet.columns?.length || 0} columns
                  </p>
                </div>

                <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {sheet.rows?.length || 0} rows
                </span>
              </div>

              <div className="mt-4 text-sm font-medium text-gray-700">
                Open Sheet →
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default SheetList;