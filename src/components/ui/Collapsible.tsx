"use client"

import { useEffect, useState } from "react"

// Mounts children with a slide-down enter animation and keeps them mounted
// through a slide-up exit animation before unmounting. `durationMs` must match
// the .animate-slide-down / .animate-slide-up timing in globals.css.
export function Collapsible({
  open,
  durationMs = 400,
  children,
}: {
  open: boolean
  durationMs?: number
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(open)

  useEffect(() => {
    if (open) {
      setRendered(true)
      return
    }
    // Delay unmount until the exit animation has finished.
    const timer = setTimeout(() => setRendered(false), durationMs)
    return () => clearTimeout(timer)
  }, [open, durationMs])

  if (!rendered) return null

  return <div className={open ? "animate-slide-down" : "animate-slide-up"}>{children}</div>
}
