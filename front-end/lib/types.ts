export interface Cliente {
  id: string
  nome: string
  email: string
  empresa: string
  created_at: string
}

export interface Assistido {
  id: string
  creator_id?: number
  address_id?: number | null
  name: string
  nickname?: string | null
  social_name?: string | null
  mother_name?: string | null
  father_name?: string | null
  kind_of_person?: string | null
  is_under_age?: string | null
  priority?: boolean
  cpf?: string | null
  cnpj?: string | null
  birth_date?: string | null
  rg?: string | null
  issuing_body?: string | null
  uf_issuing_body?: string | null
  marital_status?: string | null
  profession?: string | null
  education?: string | null
  monthly_income?: number | string | null
  nationality?: string | null
  naturalness?: string | null
  telephone?: string | null
  telephone2?: string | null
  email?: string | null
  email2?: string | null
  created_at?: string
  updated_at?: string
}

export interface Template {
  id: string
  cliente_id: string
  nome_template: string
  conteudo: string
  imagem_fundo?: string
  categoria?: string
  created_at: string
  updated_at: string
}

export interface Variavel {
  id: string
  nome_variavel: string
  descricao: string
  exemplo?: string
}

export interface StaticVariableApiResponse {
  id: number
  name: string
  description: string
  example?: string | null
  created_at?: string
  updated_at?: string
}

export interface Documento {
  id: string
  template_id: string
  nome: string
  dados_json: Record<string, string>
  pdf_gerado?: string
  created_at: string
}

export interface DadosDocumento {
  nome?: string
  cpf?: string
  rg?: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  telefone?: string
  email?: string
  [key: string]: string | undefined
}
