function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  autoComplete,
  required = false,
  disabled = false,
  error = "",
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;