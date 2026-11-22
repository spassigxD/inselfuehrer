import { Suspense } from "react"
import { CritterBrowser } from "@/components/critter-browser"
import { CritterLoading } from "@/components/critter-loading"
import { CATEGORIES } from "@/lib/categories"
import { crittersByCategory } from "@/lib/catalog"
import type { Category } from "@/lib/types"

export function CategoryPage({ category }: { category: Category }) {
  const meta = CATEGORIES[category]
  const critters = crittersByCategory(category)

  return (
    <main>
      <header className="mb-6 max-w-2xl">
        <h1 className="font-heading text-4xl tracking-tight sm:text-5xl">{meta.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{meta.lead}</p>
      </header>
      <Suspense fallback={<CritterLoading />}>
        <CritterBrowser critters={critters} category={category} />
      </Suspense>
    </main>
  )
}
