import { describe, it, expect } from "vitest"
import { formatValue } from "../variable-formatters"

describe("formatValue", () => {
  it('returns empty string for empty value', () => {
    expect(formatValue("nome", "")).toBe("")
  })

  describe("CPF formatting", () => {
    it('formats valid CPF', () => {
      expect(formatValue("cpf", "12345678901")).toBe("123.456.789-01")
    })

    it('formats CPF with existing punctuation', () => {
      expect(formatValue("cpf", "123.456.789-01")).toBe("123.456.789-01")
    })

    it('is case insensitive for variable name', () => {
      expect(formatValue("CPF", "12345678901")).toBe("123.456.789-01")
    })
  })

  describe("RG formatting", () => {
    it('formats valid RG', () => {
      expect(formatValue("rg", "1234567")).toBe("12.345.67")
    })
  })

  describe("CEP formatting", () => {
    it('formats valid CEP', () => {
      expect(formatValue("cep", "01234567")).toBe("01234-567")
    })
  })

  describe("Telefone formatting", () => {
    it('formats landline', () => {
      expect(formatValue("telefone", "1134567890")).toBe("(11) 3456-7890")
    })
  })

  describe("Celular formatting", () => {
    it('formats mobile with 9 digits', () => {
      expect(formatValue("celular", "11998765432")).toBe("(11) 99876-5432")
    })
  })

  describe("Date formatting", () => {
    it('formats date from variable name containing "data"', () => {
      expect(formatValue("data_nascimento", "15051990")).toBe("15/05/1990")
    })
  })

  describe("No match", () => {
    it('returns value unchanged when no keyword matches', () => {
      expect(formatValue("descricao", "abc")).toBe("abc")
    })

    it('returns value unchanged for unknown variable', () => {
      expect(formatValue("qualquer_coisa", "valor")).toBe("valor")
    })
  })
})
