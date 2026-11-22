import { defaultFilters } from "./filter"
import type { Filters } from "./types"

export function parseFilters(params: URLSearchParams): Filters {
  const hemisphere = params.get("halbkugel") === "sued" ? "sued" : "nord"
  const month = boundedInteger(params.get("monat"), 1, 12)
  const hour = boundedInteger(params.get("uhr"), 0, 23)
  const location = params.get("fundort")

  return {
    hemisphere,
    month,
    monthMode: params.get("monatsart") === "nur" ? "nur" : "aktiv",
    hour,
    location: location && location.trim() ? location : null,
    priceMin: params.get("von") ?? "",
    priceMinCompare: params.get("vonArt") === "mehr" ? "mehr" : "mindestens",
    priceMax: params.get("bis") ?? "",
    priceMaxCompare: params.get("bisArt") === "weniger" ? "weniger" : "hoechstens",
  }
}

export function serializeFilters(filters: Filters): string {
  const params = new URLSearchParams()
  if (filters.hemisphere !== defaultFilters.hemisphere) params.set("halbkugel", filters.hemisphere)
  if (filters.month != null) params.set("monat", String(filters.month))
  if (filters.month != null && filters.monthMode === "nur") params.set("monatsart", "nur")
  if (filters.hour != null) params.set("uhr", String(filters.hour))
  if (filters.location) params.set("fundort", filters.location)
  if (filters.priceMin.trim()) params.set("von", filters.priceMin.trim())
  if (filters.priceMin.trim() && filters.priceMinCompare === "mehr") params.set("vonArt", "mehr")
  if (filters.priceMax.trim()) params.set("bis", filters.priceMax.trim())
  if (filters.priceMax.trim() && filters.priceMaxCompare === "weniger") {
    params.set("bisArt", "weniger")
  }
  return params.toString()
}

function boundedInteger(value: string | null, min: number, max: number): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const parsed = Number(value)
  if (parsed < min || parsed > max) return null
  return parsed
}
