import { NavLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useSheets from "../../hooks/useSheets";

function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const { sheets, loading, error } = useSheets();

  const initials = (user?.name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const navLinkClasses = ({ isActive }) =>
    `block truncate rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* BRAND */}
      <div className="border-b border-gray-200 px-5 py-5">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="text-lg font-bold text-gray-900"
        >
          ExpenseFlow
        </NavLink>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={navLinkClasses}
        >
          Home
        </NavLink>

        <div className="mt-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Sheets
          </p>

          <div className="mt-2 space-y-1">
            {loading && (
              <p className="px-3 py-2 text-sm text-gray-400">
                Loading sheets...
              </p>
            )}

            {!loading && error && (
              <p className="px-3 py-2 text-sm text-red-500">
                {error}
              </p>
            )}

            {!loading && !error && sheets.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">
                No sheets yet.
              </p>
            )}

            {!loading &&
              !error &&
              sheets.map((sheet) => (
                <NavLink
                  key={sheet._id}
                  to={`/sheets/${sheet._id}`}
                  onClick={onNavigate}
                  className={navLinkClasses}
                  title={sheet.name}
                >
                  {sheet.name}
                </NavLink>
              ))}
          </div>
        </div>

        <div className="mt-5 border-t border-gray-200 pt-4">
          <NavLink
            to="/sheets/new"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="text-base leading-none">+</span>
            Create Custom Sheet
          </NavLink>
        </div>
      </nav>

      {/* PROFILE */}
      <NavLink
        to="/profile"
        onClick={onNavigate}
        className="flex items-center gap-3 border-t border-gray-200 px-4 py-4 transition hover:bg-gray-50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
          {initials || "U"}
        </span>

        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </span>

          <span className="block truncate text-xs text-gray-500">
            {user?.email || ""}
          </span>
        </span>
      </NavLink>
    </aside>
  );
}

export default Sidebar;
