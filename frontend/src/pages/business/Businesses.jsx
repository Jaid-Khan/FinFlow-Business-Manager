import { Link } from "react-router-dom";
import useBusiness from "../../hooks/useBusiness";
import { deleteBusiness } from "../../services/businessService";

function Businesses() {
  const {
    businesses,
    loading,
    error,
    loadBusinesses,
  } = useBusiness();

  const handleRefresh = async () => {
    try {
      await loadBusinesses();
    } catch (err) {
      console.error("Refresh businesses error:", err);
    }
  };

  const handleDelete = async (business) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${business.businessName}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBusiness(business._id);

      await loadBusinesses();
    } catch (err) {
      console.error("Delete business error:", err);

      window.alert(
        err.message || "Failed to delete business.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Businesses
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your businesses.
            </p>
          </div>

          <Link
            to="/businesses/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Create Business
          </Link>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading businesses...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && businesses.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No businesses found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first business to get started.
            </p>

            <Link
              to="/businesses/new"
              className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              Create Business
            </Link>
          </div>
        )}

        {!loading && !error && businesses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div
                key={business._id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {business.businessName}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {business.businessType || "General Business"}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/businesses/${business._id}/edit`}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(business)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Businesses;