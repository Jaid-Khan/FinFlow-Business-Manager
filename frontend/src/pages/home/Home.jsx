import { Link } from "react-router-dom";
import { useState } from "react";
import SheetList from "../../components/sheets/SheetList";
import SheetTable from "../../components/sheets/SheetTable";
import useBusiness from "../../hooks/useBusiness";

function Home() {
  const {
    businesses,
    selectBusiness,
    loading: businessLoading,
    error: businessError,
  } = useBusiness();

  const [selectedBusinessId, setSelectedBusinessId] = useState("");
  const [selectedSheet, setSelectedSheet] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSelectBusiness = async (event) => {
    const businessId = event.target.value;

    setSelectedBusinessId(businessId);
    setSelectedSheet(null);
    setSuccess("");
    setError("");

    if (!businessId) {
      return;
    }

    try {
      const business = await selectBusiness(businessId);

      setSuccess(
        `Active business: ${
          business?.businessName || "Business selected successfully"
        }`,
      );
    } catch (err) {
      console.error("Set active business error:", err);

      setSelectedBusinessId("");
      setError(err.message || "Failed to select active business");
    }
  };

  const handleSelectSheet = (sheet) => {
    setSelectedSheet(sheet);
    setError("");
    setSuccess("");
  };

  const handleBackToSheets = () => {
    setSelectedSheet(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ExpenseFlow</h1>

            <p className="mt-2 text-sm text-gray-500">
              Select your active business
            </p>
          </div>

          {businessLoading ? (
            <div className="rounded-lg bg-gray-50 px-4 py-4 text-center text-sm text-gray-500">
              Loading businesses...
            </div>
          ) : businesses.length === 0 ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-5">
              <p className="text-sm text-yellow-700">
                No businesses found for this account.
              </p>

              <Link
                to="/businesses/new"
                className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create Business
              </Link>
            </div>
          ) : (
            <div className="max-w-md">
              <label
                htmlFor="business"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Business
              </label>

              <select
                id="business"
                value={selectedBusinessId}
                onChange={handleSelectBusiness}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
              >
                <option value="">Select a business</option>

                {businesses.map((business) => (
                  <option key={business._id} value={business._id}>
                    {business.businessName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(error || businessError) && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error || businessError}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}
        </div>

        {selectedBusinessId && !selectedSheet && (
          <SheetList
            onSelectSheet={handleSelectSheet}
            activeBusinessId={selectedBusinessId}
          />
        )}

        {selectedSheet && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedSheet.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage sheet data.
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackToSheets}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ← Back to Sheets
              </button>
            </div>

            <SheetTable key={selectedSheet._id} sheet={selectedSheet} />
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;
