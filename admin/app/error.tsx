"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi"; // Importing an alert icon from React Icons

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center text-center p-6">
      <div className=" p-8 rounded-lg  max-w-md w-full">
        <div className="flex justify-center mb-4">
          <FiAlertCircle className="text-red-500 text-6xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
