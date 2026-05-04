export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      variaveis: {
        Row: {
          id: string
          nome: string
          label: string
          tipo: 'texto' | 'número' | 'data'
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          label: string
          tipo: 'texto' | 'número' | 'data'
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          label?: string
          tipo?: 'texto' | 'número' | 'data'
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          nome: string
          conteudo: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          conteudo: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          conteudo?: string
          created_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          template_id: string
          dados_variaveis: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          template_id: string
          dados_variaveis: Json
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          dados_variaveis?: Json
          status?: string
          created_at?: string
        }
      }
    }
  }
}
