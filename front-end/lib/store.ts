import type { Template, Documento, Variavel } from './types'

// Variáveis disponíveis no sistema
export const variaveisDisponiveis: Variavel[] = [
  { id: '1', nome_variavel: 'nome', descricao: 'Nome completo', exemplo: 'João Silva' },
  { id: '2', nome_variavel: 'cpf', descricao: 'CPF do beneficiário', exemplo: '123.456.789-00' },
  { id: '3', nome_variavel: 'rg', descricao: 'RG do beneficiário', exemplo: '12.345.678-9' },
  { id: '4', nome_variavel: 'data_nascimento', descricao: 'Data de nascimento', exemplo: '01/01/1990' },
  { id: '5', nome_variavel: 'endereco', descricao: 'Endereço completo', exemplo: 'Rua das Flores, 123' },
  { id: '6', nome_variavel: 'cidade', descricao: 'Cidade', exemplo: 'São Paulo' },
  { id: '7', nome_variavel: 'estado', descricao: 'Estado', exemplo: 'SP' },
  { id: '8', nome_variavel: 'cep', descricao: 'CEP', exemplo: '01234-567' },
  { id: '9', nome_variavel: 'telefone', descricao: 'Telefone', exemplo: '(11) 99999-9999' },
  { id: '10', nome_variavel: 'email', descricao: 'E-mail', exemplo: 'joao@email.com' },
  { id: '11', nome_variavel: 'data_atual', descricao: 'Data atual', exemplo: new Date().toLocaleDateString('pt-BR') },
  { id: '12', nome_variavel: 'numero_documento', descricao: 'Número do documento', exemplo: 'DOC-2024-001' },
]

// Templates de exemplo
export const templatesIniciais: Template[] = [
  {
    id: '1',
    cliente_id: '1',
    nome_template: 'Declaração de Residência',
    conteudo: `<h1 style="text-align: center;">DECLARAÇÃO DE RESIDÊNCIA</h1>
<p style="text-align: justify;">Declaro para os devidos fins que <strong>{{nome}}</strong>, portador(a) do CPF nº <strong>{{cpf}}</strong> e RG nº <strong>{{rg}}</strong>, reside no endereço <strong>{{endereco}}</strong>, <strong>{{cidade}}</strong> - <strong>{{estado}}</strong>, CEP: <strong>{{cep}}</strong>.</p>
<p style="text-align: justify;">Esta declaração é verdadeira e estou ciente de que declaração falsa pode implicar em sanções penais previstas no Art. 299 do Código Penal.</p>
<p style="text-align: right;">{{cidade}}, {{data_atual}}</p>
<br/><br/>
<p style="text-align: center;">_________________________________<br/>Assinatura</p>`,
    categoria: 'Declarações',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    cliente_id: '1',
    nome_template: 'Comprovante de Atendimento',
    conteudo: `<h1 style="text-align: center;">COMPROVANTE DE ATENDIMENTO</h1>
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
    categoria: 'Comprovantes',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    cliente_id: '1',
    nome_template: 'Autorização de Uso de Dados',
    conteudo: `<h1 style="text-align: center;">TERMO DE AUTORIZAÇÃO</h1>
<h2 style="text-align: center;">Uso de Dados Pessoais</h2>
<p style="text-align: justify;">Eu, <strong>{{nome}}</strong>, nascido(a) em <strong>{{data_nascimento}}</strong>, portador(a) do CPF nº <strong>{{cpf}}</strong> e RG nº <strong>{{rg}}</strong>, residente em <strong>{{endereco}}</strong>, <strong>{{cidade}}</strong> - <strong>{{estado}}</strong>, <strong>AUTORIZO</strong> o uso dos meus dados pessoais para os fins específicos desta instituição.</p>
<p style="text-align: justify;">Estou ciente de que meus dados serão tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
<p style="text-align: right;">{{cidade}}, {{data_atual}}</p>
<br/><br/>
<p style="text-align: center;">_________________________________<br/>{{nome}}</p>`,
    categoria: 'Autorizações',
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z',
  },
]

// Documentos gerados de exemplo
export const documentosIniciais: Documento[] = [
  {
    id: '1',
    template_id: '1',
    nome: 'Declaração - João Silva',
    dados_json: {
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
    nome: 'Comprovante - Maria Santos',
    dados_json: {
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

// Funções utilitárias
export function substituirVariaveis(conteudo: string, dados: Record<string, string>): string {
  let resultado = conteudo
  Object.entries(dados).forEach(([chave, valor]) => {
    const regex = new RegExp(`{{${chave}}}`, 'g')
    resultado = resultado.replace(regex, valor || `{{${chave}}}`)
  })
  return resultado
}

export function extrairVariaveis(conteudo: string): string[] {
  const regex = /{{(\w+)}}/g
  const matches = conteudo.matchAll(regex)
  const variaveis = new Set<string>()
  for (const match of matches) {
    variaveis.add(match[1])
  }
  return Array.from(variaveis)
}
