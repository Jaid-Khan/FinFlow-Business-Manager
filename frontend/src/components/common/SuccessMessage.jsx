function SuccessMessage({ message, className = "" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 ${className}`}
    >
      {message}
    </div>
  );
}

export default SuccessMessage;