import type { Assisted, Address } from "@/lib/types"

export const formatValue = (varName: string, value: string) => {
    if (!value) return ""

    const nomeLower = varName.toLowerCase()

    if (nomeLower.includes("cpf")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1")
    }

    if (nomeLower.includes("rg")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1})/, "$1-$2")
            .replace(/(-\d{1})\d+?$/, "$1")
    }

    if (nomeLower.includes("cep")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{3})\d+?$/, "$1")
    }

    if (nomeLower.includes("telefone") || nomeLower.includes("celular")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4,5})(\d{4})$/, "$1-$2")
    }

    if (nomeLower.includes("data")) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{2})(\d)/, "$1/$2")
            .replace(/(\d{4})\d+?$/, "$1")
    }

    return value
}

const formatDateFromApi = (value?: string | null) => {
    if (!value) return ""

    const [year, month, day] = value.split("T")[0].split("-")
    if (!year || !month || !day) return value

    return `${day}/${month}/${year}`
}

const buildFullAddress = (address?: Address | null): string => {
    if (!address) return ""

    const parts: string[] = []

    if (address.street_name) {
        let streetPart = address.street_name
        if (address.number) {
            streetPart += `, ${address.number}`
        }
        parts.push(streetPart)
    }

    if (address.complement) {
        parts.push(address.complement)
    }

    if (address.neighborhood) {
        parts.push(address.neighborhood)
    }

    const cityStateParts: string[] = []
    if (address.city) cityStateParts.push(address.city)
    if (address.state) cityStateParts.push(address.state)
    if (cityStateParts.length > 0) {
        parts.push(cityStateParts.join("/"))
    }

    if (address.cep) {
        parts.push(`CEP: ${address.cep}`)
    }

    return parts.join(" - ")
}

const clientFieldMap: Record<string, string> = {
    nome: 'name',
    assistido_nome: 'name',
    nome_assistido: 'name',
    nome_completo: 'name',
    apelido: 'nickname',
    nome_social: 'social_name',
    nome_mae: 'mother_name',
    mae: 'mother_name',
    nome_pai: 'father_name',
    pai: 'father_name',
    tipo_pessoa: 'kind_of_person',
    menor_idade: 'is_under_age',
    cpf: 'cpf',
    cnpj: 'cnpj',
    data_nascimento: 'birth_date',
    nascimento: 'birth_date',
    rg: 'rg',
    orgao_expedidor: 'issuing_body',
    uf_orgao_expedidor: 'uf_issuing_body',
    estado_civil: 'marital_status',
    profissao: 'profession',
    escolaridade: 'education',
    renda_mensal: 'monthly_income',
    numero_dependentes: 'dependents_number',
    nacionalidade: 'nationality',
    naturalidade: 'naturalness',
    telefone: 'telephone',
    celular: 'telephone',
    telefone2: 'telephone2',
    email: 'email',
    email2: 'email2',
    titulo_eleitor: 'voter_registration',
    pis: 'pis',
    descricao: 'description',
    inscricao_estadual: 'state_subscription',
    inscricao_municipal: 'local_subscription',
    porte_empresa: 'size_of_company',
    prioridade: 'priority',
    cidade: 'address.city',
    estado: 'address.state',
    cep: 'address.cep',
    bairro: 'address.neighborhood',
    logradouro: 'address.street_name',
    numero: 'address.number',
    complemento: 'address.complement',
}

const getFieldValue = (obj: Record<string, any>, path: string): any => {
    return path.split('.').reduce((current, key) => {
        if (current == null) return undefined
        return current[key]
    }, obj)
}

export const getAssistidoValueForVariable = (
    varName: string,
    assistido: Assisted,
) => {
    const fieldName = varName.toLowerCase()

    if (fieldName === "endereco") {
        return buildFullAddress(assistido.address)
    }

    const fieldPath = clientFieldMap[fieldName]
    if (!fieldPath) return ""

    const rawValue = getFieldValue(assistido as Record<string, any>, fieldPath)
    if (rawValue == null) return ""

    if (fieldPath === "birth_date") {
        return formatDateFromApi(rawValue)
    }

    if (fieldPath === "monthly_income") {
        return String(rawValue)
    }

    if (fieldPath === "priority") {
        return rawValue ? "Sim" : "Não"
    }

    return String(rawValue)
}
