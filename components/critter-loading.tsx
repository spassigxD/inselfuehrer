export function CritterLoading() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]" aria-busy="true">
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      <div>
        <p className="text-sm text-muted-foreground">Die Fundliste wird geladen.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
