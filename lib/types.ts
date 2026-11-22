export type Category = "fische" | "insekten" | "meerestiere"

export type Hemisphere = "nord" | "sued"

export type AvailabilityWindow = {
  months: number[]
  hours: number[]
}

export type Critter = {
  id: string
  category: Category
  name: string
  image: string | null
  price: number | null
  priceNote: string | null
  location: string
  locationNote: string | null
  north: AvailabilityWindow[]
  south: AvailabilityWindow[]
}

export type CatalogFile = {
  retrieved: string
  hemisphereDefault: Hemisphere
  sources: Record<Category, string>
  notes: string[]
  critters: Critter[]
}

export type MonthMode = "aktiv" | "nur"

export type PriceMinCompare = "mindestens" | "mehr"

export type PriceMaxCompare = "hoechstens" | "weniger"

export type Filters = {
  hemisphere: Hemisphere
  month: number | null
  monthMode: MonthMode
  hour: number | null
  location: string | null
  priceMin: string
  priceMinCompare: PriceMinCompare
  priceMax: string
  priceMaxCompare: PriceMaxCompare
}
