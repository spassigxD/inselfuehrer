"use client"

import { Button } from "@/components/ui/button"

export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-3xl">Die Fundliste ist gerade nicht da</h1>
      <p className="mt-3 text-muted-foreground">Beim Laden ist etwas schiefgelaufen.</p>
      <Button className="mt-6" onClick={reset}>
        Nochmal versuchen
      </Button>
    </main>
  )
}
