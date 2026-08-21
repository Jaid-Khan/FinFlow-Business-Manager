import { useState } from "react";
import SheetList from "./components/sheets/SheetList";
import SheetTable from "./components/sheets/SheetTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");

  const [selectedSheet, setSelectedSheet] = useState(null);
  const [isBusinessReady, setIsBusinessReady] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setIsLoggedIn(true);
      setSuccess("Login successful.");

      await fetchBusinesses();
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    setBusinessLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch businesses");
      }

      setBusinesses(data.businesses || []);
    } catch (error) {
      console.error("Fetch businesses error:", error);
      setError(error.message || "Failed to fetch businesses");
    } finally {
      setBusinessLoading(false);
    }
  };

  const handleSelectBusiness = async (event) => {
    const businessId = event.target.value;

    setSelectedBusiness(businessId);
    setSelectedSheet(null);
    setIsBusinessReady(false);
    setError("");
    setSuccess("");

    if (!businessId) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/active-business`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          businessId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to select business");
      }

      setSuccess(`Active business: ${data.business.businessName}`);

      // Only allow SheetList to render after
      // active business has been successfully set.
      setIsBusinessReady(true);
    } catch (error) {
      console.error("Set active business error:", error);

      setSelectedBusiness("");
      setIsBusinessReady(false);

      setError(error.message || "Failed to select active business");
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

  if (isLoggedIn) {
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
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-700">
                No businesses found for this account.
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
                  value={selectedBusiness}
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

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}
          </div>

          {isBusinessReady && !selectedSheet && (
            <SheetList onSelectSheet={handleSelectSheet} />
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ExpenseFlow</h1>

          <p className="mt-2 text-sm text-gray-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
