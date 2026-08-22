import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-6xl font-bold text-gray-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Home
          </Link>

          <Link
            to="/profile"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;