import type { Critter, Filters } from "./types"

export const defaultFilters: Filters = {
  hemisphere: "nord",
  month: null,
  monthMode: "aktiv",
  hour: null,
  location: null,
  priceMin: "",
  priceMinCompare: "mindestens",
  priceMax: "",
  priceMaxCompare: "hoechstens",
}

export function priceBound(input: string): { value: number | null; invalid: boolean } {
  const trimmed = input.trim()
  if (!trimmed) return { value: null, invalid: false }
  const digits = trimmed.replace(/[.\s]/g, "").replace(/,/g, "")
  if (!/^\d+$/.test(digits)) return { value: null, invalid: true }
  return { value: Number(digits), invalid: false }
}

/**
 * Guide hours are half-open: 9–16 runs until 16:00, and 16–9 starts at 16:00.
 * A window may wrap past midnight.
 */
export function matchesCritter(critter: Critter, filters: Filters): boolean {
  const windows = filters.hemisphere === "sued" ? critter.south : critter.north

  if (filters.location && critter.location !== filters.location) return false

  const min = priceBound(filters.priceMin)
  if (!min.invalid && min.value != null) {
    if (critter.price == null) return false
    const above =
      filters.priceMinCompare === "mehr" ? critter.price > min.value : critter.price >= min.value
    if (!above) return false
  }

  const max = priceBound(filters.priceMax)
  if (!max.invalid && max.value != null) {
    if (critter.price == null) return false
    const below =
      filters.priceMaxCompare === "weniger"
        ? critter.price < max.value
        : critter.price <= max.value
    if (!below) return false
  }

  if (filters.month == null && filters.hour == null) return true

  if (filters.month != null && filters.monthMode === "nur") {
    const months = new Set(windows.flatMap((window) => window.months))
    if (months.size !== 1 || !months.has(filters.month)) return false
  }

  return windows.some((window) => {
    const monthOk = filters.month == null || window.months.includes(filters.month)
    const hourOk = filters.hour == null || window.hours.includes(filters.hour)
    return monthOk && hourOk
  })
}

export function filterCritters(critters: Critter[], filters: Filters): Critter[] {
  return critters.filter((critter) => matchesCritter(critter, filters))
}

export function locationsOf(critters: Critter[]): string[] {
  return [...new Set(critters.map((critter) => critter.location))].sort((a, b) =>
    a.localeCompare(b, "de"),
  )
}
