import { useState } from "react";

import Modal from "../common/Modal";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

import { deleteSheet } from "../../services/sheetService";

function DeleteSheetModal({ isOpen, onClose, sheet, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setError("");
    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!sheet) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await deleteSheet(sheet._id);

      onDeleted(sheet._id);
    } catch (error) {
      console.error("Delete sheet error:", error);

      setError(error.message || "Failed to delete sheet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Sheet"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-medium text-gray-900">
          {sheet?.name}
        </span>
        ? This will permanently remove the sheet and all of its data.
        This action cannot be undone.
      </p>

      {error && <ErrorMessage message={error} className="mt-4" />}
    </Modal>
  );
}

export default DeleteSheetModal;
