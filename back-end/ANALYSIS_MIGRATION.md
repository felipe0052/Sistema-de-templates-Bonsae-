# Análise de Impacto - Refatoração

## Resumo Geral

| Item | Valor |
|------|-------|
| Total de tabelas no dump | 191 |
| Tabelas úteis ao escopo | ~15-20 |
| Tabelas ignoradas | ~140+ |
| Estrutura do dump | NÃO tenant-first |
| Projeto Laravel | Tenant-first |
| Sistema de origem | NPJ / Escritório jurídico-acadêmico |
| Abordagem | Dump como base; adaptar Laravel ao dump |

---

## Impacto Geral

### 1. Alto Impacto (tabelas essenciais)

#### `users` — CRÍTICO
- **Colunas**: id, profile_id, name, email, password, cpf, rg, telephone, oab, course_id, registration_number, remember_token, access_token, is_admin, active, profile_pic, last_login, timestamps, soft_delete
- **Impacto**: Tabela central do sistema. Sem tenant_id no dump. Schema do Laravel atual difere drasticamente (tem tenant_id, poucos campos)
- **Fluxo**: Sanctum busca usuário em `users` → autentica → auth()->user(). Hoje auth()->user()->tenant_id existe; após dump, tenant_id some. Qualquer código que dependa de tenant_id via user quebra (TenantScope, BelongsToTenant, rotas, controllers)
- **Ação**: Migrar schema completo do dump (substituir migration atual). Remover tenant_id da migration. Atualizar LoginController e rotas que usam tenant_id. Model User precisa refletir schema do dump (adicionar cpf, rg, profile_id, etc.)
- **Risco**: Perda de dados se campos importantes forem omitidos (cpf, oab, rg dos usuários). Se profile_id for removido, users perdem vínculo com permissões

#### `profiles` — CRÍTICO
- **Colunas**: id, name, description
- **Impacto**: Base do RBAC do sistema legado. Sem profiles não é possível determinar permissões dos users
- **Fluxo**: User → profile_id → profile → permissões. Hoje o projeto não usa profiles (só tenant isolation). Após dump, todo controle de acesso dependerá de profile + permissions. É necessário implementar um middleware/permission system que use a cadeia profiles → permissions
- **Ação**: Migrar profiles. Adicionar `profile_id` em users. Criar middleware de autorização baseado em profile
- **Risco**: Perfil inadequado pode travar acesso a funcionalidades. Sem o fluxo de permissões implementado, nenhum user consegue acessar nada

#### `permissions` + `model_has_permissions` + `role_has_permissions` — ALTO
- **Colunas**: permission_id, role_id, guard_name, profile, model_type, model_id
- **Impacto**: Definem o que cada usuário pode fazer
- **Fluxo**: User → profile → permissions (via role_has_permissions e model_has_permissions). O projeto atual NÃO tem spatie/laravel-permission instalado. Model_has_permissions referencia `App\Models\User` como model_type — se o namespace do User mudar, a relação quebra. Todo o fluxo de autorização (gates, policies, middlewares) precisa ser construído do zero baseado nessa estrutura
- **Ação**: Instalar spatie/laravel-permission. Migrar permissions, roles, model_has_roles, model_has_permissions. Mapear App\Models\User do dump para o namespace atual. Registrar gates/policies. Remover EnsureUserHasTenant, substituir por EnsureUserHasProfile/Permission
- **Risco**: Quebrar autorização se a cadeia for migrada parcialmente. Se model_type não for atualizado, as relações user→permission ficam órfãs

#### `roles` — ALTO
- **Colunas**: id, name, guard_name
- **Impacto**: Agrupamento lógico de permissões. Referenciado por role_has_permissions e model_has_roles
- **Fluxo**: Permissions agrupadas em roles. Roles atribuídas a models (users). Todo o fluxo de "quem pode fazer o quê" depende dessa cadeia. Sem roles, permissions ficam soltas
- **Ação**: Migrar completo. Garantir que names dos roles mapeiam corretamente para as policies do sistema de templates

### 2. Médio Impacto (tabelas de suporte)

#### `activity_log` — MÉDIO
- **Colunas**: id, log_name, description, subject_type, subject_id, causer_type, causer_id, properties(JSON), event, batch_uuid, timestamps
- **Impacto**: 4631 registros de auditoria histórica
- **Fluxo**: Cada log referencia `subject_type` (ex: `App\Models\Lawsuit\ActType`) e `causer_type` (`App\Models\User\User`). Após migração, essas classes NÃO existem no novo projeto. O spatie/laravel-activitylog tenta resolver esses tipos — se a classe não existir, o log não quebra, mas os links de navegação (ex: "ver usuário que fez a ação") ficam quebrados. O fluxo de novos logs precisa ser implementado com as classes do projeto atual
- **Ação**: Migrar dados diretamente (schema compatível). Adicionar spatie/laravel-activitylog ao composer.json. Criar subscriber para logar operações de template automaticamente. Decidir se logs antigos com classes inexistentes serão mantidos como histórico ou limpos
- **Observação**: Se spatie/laravel-activitylog não estiver instalado, adicionar ao composer.json

#### `configurations` — MÉDIO
- **Colunas**: id, slug, name, description, key, value, url, is_active, is_profile, profile, timestamps
- **Impacto**: Configurações globais do sistema (53 registros)
- **Ação**: Migrar; analisar quais configurações são relevantes e atualizar no frontend/backend

#### `admins` — MÉDIO
- **Colunas**: id, name, email, password
- **Impacto**: Apenas 1 registro (admin geral). Pode ser fundido com users
- **Ação**: Inserir na tabela `users` com role de admin

#### `cities` — MÉDIO
- **Colunas**: id, ibge_code, name, state_id, uf, latitude, longitude
- **Impacto**: 5570 municípios brasileiros com dados geográficos. Útil para máscaras de endereço
- **Ação**: Migrar para uso em formulários de templates (campos de endereço)
- **Observação**: Pode substituir API externa de CEP/municípios

#### `states` — MÉDIO
- **Colunas**: id, name, uf
- **Impacto**: 27 estados. Complemento de `cities`
- **Ação**: Migrar junto com cities

#### `competences` — MÉDIO
- **Colunas**: id, name, uf
- **Impacto**: 1037 registros. Competências jurídicas — úteis se templates forem usados na área jurídica
- **Ação**: Migrar se houver uso em templates jurídicos

#### `configs` — MÉDIO
- **Colunas**: id, university, instance, instance_id, academic, attendance_folder, automate_card_event, double_deadline, students_access_restriction, timestamps
- **Impacto**: Configurações da instância do NPJ
- **Ação**: Migrar e mapear para tabela de configuração de tenant

#### `act_types` — MÉDIO
- **Colunas**: id, id_old_bonsae, id_audora, name, active, is_default, flags booleanas (act_first_lawsuit, appointment_type, etc.), timestamps
- **Impacto**: 47 tipos de atos jurídicos (Atendimento, Triagem, Petição inicial, etc.)
- **Ação**: Migrar se houver relação com templates de documentos jurídicos

### 3. Baixo Impacto (úteis, mas não críticos)

#### `locals` — BAIXO
- **Colunas**: id, name, description
- **Impacto**: Locais físicos do NPJ. Útil se templates referenciarem locais
- **Ação**: Migrar se necessário

#### `courses` — BAIXO
- **Colunas**: id, name, is_active_instance
- **Impacto**: Cursos da universidade (Direito, etc.)
- **Ação**: Migrar se necessário para templates acadêmicos

#### `type_documents` — BAIXO
- **Colunas**: id, name
- **Impacto**: Tipos de documentos genéricos
- **Ação**: Migrar

#### `genders` — BAIXO
- **Colunas**: id, name
- **Impacto**: Gêneros para cadastro de pessoas
- **Ação**: Migrar se necessário

#### `ethnicities` — BAIXO
- **Colunas**: id, name
- **Impacto**: Etnias para cadastro de pessoas
- **Ação**: Migrar se necessário

#### `thematic_areas` — BAIXO
- **Colunas**: id, name, course_id
- **Impacto**: Áreas temáticas do NPJ
- **Ação**: Migrar se necessário

#### `specific_terms` — BAIXO
- **Colunas**: id, course_id, council, bi, bis, lawsuit, lawsuits, client, clients, shift, shifts, e dezenas de campos de nomenclatura institucional
- **Impacto**: Termos específicos da instituição. Pode ser útil para variáveis de sistema
- **Ação**: Migrar se necessário; pode alimentar variáveis pré-definidas no sistema de templates

#### `keywords` — BAIXO
- **Colunas**: id, name, user_id
- **Impacto**: Palavras-chave usadas para classificar processos
- **Ação**: Migrar se necessário

---

### 4. Sem Impacto (ignorar)

**~140+ tabelas** do sistema acadêmico/jurídico legado:

| Grupo | Tabelas | Motivo |
|-------|---------|--------|
| Atos processuais | `acts`, `act_documents`, `act_extracts`, `act_feedbacks`, `act_responsibles`, `act_tasks` | Específico de NPJ |
| Agendas | `events`, `event_types`, `appointments`, `meetings`, `shift_event` | Agenda física do NPJ |
| Alunos/Turmas | `academic_classes`, `disciplines`, `discipline_users`, `discipline_teams`, `npj_classes`, `npj_class_students`, `school_periods` | Controle acadêmico |
| Alunos em prática | `practice_students`, `practice_feedbacks`, `practice_documents`, `practice_skills`, `practice_criterion`, `practice_clients`, `practice_thematic_areas` | Práticas de estágio |
| Avaliações | `student_evaluations`, `questions`, `question_options`, `question_users`, `question_feedbacks`, `question_images` | Sistema de provas |
| Certificados | `certificates`, `certificate_users`, `certificate_feedbacks`, `config_certificates`, `task_certificates` | Emissão de certificados |
| Clientes | `clients`, `client_documents`, `client_lawsuit`, `client_opposing_representatives` | Cadastro de assistidos |
| Carga horária | `all_workloads`, `shift_students`, `shifts`, `workloads` | Controle de horas |
| Elementos didáticos | `element_templates`, `element_type_forms`, `element_type_form_documents`, `element_type_form_feedbacks`, `element_type_form_links`, `element_type_form_ods`, `element_type_form_options`, `element_type_form_skills`, `element_type_form_texts`, `element_type_form_thematic_areas`, `element_type_form_videos`, `element_template_documents`, `element_template_links`, `element_template_type_forms`, `element_template_videos` | Modelos de atividades acadêmicas (NÃO são templates de documentos) |
| Etapas/Sessões | `stages`, `sessions`, `session_documents`, `session_users`, `session_skills`, `stage_documents`, `stage_users`, `stage_skills` | Controle de etapas |
| Jurídico | `lawsuits`, `lawsuit_documents`, `lawsuit_types`, `lawsuit_classes`, `lawsuit_subjects`, `movements`, `subpoenas`, `lawsuit_opposing_party`, `lawsuit_keywords`, `opposing_parties`, `representatives`, `petitionings`, `petitionings_students`, `legal_grounds`, `legal_ground_students`, `court_oab`, `courts`, `oabs` | Processos judiciais |
| Mensagens | `messages`, `warnings`, `warning_links` | Comunicação interna |
| Migrations | `migrations` | Controle interno do Laravel legado |
| Times | `teams`, `team_users`, `customize_teams` | Grupos de alunos |
| Termos | `terms`, `term_students`, `project_terms` | Termos de aceite |
| Outros | `addresses`, `contracts`, `contract_universitys`, `extension_programs`, `extension_program_practices`, `filter_lists`, `grafic_data_alls`, `grafic_specifics`, `group_grafics`, `impersonate_access_controls`, `password_resets`, `periods`, `practice_types`, `practice_project_terms`, `practice_links`, `practice_videos`, `project_types`, `project_type_disciplines`, `qualifications`, `qualification_academic_products`, `screening_histories`, `user_access_permissions`, `users_events`, `lawsuit_aux_ids`, `lawsuit_act_types`, `process_documents`, `practice_acts`, `performed_acts`, `performed_act_act_types`, `act_type_courses`, `act_performed_acts`, `config_certificates`, `calendar_types`, `calendar_type_permissions`, `locals_courses`, `campi` | Diversos - específicos do sistema legado |

---

## Ações Necessárias

### Ação 1: Extração e Limpeza do Schema
- Extrair CREATE TABLE de todas as 191 tabelas do dump
- Remover dados (INSERT), comentários MySQL, AUTO_INCREMENT fixos, charset definitions
- Gerar arquivo SQL limpo portável

### Ação 2: Identificação de Tabelas Úteis
- Separar ~15-20 tabelas de alto/médio impacto
- Catalogar colunas e tipos de cada uma
- Identificar dependências entre tabelas (FKs)
- Mapear ~140+ tabelas ignoradas com justificativa

### Ação 3: Refatoração dos Models e Fluxos de Dados
- Criar/adaptar Eloquent models para cada tabela migrada
- Refatorar Model User: remover `tenant_id` do fillable, casts e relações; adicionar `profile_id`, `cpf`, `rg`, `telephone`, `oab`, `registration_number` e demais campos do dump
- Refatorar Model Template: remover `BelongsToTenant` trait, remover `tenant_id` do fillable
- Refatorar Model Document: remover `BelongsToTenant` trait, remover `tenant_id` do fillable
- Desabilitar/remover Middleware EnsureUserHasTenant das rotas
- Remover trait BelongsToTenant e TenantScope (ou isolar apenas para modelos novos que precisem de tenant)
- Refatorar LoginController/AuthController: remover dependência de tenant_id no login, autenticar pelo schema de users do dump (email + password)
- Refatorar API controllers de templates, documentos e variáveis: remover `auth()->user()->tenant_id` de todas as queries
- Instalar spatie/laravel-permission e adaptar para schema de permissions/roles do dump
- Criar middleware de autorização baseado em profiles (substituir EnsureUserHasTenant)
- Atualizar rotas da API para não exigirem tenant context
- Configurar Sanctum para ler tokens da tabela personal_access_tokens (já existe)
- Ajustar factorys e seeders

### Ação 4: Migração de Dados
- Criar migrations SQL ou seeders para importar dados
- Preservar IDs originais para manter integridade referencial
- Validar consistência (FKs, valores nulos, tipos)
- Importar activity_log: mapear subject_type/causer_type do dump para classes do projeto (ou manter null)
- Migrar cities/states para uso em formulários de templates
- Migrar permissions/roles: atualizar model_type de `App\Models\User\User` para `App\Models\User`
- Migrar profile_id em users: garantir FK exista para a tabela profiles migrada
- Validar fluxo de login com dados migrados (email + senha hashed)

### Ação 5: Adaptação da Infraestrutura
- Configurar banco de dados (SQLite ou MySQL para compatibilidade com dump)
- Ajustar database.php no Laravel
- Configurar permissões de acesso via profiles/permissions do dump
- Garantir compatibilidade spatie/laravel-permission com schema do dump
- Ajustar rotas da API para remover tenant context dos endpoints
- Garantir que o fluxo de hybrid saving (LocalStorage → API) funcione sem tenant_id

---

## Medidas

### Medida 1: Preservação de Dados
- Manter IDs originais de todas as tabelas migradas
- Não reatribuir IDs para evitar quebra de relações e referências no activity_log
- Backups antes de qualquer migração
- Mapear subject_type/causer_type do activity_log para null se classe não existir

### Medida 2: Compatibilidade de Schema
- Dump é MySQL; projeto usa SQLite — verificar compatibilidade de tipos
- Campos JSON: MySQL tem nativo; SQLite usa TEXT com casts ($casts no model)
- Campos longtext (como description em acts, clients): SQLite TEXT não tem limite prático, ok
- Remover ENGINE=InnoDB (específico MySQL)
- Adaptar CHARSET/COLLATE para SQLite
- Garantir que `email` único funcione no SQLite (índice único)

### Medida 3: Segurança
- Senhas no dump estão hasheadas com bcrypt — compatível com Laravel
- Não re-hash; migrar como estão
- Preservar tokens existentes (remember_token, access_token) para não invalidar sessões ativas

### Medida 4: Versionamento
- Manter dump_clean.sql versionado no repositório
- Criar migration SQL separada para cada grupo de tabelas
- Documentar tabelas ignoradas e por quê
- Documentar mudanças no fluxo de dados (remoção de tenant_id, novo fluxo de permissões)

### Medida 5: Fluxo de Autenticação e Autorização
- Após migração, testar login com credenciais do dump antes de qualquer outra operação
- profiles devem ser migrados antes de users (FK profile_id)
- permissions/roles devem ser migrados antes de model_has_permissions/model_has_roles
- Implementar testes de autorização para cada perfil após migração
- Garantir que o middleware EnsureUserHasTenant seja removido de kernel.php e das rotas

---

## Tempo Estimado Detalhado

| Ação | Sub-ação | Horas |
|------|----------|-------|
| **Extração e limpeza** | Extrair CREATE TABLE (191 tabelas) | 2h |
| | Remover dados/comentários/MySQLisms | 2h |
| | Gerar dump_clean.sql portável | 1h |
| | *Subtotal* | *5h* |
| **Identificação** | Catalogar 15-20 tabelas úteis (colunas, tipos, dependências) | 4h |
| | Mapear 140+ tabelas ignoradas com justificativa | 3h |
| | *Subtotal* | *7h* |
| **Migração de dados** | Migrar users + profiles (core) | 8h |
| | Migrar permissions + roles + RBAC | 6h |
| | Migrar activity_log (4631 registros) | 4h |
| | Migrar cities + states (5600 registros) | 2h |
| | Migrar configurações (configurations, configs) | 2h |
| | Migrar act_types, competences, demais tabelas úteis | 6h |
| | VALIDAÇÃO: checar FKs, consistência, dados órfãos | 4h |
| | *Subtotal* | *32h* |
| **Refatoração de models e fluxos** | Refatorar Model User (schema dump, remover tenant_id) | 4h |
| | Refatorar Model Template/Document (remover BelongsToTenant) | 2h |
| | Refatorar controllers: remover auth()->user()->tenant_id | 4h |
| | Instalar/configurar spatie/laravel-permission | 4h |
| | Criar middleware de autorização baseado em profiles | 4h |
| | Remover EnsureUserHasTenant das rotas/kernel | 1h |
| | Ajustar LoginController/AuthController | 2h |
| | Ajustar rotas API (remover tenant context) | 2h |
| | *Subtotal* | *23h* |
| **Infraestrutura** | Verificar compatibilidade MySQL→SQLite | 4h |
| | Configurar banco de dados | 2h |
| | Testes de integração (login, CRUD, autorização) | 8h |
| | *Subtotal* | *14h* |
| | **TOTAL** | **~81 horas** |
