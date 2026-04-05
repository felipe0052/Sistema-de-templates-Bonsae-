#  Sistema de Templates Bonsae (Fullstack)

Este projeto é uma plataforma completa para criação, gerenciamento e renderização de modelos de documentos dinâmicos, com suporte a multi-tenant e salvamento híbrido.

---

## Tecnologias Utilizadas

- **Front-end**: Next.js 16 (App Router), Tailwind CSS, Lucide Icons.
- **Back-end**: Laravel 11, PHP 8.2+ (XAMPP), SQLite.
- **Autenticação**: Laravel Sanctum.
- **Estratégia de Dados**: Salvamento Híbrido (LocalStorage + API no Background).

---

##  Como Rodar o Projeto


1.  **Feche qualquer terminal aberto**.
2.  Abra a pasta principal (`edittext`) no seu computador.
3.  Dê **dois cliques** no arquivo [**`rodar.bat`**](./rodar.bat).
4.  Aguarde as duas janelas de comando terminarem de carregar (cerca de 10-15 segundos).
5.  Acesse o sistema em: [**http://localhost:3000**](http://localhost:3000)


##  Funcionalidades Principais
- ✅ **CRUD de Templates**: Criar, editar e excluir modelos de documentos.
- ✅ **Variáveis Dinâmicas**: Use variáveis como `{{nome}}`, `{{cpf}}` no conteúdo.
- ✅ **Salvamento Híbrido**: Seus templates aparecem na hora (salvos localmente) e sincronizam com o banco de dados depois.
- ✅ **Renderização**: Gere o documento final preenchido com os dados do cliente.
- ✅ **Multi-tenant**: Preparado para separar dados por diferentes instituições.



##  Estrutura do Repositório
- `/front-end`: Aplicação Next.js.
- `/back-end`: API Laravel com SQLite.

