"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4 text-red-500">{error.message}</p>
      <button
        className="px-4 py-2 bg-indigo-600 rounded-md"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
