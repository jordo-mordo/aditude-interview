// Accessible error banner. Renders in an alert region and can offer a retry action.
export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded border border-red-300 px-2 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          Retry
        </button>
      )}
    </div>
  )
}
