import { defaultFilters } from "./filter"
import type { Filters } from "./types"

export const fishSeaOver10000: Filters = {
  ...defaultFilters,
  location: "Meer",
  priceMin: "10.000",
  priceMinCompare: "mehr",
}

export const insectsNovemberAt16: Filters = {
  ...defaultFilters,
  month: 11,
  monthMode: "aktiv",
  hour: 16,
}
