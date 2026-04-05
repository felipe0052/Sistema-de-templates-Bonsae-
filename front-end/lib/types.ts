export interface Cliente {
  id: string
  nome: string
  email: string
  empresa: string
  created_at: string
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
