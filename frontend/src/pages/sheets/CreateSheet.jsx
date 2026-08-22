import { useNavigate } from "react-router-dom";

import CreateSheetForm from "../../components/sheets/CreateSheetForm";
import useSheets from "../../hooks/useSheets";

function CreateSheet() {
  const navigate = useNavigate();
  const { addSheet } = useSheets();

  const handleCreated = (sheet) => {
    addSheet(sheet);
    navigate(`/sheets/${sheet._id}`, { replace: true });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create Custom Sheet
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Give your sheet a name and define its columns. You can
              add, remove, or reorder columns later from the sheet
              itself.
            </p>
          </div>

          <CreateSheetForm onCreated={handleCreated} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}

export default CreateSheet;
