import { describe, it, expect } from "vitest"
import { replaceVariables, extractVariables } from "../store"

describe("replaceVariables", () => {
  it("replaces single variable", () => {
    const result = replaceVariables("{{nome}}", { nome: "João" })
    expect(result).toBe("João")
  })

  it("replaces multiple variables", () => {
    const result = replaceVariables("{{nome}} {{idade}}", {
      nome: "João",
      idade: "25",
    })
    expect(result).toBe("João 25")
  })

  it("preserves unknown variables", () => {
    const result = replaceVariables("{{x}}", {})
    expect(result).toBe("{{x}}")
  })

  it("empty value preserves placeholder", () => {
    const result = replaceVariables("{{nome}}", { nome: "" })
    expect(result).toBe("{{nome}}")
  })

  it("escapes HTML in values", () => {
    const result = replaceVariables("{{nome}}", {
      nome: '<script>alert("xss")</script>',
    })
    expect(result).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
    expect(result).not.toContain("<script>")
  })

  it("handles whitespace in key", () => {
    const result = replaceVariables("{{ nome }}", { nome: "João" })
    expect(result).toBe("João")
  })
})

describe("extractVariables", () => {
  it("extracts variables", () => {
    const result = extractVariables("A{{x}} B{{y}}")
    expect(result).toEqual(["x", "y"])
  })

  it("no variables", () => {
    const result = extractVariables("no vars")
    expect(result).toEqual([])
  })

  it("single variable", () => {
    const result = extractVariables("{{only}}")
    expect(result).toEqual(["only"])
  })
})
