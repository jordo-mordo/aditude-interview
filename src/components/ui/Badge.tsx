type BadgeTone = "slate" | "blue" | "green" | "amber" | "purple"

const toneClasses: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-800",
  purple: "bg-purple-100 text-purple-700",
}

export function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
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
