"use client"

import { SearchX, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { CritterCard } from "@/components/critter-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { CATEGORIES, MONTH_NAMES } from "@/lib/categories"
import { defaultFilters, filterCritters, locationsOf, priceBound } from "@/lib/filter"
import { describeSelection } from "@/lib/format"
import { fishSeaOver10000, insectsNovemberAt16 } from "@/lib/presets"
import { parseFilters, serializeFilters } from "@/lib/query"
import type { Category, Critter, Filters } from "@/lib/types"

const monthItems = [
  { value: "alle", label: "Alle Monate" },
  ...MONTH_NAMES.map((label, index) => ({ value: String(index + 1), label })),
]

const hourItems = [
  { value: "alle", label: "Jede Uhrzeit" },
  ...Array.from({ length: 24 }, (_, hour) => ({
    value: String(hour),
    label: `${hour} Uhr`,
  })),
]

const minCompareItems = [
  { value: "mindestens", label: "mindestens" },
  { value: "mehr", label: "mehr als" },
]

const maxCompareItems = [
  { value: "hoechstens", label: "höchstens" },
  { value: "weniger", label: "weniger als" },
]

const optionClass = "min-h-11 py-2.5 text-base"
const fieldClass = "w-full text-base data-[size=default]:h-12"

function activeFilterCount(filters: Filters): number {
  let count = 0
  if (filters.hemisphere === "sued") count += 1
  if (filters.month != null) count += 1
  if (filters.hour != null) count += 1
  if (filters.location) count += 1
  if (filters.priceMin.trim()) count += 1
  if (filters.priceMax.trim()) count += 1
  return count
}

export function CritterBrowser({
  critters,
  category,
}: {
  critters: Critter[]
  category: Category
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState<Filters>(() => parseFilters(searchParams))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const latestQuery = useRef(searchParams.toString())
  const ownQueries = useRef(new Set([searchParams.toString()]))
  const urlTimer = useRef<number | null>(null)
  const meta = CATEGORIES[category]
  const locations = useMemo(() => locationsOf(critters), [critters])
  const locationItems = useMemo(
    () => [{ value: "alle", label: "Alle Fundorte" }, ...locations.map((location) => ({ value: location, label: location }))],
    [locations],
  )

  useEffect(() => {
    const incoming = searchParams.toString()
    if (incoming === latestQuery.current || ownQueries.current.has(incoming)) return
    latestQuery.current = incoming
    ownQueries.current.add(incoming)
    setFilters(parseFilters(searchParams))
  }, [searchParams])

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      const incoming = params.toString()
      latestQuery.current = incoming
      ownQueries.current.add(incoming)
      setFilters(parseFilters(params))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const minPrice = priceBound(filters.priceMin)
  const maxPrice = priceBound(filters.priceMax)
  const results = filterCritters(critters, filters)
  const summary = describeSelection(filters, meta.noun)

  function commit(next: Filters, immediate = true) {
    setFilters(next)
    const write = () => {
      const query = serializeFilters(next)
      latestQuery.current = query
      ownQueries.current.add(query)
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }
    if (urlTimer.current != null) window.clearTimeout(urlTimer.current)
    if (immediate) write()
    else urlTimer.current = window.setTimeout(write, 250)
  }

  function update(partial: Partial<Filters>, immediate = true) {
    commit({ ...filters, ...partial }, immediate)
  }

  const preset =
    category === "fische"
      ? { label: "Meer, mehr als 10.000 Sternis", filters: fishSeaOver10000 }
      : category === "insekten"
        ? { label: "November, 16 Uhr", filters: insectsNovemberAt16 }
        : {
            label: "Mehr als 10.000 Sternis",
            filters: { ...defaultFilters, priceMin: "10.000", priceMinCompare: "mehr" as const },
          }

  const activeFilters = activeFilterCount(filters)

  return (
    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6">
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 min-w-0 border-b border-border/80 bg-background/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 font-heading text-lg leading-tight" aria-live="polite">
            {results.length} Treffer
          </p>
          <Button
            type="button"
            className="h-11 shrink-0 px-3"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal />
            {filtersOpen ? "Fertig" : "Filter"}
            {activeFilters > 0 ? (
              <span className="grid size-5 place-items-center rounded-full bg-primary-foreground/20 text-xs">
                {activeFilters}
              </span>
            ) : null}
          </Button>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{summary}</p>
      </div>

      {filtersOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/25 lg:hidden"
          aria-label="Filter schließen"
          onClick={() => setFiltersOpen(false)}
        />
      ) : null}

      <form
        className={cn(
          "grid gap-5 bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-24 lg:rounded-2xl",
          filtersOpen
            ? "fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-50 overflow-y-auto rounded-t-3xl shadow-2xl lg:static lg:inset-auto lg:z-auto lg:overflow-visible lg:rounded-2xl lg:shadow-none"
            : "hidden lg:grid",
        )}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid gap-2">
          <p className="text-sm font-medium">Beispielsuche</p>
          <Button type="button" variant="secondary" className="h-12 w-full whitespace-normal px-3 text-base" onClick={() => commit(preset.filters)}>
            {preset.label}
          </Button>
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium">Halbkugel</legend>
          <ToggleGroup
            value={[filters.hemisphere]}
            onValueChange={(values) => {
              const next = values.at(-1)
              if (next === "nord" || next === "sued") update({ hemisphere: next })
            }}
            className="w-full"
            spacing={2}
          >
            <ToggleGroupItem value="nord" className="h-12 flex-1 bg-secondary whitespace-normal px-2 text-center text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground">
              Nordhalbkugel
            </ToggleGroupItem>
            <ToggleGroupItem value="sued" className="h-12 flex-1 bg-secondary whitespace-normal px-2 text-center text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground">
              Südhalbkugel
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Die deutschen Listen gehen von der Nordhalbkugel aus. Die Südhalbkugel steht auf denselben Seiten.
          </p>
        </fieldset>

        <div className="grid gap-2">
          <Label htmlFor="monat">Monat</Label>
          <Select
            value={filters.month == null ? "alle" : String(filters.month)}
            items={monthItems}
            onValueChange={(value) => {
              if (value == null) return
              update({ month: value === "alle" ? null : Number(value) })
            }}
          >
            <SelectTrigger id="monat" className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false} className="max-h-72">
              {monthItems.map((item) => (
                <SelectItem key={item.value} value={item.value} className={optionClass}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.month != null ? (
            <ToggleGroup
              value={[filters.monthMode]}
              onValueChange={(values) => {
                const next = values.at(-1)
                if (next === "aktiv" || next === "nur") update({ monthMode: next })
              }}
              className="w-full flex-col items-stretch"
              spacing={2}
              aria-label="Wie der Monat gilt"
            >
              <ToggleGroupItem value="aktiv" className="h-12 w-full justify-start px-3 text-base aria-pressed:bg-primary aria-pressed:text-primary-foreground">
                Aktiv in diesem Monat
              </ToggleGroupItem>
              <ToggleGroupItem value="nur" className="h-12 w-full justify-start px-3 text-base aria-pressed:bg-primary aria-pressed:text-primary-foreground">
                Nur diesen Monat
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="uhr">Uhrzeit</Label>
          <Select
            value={filters.hour == null ? "alle" : String(filters.hour)}
            items={hourItems}
            onValueChange={(value) => {
              if (value == null) return
              update({ hour: value === "alle" ? null : Number(value) })
            }}
          >
            <SelectTrigger id="uhr" className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false} className="max-h-72">
              {hourItems.map((item) => (
                <SelectItem key={item.value} value={item.value} className={optionClass}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p id="uhr-hinweis" className="text-xs leading-relaxed text-muted-foreground">
            16 Uhr meint 16:00. Ein Fenster 9–16 endet davor, 16–9 beginnt dann und geht über Mitternacht.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fundort">Fundort</Label>
          <Select
            value={filters.location ?? "alle"}
            items={locationItems}
            onValueChange={(value) => {
              if (value == null) return
              update({ location: value === "alle" ? null : value })
            }}
          >
            <SelectTrigger id="fundort" className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false} className="max-h-72">
              {locationItems.map((item) => (
                <SelectItem key={item.value} value={item.value} className={optionClass}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Preis in Sternis</legend>
          <div className="grid gap-2">
            <Label htmlFor="preis-von">Von</Label>
            <Select
              value={filters.priceMinCompare}
              items={minCompareItems}
              onValueChange={(value) => {
                if (value === "mindestens" || value === "mehr") update({ priceMinCompare: value })
              }}
            >
              <SelectTrigger id="preis-von-art" className={fieldClass} aria-label="Vergleich für den Mindestpreis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {minCompareItems.map((item) => (
                  <SelectItem key={item.value} value={item.value} className={optionClass}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="preis-von"
              inputMode="numeric"
              placeholder="z. B. 1000"
              value={filters.priceMin}
              aria-invalid={minPrice.invalid}
              onChange={(event) => update({ priceMin: event.target.value }, false)}
              className="h-12 text-base"
            />
            {minPrice.invalid ? (
              <p className="text-xs text-destructive">Bitte eine Zahl eingeben, zum Beispiel 10.000.</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preis-bis">Bis</Label>
            <Select
              value={filters.priceMaxCompare}
              items={maxCompareItems}
              onValueChange={(value) => {
                if (value === "hoechstens" || value === "weniger") update({ priceMaxCompare: value })
              }}
            >
              <SelectTrigger id="preis-bis-art" className={fieldClass} aria-label="Vergleich für den Höchstpreis">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {maxCompareItems.map((item) => (
                  <SelectItem key={item.value} value={item.value} className={optionClass}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="preis-bis"
              inputMode="numeric"
              placeholder="optional"
              value={filters.priceMax}
              aria-invalid={maxPrice.invalid}
              onChange={(event) => update({ priceMax: event.target.value }, false)}
              className="h-12 text-base"
            />
            {maxPrice.invalid ? (
              <p className="text-xs text-destructive">Bitte eine Zahl eingeben.</p>
            ) : null}
          </div>
        </fieldset>

        <div className="grid gap-2 border-t border-border/80 pt-3 lg:border-0 lg:pt-0">
          <Button type="button" className="h-12 w-full text-base lg:hidden" onClick={() => setFiltersOpen(false)}>
            {results.length} Treffer anzeigen
          </Button>
          <Button type="button" variant="outline" className="h-12 w-full text-base" onClick={() => commit(defaultFilters)}>
            Filter zurücksetzen
          </Button>
        </div>
      </form>

      <section className="min-w-0" aria-label={meta.title}>
        <div className="mb-4 hidden lg:block">
          <p className="font-heading text-2xl" aria-live="polite">
            {results.length} Treffer von {critters.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
        </div>

        {critters.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
            <h2 className="font-heading text-xl">Noch keine Einträge</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Für diese Übersicht liegen keine Daten vor.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
            <SearchX className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-3 font-heading text-xl">Keine Treffer</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Für diese Kombination aus Monat, Uhrzeit, Fundort und Preis ist nichts in der Liste.
            </p>
            <Button type="button" className="mt-5 h-12 px-5 text-base" onClick={() => commit(defaultFilters)}>
              Filter zurücksetzen
            </Button>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {results.map((critter) => (
              <li key={critter.id}>
                <CritterCard critter={critter} hemisphere={filters.hemisphere} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
