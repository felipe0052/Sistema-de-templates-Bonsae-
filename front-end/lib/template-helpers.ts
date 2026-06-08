import type { Assisted, Address } from "@/lib/types"

type Formatter = (value: string) => string

const FORMATTERS: Array<[string, Formatter]> = [
  ["cpf", (v) => v.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1")],
  ["rg", (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1})/, "$1-$2").replace(/(-\d{1})\d+?$/, "$1")],
  ["cep", (v) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{3})\d+?$/, "$1")],
  ["telefone", (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4,5})(\d{4})$/, "$1-$2")],
  ["celular", (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4,5})(\d{4})$/, "$1-$2")],
  ["data", (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{4})\d+?$/, "$1")],
]

export const formatValue = (varName: string, value: string): string => {
  if (!value) return ""
  const nomeLower = varName.toLowerCase()
  for (const [keyword, formatter] of FORMATTERS) {
    if (nomeLower.includes(keyword)) return formatter(value)
  }
  return value
}

const formatDateFromApi = (value?: string | null): string => {
  if (!value) return ""
  const [year, month, day] = value.split("T")[0].split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

const buildFullAddress = (address?: Address | null): string => {
  if (!address) return ""

  const parts: string[] = []

  if (address.street_name) {
    const streetPart = address.number
      ? `${address.street_name}, ${address.number}`
      : address.street_name
    parts.push(streetPart)
  }

  if (address.complement) parts.push(address.complement)
  if (address.neighborhood) parts.push(address.neighborhood)

  const cityState = [address.city, address.state].filter(Boolean).join("/")
  if (cityState) parts.push(cityState)

  if (address.cep) parts.push(`CEP: ${address.cep}`)

  return parts.join(" - ")
}

const clientFieldMap: Record<string, string> = {
  nome: 'name', assistido_nome: 'name', nome_assistido: 'name', nome_completo: 'name',
  apelido: 'nickname', nome_social: 'social_name', nome_mae: 'mother_name', mae: 'mother_name',
  nome_pai: 'father_name', pai: 'father_name', tipo_pessoa: 'kind_of_person',
  menor_idade: 'is_under_age', cpf: 'cpf', cnpj: 'cnpj',
  data_nascimento: 'birth_date', nascimento: 'birth_date', rg: 'rg',
  orgao_expedidor: 'issuing_body', uf_orgao_expedidor: 'uf_issuing_body',
  estado_civil: 'marital_status', profissao: 'profession', escolaridade: 'education',
  renda_mensal: 'monthly_income', numero_dependentes: 'dependents_number',
  nacionalidade: 'nationality', naturalidade: 'naturalness',
  telefone: 'telephone', celular: 'telephone', telefone2: 'telephone2',
  email: 'email', email2: 'email2', titulo_eleitor: 'voter_registration',
  pis: 'pis', descricao: 'description', inscricao_estadual: 'state_subscription',
  inscricao_municipal: 'local_subscription', porte_empresa: 'size_of_company',
  prioridade: 'priority', cidade: 'address.city', estado: 'address.state',
  cep: 'address.cep', bairro: 'address.neighborhood',
  logradouro: 'address.street_name', numero: 'address.number', complemento: 'address.complement',
}

const getFieldValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => {
    if (current == null) return undefined
    return current[key]
  }, obj)
}

const SPECIAL_FORMATTERS: Record<string, (val: any) => string> = {
  birth_date: (v) => formatDateFromApi(v),
  monthly_income: (v) => String(v),
  priority: (v) => v ? "Sim" : "Não",
}

export const getAssistidoValueForVariable = (varName: string, assistido: Assisted): string => {
  const fieldName = varName.toLowerCase()
  if (fieldName === "endereco") return buildFullAddress(assistido.address)

  const fieldPath = clientFieldMap[fieldName]
  if (!fieldPath) return ""

  const rawValue = getFieldValue(assistido as Record<string, any>, fieldPath)
  if (rawValue == null) return ""

  const formatter = SPECIAL_FORMATTERS[fieldPath]
  return formatter ? formatter(rawValue) : String(rawValue)
}
