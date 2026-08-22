import { useState } from "react";
import { forgotPassword } from "../../services/authService";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(email);

      setSuccess(
        "If an account exists with this email, a password reset link has been sent.",
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);

      setError(error.message || "Failed to process password reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your registered email"
          autoComplete="email"
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
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}

export default ForgotPasswordForm;