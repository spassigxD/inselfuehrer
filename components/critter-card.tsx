"use client"

import Image from "next/image"
import { Bug, Fish, Waves } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { scheduleLines, formatSternis } from "@/lib/format"
import type { Critter, Hemisphere } from "@/lib/types"

const icons = {
  fische: Fish,
  insekten: Bug,
  meerestiere: Waves,
}

export function CritterCard({
  critter,
  hemisphere,
}: {
  critter: Critter
  hemisphere: Hemisphere
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const Icon = icons[critter.category]
  const lines = scheduleLines(hemisphere === "sued" ? critter.south : critter.north)
  const showImage = Boolean(critter.image) && !imageFailed

  return (
    <Card size="sm" className="h-full sm:data-[size=sm]:[--card-spacing:--spacing(4)]">
      <CardContent className="flex h-full gap-3 sm:flex-col sm:gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-secondary sm:size-20">
          {showImage ? (
            <Image
              src={critter.image ?? ""}
                alt={critter.name}
              width={72}
              height={72}
              className="size-14 object-contain sm:size-16"
              loading="eager"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <Icon className="size-7 text-primary sm:size-8" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div>
            <h2 className="font-heading text-lg leading-tight break-words sm:text-xl">{critter.name}</h2>
            <p className="mt-0.5 text-base font-semibold text-[oklch(0.46_0.1_65)]">
              {formatSternis(critter.price)}
            </p>
            {critter.priceNote ? (
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{critter.priceNote}</p>
            ) : null}
          </div>
          <p>
            <span className="sr-only">Fundort: </span>
            <Badge variant="secondary" className="h-6 px-2">
              {critter.location}
            </Badge>
          </p>
          {critter.locationNote ? (
            <p className="text-xs leading-snug text-muted-foreground">{critter.locationNote}</p>
          ) : null}
          <ul className="grid gap-0.5 text-sm" aria-label="Monate und Uhrzeit">
            {lines.map((line) => (
              <li key={`${line.months}-${line.hours}`} className="leading-snug">
                <span className="font-medium">{line.months}</span>
                <span className="text-muted-foreground"> · {line.hours}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto hidden text-xs text-muted-foreground sm:block">
            {hemisphere === "sued" ? "Südhalbkugel" : "Nordhalbkugel"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
