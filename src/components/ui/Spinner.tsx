// Simple accessible loading spinner.
export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-2 text-slate-500">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
        aria-hidden="true"
      />
      <span className="text-sm">{label}…</span>
    </span>
  )
}

// Centered page-level loading state.
export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex justify-center py-16">
      <Spinner label={label} />
    </div>
  )
}
