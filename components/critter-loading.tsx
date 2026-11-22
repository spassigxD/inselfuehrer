export function CritterLoading() {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6" aria-busy="true">
      <div className="hidden h-80 animate-pulse rounded-2xl bg-muted lg:block" />
      <div>
        <div className="mb-3 h-14 animate-pulse rounded-2xl bg-muted lg:hidden" />
        <p className="text-sm text-muted-foreground">Die Fundliste wird geladen.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-muted sm:h-52" />
          ))}
        </div>
      </div>
    </div>
  )
}
