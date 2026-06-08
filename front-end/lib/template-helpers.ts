import type { Assisted, Address } from "@/lib/types"

const formatDateFromApi = (value?: string | null): string => {
  const [year, month, day] = value?.split("T")[0].split("-") ?? []
  return year && month && day ? `${day}/${month}/${year}` : (value ?? "")
}

const buildFullAddress = (address?: Address | null): string => {
  if (!address) return ""

  const streetPart = address.street_name
    ? `${address.street_name}${address.number ? `, ${address.number}` : ""}`
    : null
  const cityState = [address.city, address.state].filter(Boolean).join("/")
  const cepPart = address.cep ? `CEP: ${address.cep}` : null

  return [streetPart, address.complement, address.neighborhood, cityState, cepPart]
    .filter(Boolean)
    .join(" - ")
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

const getFieldValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current == null) return undefined
    return (current as Record<string, unknown>)[key]
  }, obj)
}

const SPECIAL_FORMATTERS: Record<string, (val: unknown) => string> = {
  birth_date: (v) => formatDateFromApi(v as string | null),
  monthly_income: (v) => String(v),
  priority: (v) => (v ? "Sim" : "Não"),
}

export const getAssistidoValueForVariable = (varName: string, assistido: Assisted): string => {
  const fieldName = varName.toLowerCase()
  if (fieldName === "endereco") return buildFullAddress(assistido.address)

  const fieldPath = clientFieldMap[fieldName]
  if (!fieldPath) return ""

  const rawValue = getFieldValue(assistido as unknown as Record<string, unknown>, fieldPath)
  if (rawValue == null) return ""

  const formatter = SPECIAL_FORMATTERS[fieldPath]
  return formatter ? formatter(rawValue) : String(rawValue)
}
