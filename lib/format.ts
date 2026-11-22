import { MONTH_NAMES } from "./categories"
import type { AvailabilityWindow, Filters } from "./types"

export function formatMonths(months: number[]): string {
  if (months.length === 0) return "Unbekannt"
  if (months.length === 12) return "Ganzjährig"

  const parts: string[] = []
  let start = months[0]
  let previous = months[0]

  const flush = (from: number, to: number) => {
    const fromName = MONTH_NAMES[from - 1]
    const toName = MONTH_NAMES[to - 1]
    parts.push(from === to ? fromName : `${fromName}–${toName}`)
  }

  for (const month of months.slice(1)) {
    const consecutive = month === previous + 1 || (previous === 12 && month === 1)
    if (consecutive) {
      previous = month
      continue
    }
    flush(start, previous)
    start = month
    previous = month
  }

  flush(start, previous)
  return parts.join(", ")
}

export function formatHours(hours: number[]): string {
  if (hours.length === 0) return "Unbekannt"
  if (hours.length === 24) return "Ganztägig"

  const present = new Set(hours)
  let start = hours[0]
  for (const hour of hours) {
    if (!present.has((hour + 23) % 24)) {
      start = hour
      break
    }
  }

  let end = (start + 1) % 24
  let guard = 0
  while (present.has(end) && guard < 24) {
    end = (end + 1) % 24
    guard += 1
  }

  const wraps = present.has(0) && present.has(23)
  return wraps ? `${start}–${end} Uhr, über Mitternacht` : `${start}–${end} Uhr`
}

export type ScheduleLine = {
  months: string
  hours: string
}

export function scheduleLines(windows: AvailabilityWindow[]): ScheduleLine[] {
  const groups: { key: string; months: number[]; hours: string[] }[] = []

  for (const window of windows) {
    const key = window.months.join(",")
    const label = formatHours(window.hours)
    const existing = groups.find((group) => group.key === key)
    if (existing) {
      if (!existing.hours.includes(label)) existing.hours.push(label)
      continue
    }
    groups.push({ key, months: window.months, hours: [label] })
  }

  return groups.map((group) => ({
    months: formatMonths(group.months),
    hours: group.hours.join(" und "),
  }))
}

export function formatSternis(price: number | null): string {
  if (price == null) return "Preis unbekannt"
  return `${new Intl.NumberFormat("de-DE").format(price)} Sternis`
}

export function describeSelection(filters: Filters, noun: string): string {
  const bits: string[] = []

  if (filters.location) bits.push(`Fundort ${filters.location}`)
  if (filters.month) {
    const name = MONTH_NAMES[filters.month - 1]
    bits.push(filters.monthMode === "nur" ? `nur im ${name}` : `aktiv im ${name}`)
  }
  if (filters.hour != null) bits.push(`um ${filters.hour} Uhr`)

  const min = readPrice(filters.priceMin)
  if (min != null) {
    const word = filters.priceMinCompare === "mehr" ? "mehr als" : "mindestens"
    bits.push(`${word} ${new Intl.NumberFormat("de-DE").format(min)} Sternis`)
  }

  const max = readPrice(filters.priceMax)
  if (max != null) {
    const word = filters.priceMaxCompare === "weniger" ? "weniger als" : "höchstens"
    bits.push(`${word} ${new Intl.NumberFormat("de-DE").format(max)} Sternis`)
  }

  const hemisphere = filters.hemisphere === "sued" ? "Südhalbkugel" : "Nordhalbkugel"
  if (bits.length === 0) return `Alle ${noun} auf der ${hemisphere}.`
  return `${noun}: ${bits.join(", ")}. ${hemisphere}.`
}

function readPrice(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  const digits = trimmed.replace(/[.\s]/g, "").replace(/,/g, "")
  if (!/^\d+$/.test(digits)) return null
  return Number(digits)
}
