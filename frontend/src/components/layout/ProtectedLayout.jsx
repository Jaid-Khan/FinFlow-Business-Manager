import { Outlet } from "react-router-dom";

function ProtectedLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

export default ProtectedLayout;