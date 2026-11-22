import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Meerestiere",
  description: "Meerestiere aus Animal Crossing: New Horizons nach Monat, Uhrzeit und Sternis filtern.",
}

export default function MeerestierePage() {
  return <CategoryPage category="meerestiere" />
}
