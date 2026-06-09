import { describe, it, expect } from "vitest"
import {
  extractVariableTokens,
  findUnknownVariables,
  normalizeTemplateContent,
  escapeHtml,
  highlightPendingVariables,
  stripVariableTokens,
} from "../document-utils"

describe("extractVariableTokens", () => {
  it("extracts a single variable", () => {
    expect(extractVariableTokens("Olá {{nome}}")).toEqual(["nome"])
  })

  it("extracts multiple variables", () => {
    expect(extractVariableTokens("A{{nome}} B{{idade}}")).toEqual(["nome", "idade"])
  })

  it("returns empty array when no variables exist", () => {
    expect(extractVariableTokens("Sem variáveis")).toEqual([])
  })

  it("removes duplicates", () => {
    expect(extractVariableTokens("{{nome}} e {{nome}}")).toEqual(["nome"])
  })

  it("handles extra whitespace inside braces", () => {
    expect(extractVariableTokens("{{  nome  }}")).toEqual(["nome"])
  })

  it("handles multi-word variable names", () => {
    expect(extractVariableTokens("{{nome_completo}}")).toEqual(["nome_completo"])
  })
})

describe("findUnknownVariables", () => {
  it("returns only unknown variables", () => {
    expect(findUnknownVariables("{{nome}} {{cpf}}", ["nome"])).toEqual(["cpf"])
  })

  it("returns empty array when all variables are known", () => {
    expect(findUnknownVariables("{{nome}}", ["nome"])).toEqual([])
  })

  it("returns all variables when none are known", () => {
    expect(findUnknownVariables("{{x}} {{y}}", [])).toEqual(["x", "y"])
  })
})

describe("normalizeTemplateContent", () => {
  it("normalizes whitespace inside braces", () => {
    expect(normalizeTemplateContent("  {{  nome  }}")).toBe("  {{nome}}")
  })

  it("normalizes multiple variables", () => {
    expect(normalizeTemplateContent("{{  nome  }} {{  idade  }}")).toBe("{{nome}} {{idade}}")
  })
})

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;")
  })

  it("escapes &", () => {
    expect(escapeHtml("a&b")).toBe("a&amp;b")
  })

  it("escapes double quotes", () => {
    expect(escapeHtml('a"b')).toBe("a&quot;b")
  })

  it("escapes single quotes", () => {
    expect(escapeHtml("a'b")).toBe("a&#039;b")
  })

  it("returns unchanged string when no special chars", () => {
    expect(escapeHtml("hello")).toBe("hello")
  })
})

describe("highlightPendingVariables", () => {
  it("wraps variables in pending preview span", () => {
    expect(highlightPendingVariables("{{nome}}")).toBe(
      '<span data-variable-preview="pending">{{nome}}</span>',
    )
  })
})

describe("stripVariableTokens", () => {
  it("removes data-variable-token attributes", () => {
    expect(stripVariableTokens('data-variable-token="abc" data-foo="bar"')).toBe(' data-foo="bar"')
  })

  it("returns unchanged string when no token attributes", () => {
    expect(stripVariableTokens("no attributes")).toBe("no attributes")
  })
})
