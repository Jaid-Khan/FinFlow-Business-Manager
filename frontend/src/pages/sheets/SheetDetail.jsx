import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SheetTable from "../../components/sheets/SheetTable";
import DeleteSheetModal from "../../components/sheets/DeleteSheetModal";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import { getSheet } from "../../services/sheetService";
import useSheets from "../../hooks/useSheets";

function SheetDetail() {
  const { sheetId } = useParams();
  const navigate = useNavigate();
  const { removeSheet } = useSheets();

  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSheet = async () => {
      setLoading(true);
      setError("");
      setSheet(null);

      try {
        const data = await getSheet(sheetId);

        if (isMounted) {
          setSheet(data.sheet);
        }
      } catch (error) {
        console.error("Fetch sheet error:", error);

        if (isMounted) {
          setError(error.message || "Failed to load sheet");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSheet();

    return () => {
      isMounted = false;
    };
  }, [sheetId]);

  const handleDeleted = (deletedSheetId) => {
    removeSheet(deletedSheetId);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        {loading && <Loading message="Loading sheet..." />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && sheet && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete Sheet
              </button>
            </div>

            <SheetTable key={sheet._id} sheet={sheet} />

            <DeleteSheetModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              sheet={sheet}
              onDeleted={handleDeleted}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default SheetDetail;
