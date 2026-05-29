import type { Template, Document, Variable } from './types'
import { escapeHtml, extractVariableTokens } from './document-utils'

export const availableVariables: Variable[] = [
  { id: 'numero_documento', variable_name: 'numero_documento', description: 'Número identificador do documento', example: 'DOC-2024-001', source: 'manual' },
]

export const initialTemplates: Template[] = [
  {
    id: '1',
    client_id: '1',
    template_name: 'Declaração de Residência',
    content: `<h1 style="text-align: center;">DECLARAÇÃO DE RESIDÊNCIA</h1>
<p style="text-align: justify;">Declaro para os devidos fins que <strong><span data-variable-token="nome">{{nome}}</span></strong>, portador(a) do CPF nº <strong><span data-variable-token="cpf">{{cpf}}</span></strong> e RG nº <strong><span data-variable-token="rg">{{rg}}</span></strong>, reside no endereço <strong><span data-variable-token="endereco">{{endereco}}</span></strong>, <strong><span data-variable-token="cidade">{{cidade}}</span></strong> - <strong><span data-variable-token="estado">{{estado}}</span></strong>, CEP: <strong><span data-variable-token="cep">{{cep}}</span></strong>.</p>
<p style="text-align: justify;">Esta declaração é verdadeira e estou ciente de que declaração falsa pode implicar em sanções penais previstas no Art. 299 do Código Penal.</p>
<p style="text-align: right;"><span data-variable-token="cidade">{{cidade}}</span>, <span data-variable-token="data_atual">{{data_atual}}</span></p>
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
<p style="text-align: center;">Nº <span data-variable-token="numero_documento">{{numero_documento}}</span></p>
<p style="text-align: justify;">Atestamos que <strong><span data-variable-token="nome">{{nome}}</span></strong>, portador(a) do CPF nº <strong><span data-variable-token="cpf">{{cpf}}</span></strong>, compareceu a esta instituição na data de <strong><span data-variable-token="data_atual">{{data_atual}}</span></strong> para atendimento.</p>
<p style="text-align: justify;">Dados de contato informados:</p>
<ul>
<li>Telefone: <span data-variable-token="telefone">{{telefone}}</span></li>
<li>E-mail: <span data-variable-token="email">{{email}}</span></li>
<li>Endereço: <span data-variable-token="endereco">{{endereco}}</span>, <span data-variable-token="cidade">{{cidade}}</span> - <span data-variable-token="estado">{{estado}}</span></li>
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
<p style="text-align: justify;">Eu, <strong><span data-variable-token="nome">{{nome}}</span></strong>, nascido(a) em <strong><span data-variable-token="data_nascimento">{{data_nascimento}}</span></strong>, portador(a) do CPF nº <strong><span data-variable-token="cpf">{{cpf}}</span></strong> e RG nº <strong><span data-variable-token="rg">{{rg}}</span></strong>, residente em <strong><span data-variable-token="endereco">{{endereco}}</span></strong>, <strong><span data-variable-token="cidade">{{cidade}}</span></strong> - <strong><span data-variable-token="estado">{{estado}}</span></strong>, <strong>AUTORIZO</strong> o uso dos meus dados pessoais para os fins específicos desta instituição.</p>
<p style="text-align: justify;">Estou ciente de que meus dados serão tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
<p style="text-align: right;"><span data-variable-token="cidade">{{cidade}}</span>, <span data-variable-token="data_atual">{{data_atual}}</span></p>
<br/><br/>
<p style="text-align: center;">_________________________________<br/><span data-variable-token="nome">{{nome}}</span></p>`,
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
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'g')
    result = result.replace(regex, value ? escapeHtml(value) : `{{${key}}}`)
  })
  return result
}

export function extractVariables(content: string): string[] {
  return extractVariableTokens(content)
}
