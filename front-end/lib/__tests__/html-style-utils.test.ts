import { describe, it, expect } from "vitest"
import { toReactStyle } from "../html-style-utils"

describe("toReactStyle", () => {
  it("converts single allowed property: text-align", () => {
    expect(toReactStyle("text-align: center")).toEqual({ textAlign: "center" })
  })

  it("converts font-weight", () => {
    expect(toReactStyle("font-weight: bold")).toEqual({ fontWeight: "bold" })
  })

  it("converts font-style", () => {
    expect(toReactStyle("font-style: italic")).toEqual({ fontStyle: "italic" })
  })

  it("converts font-size with units", () => {
    expect(toReactStyle("font-size: 14px")).toEqual({ fontSize: "14px" })
  })

  it("converts multiple properties", () => {
    expect(toReactStyle("text-align: center; font-size: 12px")).toEqual({
      textAlign: "center",
      fontSize: "12px",
    })
  })

  it("ignores non-allowed properties", () => {
    expect(toReactStyle("color: red")).toEqual({})
  })

  it("ignores empty value", () => {
    expect(toReactStyle("text-align:")).toEqual({})
  })

  it("ignores malformed declarations (no colon)", () => {
    expect(toReactStyle("something")).toEqual({})
  })

  it("filters XSS in value", () => {
    expect(toReactStyle("font-family: url(javascript:alert(1))")).toEqual({})
  })

  it("handles extra whitespace", () => {
    expect(toReactStyle("  text-align  :  center  ")).toEqual({
      textAlign: "center",
    })
  })

  it("empty string", () => {
    expect(toReactStyle("")).toEqual({})
  })
})
