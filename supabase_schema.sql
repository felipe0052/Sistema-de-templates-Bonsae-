-- Criar tabela de variaveis
CREATE TABLE IF NOT EXISTS variaveis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'número', 'data')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    dados_variaveis JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) - Opcional, mas recomendado
-- ALTER TABLE variaveis ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso simplificadas (Permitir tudo para fins de desenvolvimento)
-- CREATE POLICY "Permitir tudo para usuários anonimos" ON variaveis FOR ALL USING (true);
-- CREATE POLICY "Permitir tudo para usuários anonimos" ON templates FOR ALL USING (true);
-- CREATE POLICY "Permitir tudo para usuários anonimos" ON documentos FOR ALL USING (true);

-- Dados iniciais de exemplo para variaveis
INSERT INTO variaveis (nome, label, tipo) VALUES
('nome', 'Nome Completo', 'texto'),
('cpf', 'CPF', 'texto'),
('rg', 'RG', 'texto'),
('data_nascimento', 'Data de Nascimento', 'data'),
('endereco', 'Endereço', 'texto'),
('cidade', 'Cidade', 'texto'),
('estado', 'Estado', 'texto'),
('cep', 'CEP', 'texto'),
('telefone', 'Telefone', 'texto'),
('email', 'E-mail', 'texto')
ON CONFLICT (nome) DO NOTHING;

-- Exemplo de Template
INSERT INTO templates (nome, conteudo) VALUES
('Declaração de Residência', '<h1 style="text-align: center;">DECLARAÇÃO DE RESIDÊNCIA</h1><p>Eu, <strong>{{nome}}</strong>, portador do CPF <strong>{{cpf}}</strong>, declaro que resido no endereço <strong>{{endereco}}</strong>, na cidade de <strong>{{cidade}}</strong>-<strong>{{estado}}</strong>.</p>')
ON CONFLICT DO NOTHING;
