# Sistema de Templates Bonsae

Um sistema web robusto desenvolvido com **Next.js** e **React** para criação, gerenciamento e geração de documentos a partir de templates personalizados. O sistema visa agilizar fluxos de trabalho com documentos padronizados usando variáveis dinâmicas e formulários com máscaras inteligentes.

## Principais Funcionalidades

- **Gerenciamento de Templates:** Criação e listagem de templates para diferentes tipos de documentos (declarações, comprovantes, termos, etc).
- **Editor Rico (Rich Text Editor):** Edição de documentos com suporte a formatação avançada de texto.
- **Variáveis Dinâmicas:** Insira facilmente variáveis pré-definidas (como `{{nome}}`, `{{cpf}}`, `{{rg}}`) nos templates.
- **Geração de Documentos:** Preenchimento assistido de dados para criação de novos documentos, contando com máscaras automáticas nos campos de formulário para CPF, RG, CEP, telefone e data.
- **Busca Integrada:** Navegue e encontre rapidamente os templates na plataforma.
- **Design Moderno e Responsivo:** Interface construída com **Tailwind CSS** e componentes **shadcn/ui**, suportando *Dark Mode*.

## Tecnologias Utilizadas

- **Framework:** [Next.js 14+] (App Router)
- **Biblioteca UI:** [React]
- **Estilização:** [Tailwind CSS] com componentes [shadcn/ui]
- **Gerenciamento de Estado:** Context API / Zustand (via store provider customizado)
- **Ícones:** [Lucide React]

## Estrutura do Projeto

- `/app`: Rotas da aplicação (App Router do Next.js), incluindo páginas de templates, documentos e variaveis.
- `/components`: Componentes reutilizáveis da interface gráfica.
- `/hooks`: Hooks customizados para gerenciamento de estado e interface.
- `/lib`: Utilitários gerais, store de estado e definições de tipos.
- `/public`: Assets estáticos como ícones e imagens.

## Como Executar o Projeto

1. **Clone o repositório** e acesse a pasta do projeto:
   ```bash
   cd sistema-de-templates-bonsae
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Scripts Disponíveis

- `npm run dev` - Roda o servidor de desenvolvimento.
- `npm run build` - Cria uma build otimizada da aplicação para produção.
- `npm run start` - Inicia o servidor de produção do Next.js.
- `npm run lint` - Executa a verificação do ESLint no código do projeto.

## Ajustes e Personalizações Recentes

- Menu lateral otimizado com rotas específicas.
- Integração de ícones personalizados para PWA/Favicon.
- Validação visual e formatação de máscaras no preenchimento de documentos.
- Sistema unificado de busca integrado ao cabeçalho.
- Remoção completa de recursos nativos de geração em PDF, focando na integração orgânica em tela para flexibilidade do fluxo.


