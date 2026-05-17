import type { Template, Document, Variable } from './types'
import { extractVariableTokens } from './document-utils'

export const availableVariables: Variable[] = [
  { id: '1', variable_name: 'nome', description: 'Full name', example: 'João Silva' },
  { id: '2', variable_name: 'cpf', description: 'Beneficiary CPF', example: '123.456.789-00' },
  { id: '3', variable_name: 'rg', description: 'Beneficiary RG', example: '12.345.678-9' },
  { id: '4', variable_name: 'data_nascimento', description: 'Birth date', example: '01/01/1990' },
  { id: '5', variable_name: 'endereco', description: 'Full address', example: 'Rua das Flores, 123' },
  { id: '6', variable_name: 'cidade', description: 'City', example: 'São Paulo' },
  { id: '7', variable_name: 'estado', description: 'State', example: 'SP' },
  { id: '8', variable_name: 'cep', description: 'ZIP code', example: '01234-567' },
  { id: '9', variable_name: 'telefone', description: 'Phone', example: '(11) 99999-9999' },
  { id: '10', variable_name: 'email', description: 'Email', example: 'joao@email.com' },
  { id: '11', variable_name: 'data_atual', description: 'Current date', example: new Date().toLocaleDateString('pt-BR') },
  { id: '12', variable_name: 'numero_documento', description: 'Document number', example: 'DOC-2024-001' },
]

export const initialTemplates: Template[] = [
  {
    id: '1',
    client_id: '1',
    template_name: 'Declaração de Residência',
    content: `<h1 style="text-align: center;">DECLARAÇÃO DE RESIDÊNCIA</h1>
<p style="text-align: justify;">Declaro para os devidos fins que <strong>{{nome}}</strong>, portador(a) do CPF nº <strong>{{cpf}}</strong> e RG nº <strong>{{rg}}</strong>, reside no endereço <strong>{{endereco}}</strong>, <strong>{{cidade}}</strong> - <strong>{{estado}}</strong>, CEP: <strong>{{cep}}</strong>.</p>
<p style="text-align: justify;">Esta declaração é verdadeira e estou ciente de que declaração falsa pode implicar em sanções penais previstas no Art. 299 do Código Penal.</p>
<p style="text-align: right;">{{cidade}}, {{data_atual}}</p>
<br/><br/>
<p style="text-align: center;">_________________________________<br/>Assinatura</p>`,
    category: 'Declarações',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    client_id: '1',
    template_name: 'Comprovante de Atendimento',
    content: `<h1 style="text-align: center;">COMPROVANTE DE ATENDIMENTO</h1>
<p style="text-align: center;">Nº {{numero_documento}}</p>
<p style="text-align: justify;">Atestamos que <strong>{{nome}}</strong>, portador(a) do CPF nº <strong>{{cpf}}</strong>, compareceu a esta instituição na data de <strong>{{data_atual}}</strong> para atendimento.</p>
<p style="text-align: justify;">Dados de contato informados:</p>
<ul>
<li>Telefone: {{telefone}}</li>
<li>E-mail: {{email}}</li>
<li>Endereço: {{endereco}}, {{cidade}} - {{estado}}</li>
</ul>
<br/>
<p style="text-align: center;">_________________________________<br/>Responsável pelo Atendimento</p>`,
    category: 'Comprovantes',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    client_id: '1',
    template_name: 'Autorização de Uso de Dados',
    content: `<h1 style="text-align: center;">TERMO DE AUTORIZAÇÃO</h1>
<h2 style="text-align: center;">Uso de Dados Pessoais</h2>
<p style="text-align: justify;">Eu, <strong>{{nome}}</strong>, nascido(a) em <strong>{{data_nascimento}}</strong>, portador(a) do CPF nº <strong>{{cpf}}</strong> e RG nº <strong>{{rg}}</strong>, residente em <strong>{{endereco}}</strong>, <strong>{{cidade}}</strong> - <strong>{{estado}}</strong>, <strong>AUTORIZO</strong> o uso dos meus dados pessoais para os fins específicos desta instituição.</p>
<p style="text-align: justify;">Estou ciente de que meus dados serão tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
<p style="text-align: right;">{{cidade}}, {{data_atual}}</p>
<br/><br/>
<p style="text-align: center;">_________________________________<br/>{{nome}}</p>`,
    category: 'Autorizações',
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z',
  },
]

export const initialDocuments: Document[] = [
  {
    id: '1',
    template_id: '1',
    name: 'Declaração - João Silva',
    data_json: {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      data_atual: '10/03/2024',
    },
    created_at: '2024-03-10T11:00:00Z',
  },
  {
    id: '2',
    template_id: '2',
    name: 'Comprovante - Maria Santos',
    data_json: {
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      telefone: '(11) 98765-4321',
      email: 'maria@email.com',
      endereco: 'Av. Brasil, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      numero_documento: 'DOC-2024-002',
      data_atual: '11/03/2024',
    },
    created_at: '2024-03-11T15:30:00Z',
  },
]

export function replaceVariables(content: string, data: Record<string, string>): string {
  let result = content
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value || `{{${key}}}`)
  })
  return result
}

export function extractVariables(content: string): string[] {
  return extractVariableTokens(content)
}
