# Sistema de Templates Bonsae (Fullstack)

Este projeto e uma plataforma completa para criacao, gerenciamento e renderizacao de modelos de documentos dinamicos, com suporte a multi-tenant e salvamento hibrido.

## Tecnologias Utilizadas

- Front-end: Next.js 16 (App Router), Tailwind CSS, Lucide Icons.
- Back-end: Laravel 11, PHP 8.2+, SQLite.
- Autenticacao: Laravel Sanctum.
- Estrategia de dados: Salvamento hibrido (LocalStorage + API no background).

## Fluxo Correto de Execucao

### 1. Pre-requisitos

- Node.js 20+ e npm.
- PHP 8.2+ e Composer.
- Extensoes PHP para SQLite habilitadas: `sqlite3` e `pdo_sqlite`.

Validacao rapida:

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

Depois habilite no `/etc/php/php.ini` (se necessario):

```ini
extension=pdo_sqlite
extension=sqlite3
```

### 2. Subir o Back-end (Laravel)

```bash
cd back-end
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

A API ficara em `http://127.0.0.1:8000`.

### 3. Subir o Front-end (Next.js)

Em outro terminal:

```bash
cd front-end
npm install
npm run dev
```

O front-end ficara em `http://localhost:3000`.

### 4. Validacao Rapida

- Abra `http://localhost:3000`.
- Verifique se o endpoint `http://127.0.0.1:8000/api/variables` responde JSON.

Se a API nao estiver no ar, o front entra em modo local para parte dos dados.

## Funcionalidades Principais

- CRUD de templates: Criar, editar e excluir modelos de documentos.
- Variaveis dinamicas: Use variaveis como `{{nome}}`, `{{cpf}}` no conteudo.
- Salvamento hibrido: Templates aparecem na hora e sincronizam com o banco depois.
- Renderizacao: Gere o documento final preenchido com os dados do cliente.
- Multi-tenant: Preparado para separar dados por diferentes instituicoes.

## Estrutura do Repositorio

- `/front-end`: Aplicacao Next.js.
- `/back-end`: API Laravel com SQLite.

