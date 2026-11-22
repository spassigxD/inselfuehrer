"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bug, Fish, Waves } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/fische", label: "Fische", icon: Fish },
  { href: "/insekten", label: "Insekten", icon: Bug },
  { href: "/meerestiere", label: "Meerestiere", icon: Waves },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex h-11 items-center font-heading text-xl tracking-tight text-foreground"
          >
            Inselführer
          </Link>
          <nav aria-label="Übersichten" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-11 items-center rounded-full px-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <nav
        aria-label="Übersichten"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <ul className="grid grid-cols-3">
          {links.map((link) => {
            const active = pathname === link.href
            const Icon = link.icon
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
