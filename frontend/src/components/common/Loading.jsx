function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
      <p className="text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
}

export default Loading;