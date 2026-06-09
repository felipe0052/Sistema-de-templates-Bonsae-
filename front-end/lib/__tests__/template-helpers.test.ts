import { describe, it, expect } from "vitest"
import { getAssistidoValueForVariable } from "../template-helpers"
import type { Assisted } from "@/lib/types"

const makeAssisted = (overrides: Partial<Assisted> = {}): Assisted =>
  ({
    id: "1",
    name: "João da Silva",
    nickname: "",
    social_name: "",
    mother_name: "Maria da Silva",
    father_name: "José da Silva",
    kind_of_person: "pf",
    is_under_age: false,
    cpf: "12345678901",
    cnpj: "",
    birth_date: "1990-05-15T00:00:00",
    rg: "1234567",
    issuing_body: "SSP",
    uf_issuing_body: "SP",
    marital_status: "solteiro",
    profession: "Advogado",
    education: "Superior",
    monthly_income: 5000,
    dependents_number: 0,
    nationality: "Brasileira",
    naturalidade: "São Paulo",
    telephone: "1134567890",
    telephone2: "",
    email: "joao@email.com",
    email2: "",
    voter_registration: "",
    pis: "",
    description: "",
    state_subscription: "",
    local_subscription: "",
    size_of_company: "",
    priority: true,
    address: {
      street_name: "Rua das Flores",
      number: "123",
      complement: "Apto 1",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      cep: "01234-567",
    },
    ...overrides,
  }) as unknown as Assisted

describe("getAssistidoValueForVariable", () => {
  it('returns empty string for unknown variable', () => {
    expect(getAssistidoValueForVariable("xyz", makeAssisted())).toBe("")
  })

  it('resolves "nome" to name field', () => {
    expect(getAssistidoValueForVariable("nome", makeAssisted())).toBe("João da Silva")
  })

  it('resolves "assistido_nome" alias to name field', () => {
    expect(getAssistidoValueForVariable("assistido_nome", makeAssisted())).toBe("João da Silva")
  })

  it('resolves "nome_completo" alias to name field', () => {
    expect(getAssistidoValueForVariable("nome_completo", makeAssisted())).toBe("João da Silva")
  })

  it('resolves simple string field', () => {
    expect(getAssistidoValueForVariable("cpf", makeAssisted())).toBe("12345678901")
  })

  it('resolves nested address field', () => {
    expect(getAssistidoValueForVariable("cidade", makeAssisted())).toBe("São Paulo")
  })

  it('builds full address for "endereco"', () => {
    const result = getAssistidoValueForVariable("endereco", makeAssisted())
    expect(result).toContain("Rua das Flores, 123")
    expect(result).toContain("Apto 1")
    expect(result).toContain("Centro")
    expect(result).toContain("São Paulo/SP")
    expect(result).toContain("CEP: 01234-567")
  })

  it('formats birth_date to dd/mm/yyyy', () => {
    expect(getAssistidoValueForVariable("data_nascimento", makeAssisted())).toBe("15/05/1990")
  })

  it('formats monthly_income as string', () => {
    expect(getAssistidoValueForVariable("renda_mensal", makeAssisted())).toBe("5000")
  })

  it('formats priority as "Sim" for true', () => {
    expect(getAssistidoValueForVariable("prioridade", makeAssisted())).toBe("Sim")
  })

  it('formats priority as "Não" for false', () => {
    expect(getAssistidoValueForVariable("prioridade", makeAssisted({ priority: false }))).toBe("Não")
  })

  it('returns empty string for null field value', () => {
    expect(getAssistidoValueForVariable("cpf", makeAssisted({ cpf: null as any }))).toBe("")
  })

  it('returns empty string for undefined field value', () => {
    expect(getAssistidoValueForVariable("cpf", makeAssisted({ cpf: undefined as any }))).toBe("")
  })

  it('resolves "mae" alias to mother_name', () => {
    expect(getAssistidoValueForVariable("mae", makeAssisted())).toBe("Maria da Silva")
  })

  it('resolves "pai" alias to father_name', () => {
    expect(getAssistidoValueForVariable("pai", makeAssisted())).toBe("José da Silva")
  })
})
