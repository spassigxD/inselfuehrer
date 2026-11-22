import type { Metadata } from "next"
import { CategoryPage } from "@/components/category-page"

export const metadata: Metadata = {
  title: "Fische",
  description: "Fische aus Animal Crossing: New Horizons nach Monat, Uhrzeit, Fundort und Sternis filtern.",
}

export default function FischePage() {
  return <CategoryPage category="fische" />
}
