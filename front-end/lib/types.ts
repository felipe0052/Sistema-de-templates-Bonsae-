export interface Address {
  id?: string
  cep?: string | null
  street_name?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
}

export interface Client {
  id: string
  name: string
  email: string
  organization: string
  created_at: string
  address?: Address | null
}

export interface Assisted {
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
  address?: Address | null
}

export interface Template {
  id: string
  client_id: string
  template_name: string
  content: string
  background_image?: string | null
  category?: string
  created_at: string
  updated_at: string
}

export interface Variable {
  id: string
  variable_name: string
  description: string
  example?: string
  source?: 'auto' | 'manual' | 'alias' | 'system'
}

export interface StaticVariableApiResponse {
  id: number | string
  name: string
  description: string
  example?: string | null
  source?: 'auto' | 'manual' | 'alias' | 'system'
  created_at?: string
  updated_at?: string
}

export interface Document {
  id: string
  template_id: string
  name: string
  data_json: Record<string, string>
  pdf_generated?: string
  created_at: string
}

export interface DocumentData {
  name?: string
  cpf?: string
  rg?: string
  birth_date?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  email?: string
  [key: string]: string | undefined
}
