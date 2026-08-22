function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;