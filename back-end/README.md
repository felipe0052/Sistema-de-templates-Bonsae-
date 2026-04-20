# Backend - Laravel API

API RESTful para gerenciamento de modelos de documentos com suporte a multi-tenant e renderização de variáveis.

## Tecnologias
- PHP 8.2+
- Laravel 11
- SQLite
- Laravel Sanctum (Autenticação)

## Configuração

0. Pre-requisito do SQLite no PHP:
   
  Verifique se as extensoes estao ativas:
  ```bash
  php -m | rg -i "sqlite|pdo"
  ```

  Se estiver em Arch Linux (yay):
  ```bash
  yay -S php-sqlite
  ```

  Se estiver em Ubuntu/Debian:
  ```bash
  sudo apt update
  sudo apt install -y php-sqlite3
  ```

  Se estiver no Windows:
  - Se usa XAMPP/WAMP: edite o `php.ini` da instalacao, habilite as extensoes abaixo e reinicie o Apache.
  - Se usa PHP via terminal (winget/chocolatey): edite o `php.ini` mostrado por `php --ini` e habilite as extensoes abaixo.

  E habilite no `php.ini` se necessario:
  ```ini
  extension=pdo_sqlite
  extension=sqlite3
  ```

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

Servidor da API: `http://127.0.0.1:8000`

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
