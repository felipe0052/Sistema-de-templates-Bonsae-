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
