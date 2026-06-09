import { describe, it, expect } from "vitest"
import { buildPrintHtml } from "../print-utils"

describe("buildPrintHtml", () => {
  it("output contains DOCTYPE", () => {
    const html = buildPrintHtml("<p>Hi</p>", "Doc")
    expect(html).toContain("<!DOCTYPE html>")
  })

  it("output contains escaped title", () => {
    const html = buildPrintHtml("", 'Test <Title>')
    expect(html).toContain("&lt;Title&gt;")
  })

  it("output contains rendered HTML", () => {
    const html = buildPrintHtml("<p>Hello</p>", "Doc")
    expect(html).toContain("<p>Hello</p>")
  })

  it("output contains print script", () => {
    const html = buildPrintHtml("<p>Hi</p>", "Doc")
    expect(html).toContain("window.print()")
  })

  it("output contains print-page class", () => {
    const html = buildPrintHtml("<p>Hi</p>", "Doc")
    expect(html).toContain("print-page")
  })
})
