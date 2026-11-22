import type { Category } from "./types"

export const CATEGORIES: Record<
  Category,
  {
    title: string
    href: string
    lead: string
    noun: string
  }
> = {
  fische: {
    title: "Fische",
    href: "/fische",
    lead: "Aus Fluss, Teich, Flussmündung, vom Steg und aus dem Meer.",
    noun: "Fische",
  },
  insekten: {
    title: "Insekten",
    href: "/insekten",
    lead: "Von der Luft bis unter den Stein, am Baum, auf Blumen und am Boden.",
    noun: "Insekten",
  },
  meerestiere: {
    title: "Meerestiere",
    href: "/meerestiere",
    lead: "Alles, was du beim Tauchen im Meer findest. Die Quelle nennt keinen eigenen Fundort.",
    noun: "Meerestiere",
  },
}

export const MONTH_NAMES = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const
