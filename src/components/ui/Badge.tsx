type BadgeTone = "slate" | "blue" | "green" | "amber" | "purple"

const toneClasses: Record<BadgeTone, string> = {
  slate: "bg-slate-50 text-slate-600 ring-slate-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}

// Consistent color coding for the system role, org role, and permission badges.
export function roleTone(role: string): BadgeTone {
  switch (role) {
    case "ADMIN":
    case "OWNER":
      return "purple"
    case "PUBLISH":
      return "green"
    case "EDIT":
      return "blue"
    default:
      return "slate"
  }
}
