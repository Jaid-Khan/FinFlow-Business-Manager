import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, formData.password);

      setSuccess(
        "Password reset successful. Redirecting you to the sign in page...",
      );

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your new password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
          autoComplete="new-password"
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
        {loading ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
}

export default ResetPasswordForm;