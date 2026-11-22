import raw from "../data/critters.json"
import type { CatalogFile, Category, Critter } from "./types"

const catalog = raw as CatalogFile

export const critters: Critter[] = catalog.critters

export const sources = catalog.sources

export function crittersByCategory(category: Category): Critter[] {
  return critters.filter((critter) => critter.category === category)
}
