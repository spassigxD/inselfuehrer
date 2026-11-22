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
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-secondary">
            {showImage ? (
              <Image
                src={critter.image ?? ""}
                alt={critter.name}
                width={72}
                height={72}
                className="size-16 object-contain"
                loading="eager"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Icon className="size-8 text-primary" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-heading text-xl leading-tight break-words">{critter.name}</h2>
            <p className="mt-1 text-base font-semibold text-[oklch(0.46_0.1_65)]">
              {formatSternis(critter.price)}
            </p>
            {critter.priceNote ? (
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{critter.priceNote}</p>
            ) : null}
          </div>
        </div>

        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Fundort
            </dt>
            <dd className="mt-1">
              <Badge variant="secondary">{critter.location}</Badge>
              {critter.locationNote ? (
                <span className="mt-1 block text-muted-foreground">{critter.locationNote}</span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Monate und Uhrzeit
            </dt>
            <dd className="mt-1">
              <ul className="grid gap-1">
                {lines.map((line) => (
                  <li key={`${line.months}-${line.hours}`}>
                    <span className="font-medium">{line.months}</span>
                    <span className="text-muted-foreground"> · {line.hours}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <p className="mt-auto text-xs text-muted-foreground">
          {hemisphere === "sued" ? "Südhalbkugel" : "Nordhalbkugel"}
        </p>
      </CardContent>
    </Card>
  )
}
