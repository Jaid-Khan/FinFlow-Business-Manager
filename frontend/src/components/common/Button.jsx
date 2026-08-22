function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger:
      "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;