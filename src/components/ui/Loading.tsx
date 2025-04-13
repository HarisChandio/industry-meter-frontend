// Beautiful loading component
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-surface-dark rounded-full animate-spin border-t-accent-color"></div>
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin border-t-accent-color"></div>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-secondary">Loading...</p>
      <p className="mt-2 text-sm text-secondary">
        Please wait while we prepare your experience
      </p>
    </div>
  );
}
