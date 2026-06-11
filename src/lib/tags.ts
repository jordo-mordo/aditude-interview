// Publisher verticals — the kinds of content sites an ad-monetization platform
// like Aditude typically serves. Stored as a plain string on Publisher.tag
// (SQLite has no enums) and validated against this list in the API.

export const PUBLISHER_TAGS = [
  "NEWS",
  "SPORTS",
  "GAMING",
  "ENTERTAINMENT",
  "TECHNOLOGY",
  "FINANCE",
  "LIFESTYLE",
  "FOOD",
  "OTHER",
] as const

export type PublisherTag = (typeof PUBLISHER_TAGS)[number]

export const TAG_LABELS: Record<PublisherTag, string> = {
  NEWS: "News",
  SPORTS: "Sports",
  GAMING: "Gaming",
  ENTERTAINMENT: "Entertainment",
  TECHNOLOGY: "Technology",
  FINANCE: "Finance",
  LIFESTYLE: "Lifestyle",
  FOOD: "Food & Drink",
  OTHER: "Other",
}

// Icon-tile color per tag. Full class strings so Tailwind's JIT can detect them.
export const TAG_TONE: Record<PublisherTag, string> = {
  NEWS: "bg-blue-50 text-blue-600",
  SPORTS: "bg-emerald-50 text-emerald-600",
  GAMING: "bg-violet-50 text-violet-600",
  ENTERTAINMENT: "bg-pink-50 text-pink-600",
  TECHNOLOGY: "bg-sky-50 text-sky-600",
  FINANCE: "bg-green-50 text-green-600",
  LIFESTYLE: "bg-rose-50 text-rose-600",
  FOOD: "bg-amber-50 text-amber-600",
  OTHER: "bg-slate-100 text-slate-500",
}
