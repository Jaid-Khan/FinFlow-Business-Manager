import { Navigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import useAuth from "../../hooks/useAuth";

function Login() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            ExpenseFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

export default Login;