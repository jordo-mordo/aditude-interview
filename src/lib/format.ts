// Derive up-to-two-letter initials from a name, for avatar tiles.
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Curated gradient pairs for avatar tiles. Full class strings (not interpolated)
// so Tailwind's JIT can detect and generate them.
const AVATAR_GRADIENTS = [
  "from-rose-500 to-pink-500",
  "from-orange-500 to-amber-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
  "from-sky-500 to-blue-500",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-sky-500",
]

// Pick a stable gradient for a given seed (e.g. a user or org id), so each
// entity keeps the same color across renders.
export function avatarGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}
