import { useNavigate } from "react-router-dom";
import ProfileForm from "../../components/profile/ProfileForm";
import useAuth from "../../hooks/useAuth";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                View and update your profile information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>

          <ProfileForm />
        </div>
      </div>
    </div>
  );
}

export default Profile;