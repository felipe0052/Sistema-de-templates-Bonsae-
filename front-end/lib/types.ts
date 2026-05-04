export interface Cliente {
  id: string
  nome: string
  email: string
  empresa: string
  created_at: string
}

export interface Variavel {
  id: string
  nome: string
  label: string
  tipo: 'texto' | 'número' | 'data'
  created_at?: string
}

export interface Template {
  id: string
  nome: string
  conteudo: string
  created_at?: string
}

export interface Documento {
  id: string
  template_id: string
  dados_variaveis: Record<string, any>
  status: string
  created_at?: string
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
