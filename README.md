# 🚀 Sistema de Templates Bonsae (Fullstack)

Este projeto é uma plataforma completa para criação, gerenciamento e renderização de modelos de documentos dinâmicos, com suporte a multi-tenant e salvamento híbrido.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end**: Next.js 16 (App Router), Tailwind CSS, Lucide Icons.
- **Back-end**: Laravel 11, PHP 8.2+ (XAMPP), SQLite.
- **Autenticação**: Laravel Sanctum.
- **Estratégia de Dados**: Salvamento Híbrido (LocalStorage + API no Background).

---

## ⚙️ Como Rodar o Projeto (O jeito fácil)

Para facilitar a sua vida, criei um script de inicialização única que sobe tanto o Front quanto o Back de uma vez.

1.  **Feche qualquer terminal aberto**.
2.  Abra a pasta principal (`edittext`) no seu computador.
3.  Dê **dois cliques** no arquivo [**`rodar.bat`**](./rodar.bat).
4.  Aguarde as duas janelas de comando terminarem de carregar (cerca de 10-15 segundos).
5.  Acesse o sistema em: [**http://localhost:3000**](http://localhost:3000)

---

## 🔑 Credenciais de Teste
O sistema realiza o login automático no background, mas caso precise:
- **E-mail**: `admin@instituicao.com`
- **Senha**: `password`

---

## 💡 Funcionalidades Principais
- ✅ **CRUD de Templates**: Criar, editar e excluir modelos de documentos.
- ✅ **Variáveis Dinâmicas**: Use variáveis como `{{nome}}`, `{{cpf}}` no conteúdo.
- ✅ **Salvamento Híbrido**: Seus templates aparecem na hora (salvos localmente) e sincronizam com o banco de dados depois.
- ✅ **Renderização**: Gere o documento final preenchido com os dados do cliente.
- ✅ **Multi-tenant**: Preparado para separar dados por diferentes instituições.

---

## 🆘 Solução de Problemas
Se o link não abrir ou as portas estiverem ocupadas, o arquivo `rodar.bat` já tenta limpar os processos automaticamente. Se o erro persistir, feche todas as janelas pretas e execute o `rodar.bat` novamente.

---

## 📁 Estrutura do Repositório
- `/front-end`: Aplicação Next.js.
- `/back-end`: API Laravel com SQLite.
- `rodar.bat`: Script de inicialização para Windows.
