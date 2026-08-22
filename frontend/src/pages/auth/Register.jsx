import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            ExpenseFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account to get started
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;