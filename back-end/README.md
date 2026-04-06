# EditorText Backend - Laravel API

API RESTful para gerenciamento de modelos de documentos com suporte a multi-tenant e renderização de variáveis.

## Tecnologias
- PHP 8.2+
- Laravel 11
- SQLite
- Laravel Sanctum (Autenticação)

## Configuração

1. Instale as dependências:
   ```bash
   composer install
   ```

2. Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Configure o banco de dados (SQLite por padrão):
   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

4. Inicie o servidor:
   ```bash
   php artisan serve
   ```

## Endpoints Principais

### Autenticação
- `POST /api/login`: Login para obter token.
  - Body: `{"email": "admin@instituicao.com", "password": "password"}`
- `POST /api/admin-mode/login`: Bootstrap de desenvolvimento para entrar como admin automaticamente.
  - Disponível fora de produção quando `ADMIN_MODE_ENABLED=true` ou `APP_ENV != production`.
  - Cria/recupera o tenant e o usuário `admin@instituicao.com` e devolve token Bearer.

### Templates
- `GET /api/templates`: Lista templates da instituição.
- `POST /api/templates`: Cria novo template.
  - Body (Multipart): `title`, `content` (HTML), `variables` (array), `background_image` (file), `visibility`.
- `GET /api/templates/{id}`: Detalhes de um template.
- `POST /api/templates/{id}/render`: Renderiza o template com variáveis.
  - Body: `{"variables": {"nome": "João", "cpf": "123..."}, "missing_variable_behavior": "underline", "format": "html"}`

### Utilidades
- `GET /api/variables`: Lista todas as variáveis estáticas disponíveis no sistema.
  - Query opcional: `search`
  - Resposta: `{"data": [{"id": 1, "name": "cpf", "description": "...", "example": "..."}]}`
- `POST /api/variables`: Cria uma nova variável estática global.
  - Auth: Bearer token
  - Body: `{"name": "numero_processo", "description": "Número do processo", "example": "1234/2024"}`

## Estrutura do Projeto
- **Models**: `Tenant`, `User`, `Template`, `StaticVariable`.
- **Services**: `TemplateRenderer` (Lógica de substituição de variáveis).
- **Middleware**: `EnsureUserHasTenant` (Garante que o usuário pertence a uma instituição).
- **Traits**: `BelongsToTenant` (Escopo global para multi-tenant).
