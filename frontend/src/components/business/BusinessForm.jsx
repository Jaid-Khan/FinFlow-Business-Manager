import { useState } from "react";
import { createBusiness } from "../../services/businessService";

function BusinessForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
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

    try {
      const data = await createBusiness(formData);

      setSuccess(
        data.message || "Business created successfully.",
      );

      if (onSuccess) {
        onSuccess(data.business);
      }
    } catch (error) {
      console.error("Create business error:", error);

      setError(error.message || "Failed to create business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="businessName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Business Name
        </label>

        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Enter business name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="businessType"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Business Type
        </label>

        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500"
        >
          <option value="">Select business type</option>
          <option value="General Business">General Business</option>
          <option value="Cyber Cafe">Cyber Cafe</option>
          <option value="Grocery">Grocery</option>
          <option value="Medical Store">Medical Store</option>
        </select>
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
        {loading ? "Creating Business..." : "Create Business"}
      </button>
    </form>
  );
}

export default BusinessForm;