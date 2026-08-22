import { Link, useNavigate, useParams } from "react-router-dom";
import BusinessForm from "../../components/business/BusinessForm";

function EditBusiness() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/businesses");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4">
          <Link
            to="/businesses"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Businesses
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Business
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Update your business information.
            </p>
          </div>

          <BusinessForm
            businessId={id}
            mode="edit"
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default EditBusiness;