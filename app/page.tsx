import Link from "next/link"
import { Bug, Fish, Waves } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/categories"
import { crittersByCategory } from "@/lib/catalog"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

const icons: Record<Category, typeof Fish> = {
  fische: Fish,
  insekten: Bug,
  meerestiere: Waves,
}

const examples = [
  {
    href: "/fische?fundort=Meer&von=10.000&vonArt=mehr",
    title: "Fische im Meer, mehr als 10.000 Sternis",
    text: "Fundort Meer und Preis „mehr als 10.000“.",
  },
  {
    href: "/insekten?monat=11&uhr=16",
    title: "Insekten im November um 16 Uhr",
    text: "Monat November, aktiv in diesem Monat, Uhrzeit 16 Uhr.",
  },
]

export default function HomePage() {
  return (
    <main>
      <header className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">Animal Crossing: New Horizons</p>
        <h1 className="mt-2 font-heading text-4xl tracking-tight sm:text-5xl">
          Was ist gerade zu fangen?
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Drei Fundlisten für Fische, Insekten und Meerestiere. Stell Monat, Uhrzeit, Fundort
          und Preis zusammen. Die Nordhalbkugel ist voreingestellt, die Südhalbkugel lässt sich umschalten.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {(Object.keys(CATEGORIES) as Category[]).map((category) => {
          const meta = CATEGORIES[category]
          const Icon = icons[category]
          const count = crittersByCategory(category).length
          return (
            <li key={category}>
              <Card className="h-full">
                <CardHeader>
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <CardTitle className="font-heading text-2xl">{meta.title}</CardTitle>
                  <CardDescription>{meta.lead}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{count} Einträge</p>
                  <Link href={meta.href} className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                    {meta.title} ansehen
                  </Link>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>

      <section className="mt-10">
        <h2 className="font-heading text-2xl">Zwei Suchen zum Ausprobieren</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {examples.map((example) => (
            <li key={example.href}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{example.title}</CardTitle>
                  <CardDescription>{example.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={example.href} className={cn(buttonVariants({ variant: "secondary" }))}>
                    Suche öffnen
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
