import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { describe, it } from "node:test"
import { fileURLToPath } from "node:url"
import { defaultFilters, filterCritters, matchesCritter, priceBound } from "./filter"
import { formatHours, formatMonths, scheduleLines } from "./format"
import { fishSeaOver10000, insectsNovemberAt16 } from "./presets"
import { parseFilters, serializeFilters } from "./query"
import type { CatalogFile, Critter, Filters } from "./types"

const catalog = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/critters.json", import.meta.url)), "utf8"),
) as CatalogFile

const fish = catalog.critters.filter((critter) => critter.category === "fische")
const insects = catalog.critters.filter((critter) => critter.category === "insekten")
const sea = catalog.critters.filter((critter) => critter.category === "meerestiere")

function names(critters: Critter[], filters: Filters): string[] {
  return filterCritters(critters, filters)
    .map((critter) => critter.name)
    .sort((a, b) => a.localeCompare(b, "de"))
}

function critter(list: Critter[], name: string): Critter {
  const found = list.find((entry) => entry.name === name)
  assert.ok(found, name)
  return found
}

describe("hours and months", () => {
  it("treats the end hour as exclusive and wraps past midnight", () => {
    const hasel = critter(fish, "Hasel")
    const doebe = critter(fish, "Döbel")
    assert.equal(matchesCritter(hasel, { ...defaultFilters, hour: 16 }), true)
    assert.equal(matchesCritter(hasel, { ...defaultFilters, hour: 0 }), true)
    assert.equal(matchesCritter(hasel, { ...defaultFilters, hour: 8 }), true)
    assert.equal(matchesCritter(hasel, { ...defaultFilters, hour: 9 }), false)
    assert.equal(matchesCritter(doebe, { ...defaultFilters, hour: 9 }), true)
    assert.equal(matchesCritter(doebe, { ...defaultFilters, hour: 15 }), true)
    assert.equal(matchesCritter(doebe, { ...defaultFilters, hour: 16 }), false)
    assert.equal(formatHours(hasel.north[0].hours), "16–9 Uhr, über Mitternacht")
    assert.equal(formatHours(doebe.north[0].hours), "9–16 Uhr")
  })

  it("keeps month-specific hours on the same window", () => {
    const salmon = critter(fish, "Masulachs")
    assert.equal(matchesCritter(salmon, { ...defaultFilters, month: 3, hour: 16 }), true)
    assert.equal(matchesCritter(salmon, { ...defaultFilters, month: 3, hour: 10 }), false)
    assert.equal(matchesCritter(salmon, { ...defaultFilters, month: 9, hour: 10 }), true)
    assert.equal(matchesCritter(salmon, { ...defaultFilters, month: 7, hour: 16 }), false)
    assert.equal(
      matchesCritter(salmon, { ...defaultFilters, hemisphere: "sued", month: 3, hour: 10 }),
      true,
    )
    assert.deepEqual(
      scheduleLines(salmon.north).map((line) => `${line.months} ${line.hours}`),
      ["März–Juni 16–9 Uhr, über Mitternacht", "September–November Ganztägig"],
    )
  })

  it("formats split seasons and two daily windows", () => {
    assert.equal(formatMonths([11, 12, 1, 2, 3]), "November–März")
    assert.equal(formatMonths([4, 5, 6, 12, 1]), "April–Juni, Dezember–Januar")
    const piranha = critter(fish, "Piranha")
    assert.equal(
      scheduleLines(piranha.north)[0].hours,
      "9–16 Uhr und 21–4 Uhr, über Mitternacht",
    )
    assert.equal(matchesCritter(piranha, { ...defaultFilters, month: 6, hour: 16 }), false)
    assert.equal(matchesCritter(piranha, { ...defaultFilters, month: 6, hour: 10 }), true)
    assert.equal(matchesCritter(piranha, { ...defaultFilters, month: 6, hour: 22 }), true)
  })
})

describe("example queries", () => {
  it("finds sea fish worth more than 10.000 Sternis", () => {
    assert.deepEqual(names(fish, fishSeaOver10000), [
      "Glaskopffisch",
      "Hai",
      "Hammerhai",
      "Quastenflosser",
      "Riemenfisch",
      "Rochen",
    ])
    const inclusive = names(fish, {
      ...fishSeaOver10000,
      priceMinCompare: "mindestens",
    })
    assert.ok(inclusive.includes("Napoleonfisch"))
    assert.ok(!names(fish, fishSeaOver10000).includes("Napoleonfisch"))
    assert.ok(!names(fish, fishSeaOver10000).includes("Arowana"))
    assert.ok(!names(fish, fishSeaOver10000).includes("Stör"))
  })

  it("finds insects active in November at 16:00 on the northern hemisphere", () => {
    assert.deepEqual(names(insects, insectsNovemberAt16), [
      "Ameise",
      "Fichtenbock",
      "Fliege",
      "Floh",
      "Geigenkäfer",
      "Gottesanbeterin",
      "Heuschrecke",
      "Hundertfüßer",
      "Kohlweißling",
      "Ligia exotica",
      "Maulwurfsgrille",
      "Monarchfalter",
      "Nasenschrecke",
      "Orchideenmantis",
      "Sackträger",
      "Schnecke",
      "Wasserjungfer",
      "Weiße Baumnymphe",
      "Wespe",
    ])
    assert.equal(
      matchesCritter(critter(insects, "Grille"), insectsNovemberAt16),
      false,
    )
    assert.equal(
      matchesCritter(critter(insects, "Kugelassel"), insectsNovemberAt16),
      false,
    )
    assert.equal(
      matchesCritter(critter(insects, "Stabschrecke"), insectsNovemberAt16),
      false,
    )
    assert.equal(
      matchesCritter(critter(insects, "Stabschrecke"), { ...insectsNovemberAt16, hour: 17 }),
      true,
    )
    assert.equal(
      matchesCritter(critter(insects, "Vogelspinne"), insectsNovemberAt16),
      false,
    )
  })

  it("can limit a month to creatures found only then", () => {
    assert.deepEqual(
      names(fish, { ...defaultFilters, month: 9, monthMode: "nur" }),
      ["Königslachs", "Lachs"],
    )
  })
})

describe("catalog", () => {
  it("has the full northern guide and local images", () => {
    assert.equal(fish.length, 80)
    assert.equal(insects.length, 80)
    assert.equal(sea.length, 40)
    const gigas = critter(sea, "Gigas-Riesenmuschel")
    assert.ok(gigas.north[0].months.includes(9))
    const coelacanth = critter(fish, "Quastenflosser")
    assert.equal(coelacanth.price, 15000)
    assert.match(coelacanth.priceNote ?? "", /Quellseite/)
    assert.equal(coelacanth.location, "Meer")
    for (const entry of catalog.critters) {
      assert.ok(entry.image)
      assert.equal(existsSync(fileURLToPath(new URL(`../public${entry.image}`, import.meta.url))), true)
    }
  })

  it("parses German prices and round-trips the example urls", () => {
    assert.deepEqual(priceBound("10.000"), { value: 10000, invalid: false })
    assert.deepEqual(priceBound(""), { value: null, invalid: false })
    assert.deepEqual(priceBound("zehn"), { value: null, invalid: true })
    const parsed = parseFilters(new URLSearchParams(serializeFilters(fishSeaOver10000)))
    assert.deepEqual(names(fish, parsed), names(fish, fishSeaOver10000))
    const insectsParsed = parseFilters(new URLSearchParams("monat=11&uhr=16"))
    assert.deepEqual(names(insects, insectsParsed), names(insects, insectsNovemberAt16))
  })
})
