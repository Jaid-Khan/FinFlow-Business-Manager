import { useNavigate } from "react-router-dom";
import BusinessForm from "../../components/business/BusinessForm";

function CreateBusiness() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/businesses");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Business
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add a new business to your ExpenseFlow account.
            </p>
          </div>

          <BusinessForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}

export default CreateBusiness;