import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { publicPath } from "./public-path"

describe("publicPath", () => {
  it("leaves root paths alone when the site has no prefix", () => {
    assert.equal(publicPath("/critters/fische/fische-01-bitterling.webp", ""), "/critters/fische/fische-01-bitterling.webp")
  })

  it("prefixes critter images for the GitHub Pages site", () => {
    assert.equal(
      publicPath("/critters/meerestiere/meerestiere-03-seegurke.png", "/inselfuehrer"),
      "/inselfuehrer/critters/meerestiere/meerestiere-03-seegurke.png",
    )
  })

  it("does not prefix a path twice", () => {
    assert.equal(
      publicPath("/inselfuehrer/critters/insekten/insekten-01-kohlweissling.webp", "/inselfuehrer"),
      "/inselfuehrer/critters/insekten/insekten-01-kohlweissling.webp",
    )
  })
})
