import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Insekten",
  description: "Insekten aus Animal Crossing: New Horizons nach Monat, Uhrzeit, Fundort und Sternis filtern.",
}

export default function InsektenPage() {
  return <CategoryPage category="insekten" />
}
