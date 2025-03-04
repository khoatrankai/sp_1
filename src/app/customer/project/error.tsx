"use client";
import ErrorCustomer from "@/components/Error/Error";

// Error boundaries must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <ErrorCustomer handleBtn={reset} value={error.message} />
    </div>
  );
}
