import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../services/userService";
import useAuth from "../../hooks/useAuth";

function ProfileForm() {
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        const currentUser = data.user || {};

        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
        });

        setUser(currentUser);
      } catch (error) {
        console.error("Fetch profile error:", error);

        if (isMounted) {
          setError(error.message || "Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await updateCurrentUser({
        name: formData.name,
        email: formData.email,
      });

      const updatedUser = data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      setSuccess(data.message || "Profile updated successfully.");
    } catch (error) {
      console.error("Update profile error:", error);

      setError(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
        />
      </div>

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
          value={formData.email}
          onChange={handleChange}
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
        disabled={saving}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default ProfileForm;