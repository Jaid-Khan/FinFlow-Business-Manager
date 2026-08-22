import { Link } from "react-router-dom";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            ExpenseFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new password for your account
          </p>
        </div>

        <ResetPasswordForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;