# ⚽ Bolão da Copa do Mundo

Aplicação web de bolão para a Copa do Mundo 2026 com apostas de placar, ranking em tempo real e importação automática de jogos oficiais via OpenFootball + Google Gemini.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Pontuação](#pontuação)
- [Configuração e Instalação](#configuração-e-instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Rotas](#rotas)
- [Perfis e Permissões](#perfis-e-permissões)
- [Painel Admin](#painel-admin)

---

## Visão Geral

O Bolão da Copa permite que usuários cadastrados façam palpites de placar para cada jogo da Copa do Mundo 2026. Ao final de cada partida, pontos são calculados automaticamente via função SQL no Supabase. Um ranking global classifica os jogadores por pontos, acertos exatos e acertos de vencedor.

O painel administrativo oferece:
- Importação automática dos jogos reais da Copa 2026 via **OpenFootball** (calendário oficial da FIFA)
- Enriquecimento dos dados via **Google Gemini** (tradução dos nomes e emojis de bandeiras)
- Sincronização inteligente: detecta automaticamente jogos novos, alterados ou sem mudanças
- Gerenciamento manual de jogos (criar, editar, alterar status)
- Lançamento de resultados e recálculo automático de pontos

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vue 3 (SFC `<script setup>`) |
| UI | Vuetify 3 + Material Design Icons |
| Estado | Pinia 3 |
| Roteamento | Vue Router 4 |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| Dados de jogos | OpenFootball (calendário oficial FIFA, sem API key) |
| IA | Google Gemini API (`@google/genai`) |
| Build | Vite 8 |
| Validação de e-mail | mailchecker (provedores descartáveis) + EVA API (MX record) |

---

## Funcionalidades

### Usuário
- Cadastro e login com e-mail e senha (Supabase Auth)
- Tela de login redesenhada: layout dividido, imagem lateral com blur, sem header/footer
- Tela de criar conta redesenhada: layout dividido, imagem lateral (estádio futurístico), sem header/footer
- Lembrar e-mail: checkbox "Lembrar-me" salva o e-mail no localStorage para próximo acesso
- Recuperação de senha por e-mail (link enviado pelo Supabase)
- Redefinição de senha via página dedicada com validação de confirmação
- Validação de e-mail em 2 camadas: bloqueio offline de provedores descartáveis (mailchecker) + verificação de domínio real via EVA API (MX record)
- Requisitos de senha fortes: mínimo 8 caracteres, letra maiúscula, minúscula e número, com indicador visual em tempo real
- Botão "Criar conta" habilitado somente quando todos os requisitos de senha, e-mail válido e aceite dos termos estão ok
- Bloqueio de e-mail duplicado: botão desabilitado após erro de e-mail já cadastrado até o usuário trocar o endereço
- Tratamento de e-mail no limbo no cadastro: quando o e-mail já foi cadastrado mas nunca confirmado, exibe banner de aviso com botão para reenviar o link de confirmação sem precisar criar uma nova conta
- Tratamento de e-mail no limbo no login: quando o usuário tenta entrar com credenciais corretas mas o e-mail ainda não foi confirmado, é redirecionado automaticamente para a tela `/aguardando-confirmacao` com instruções claras e botão para reenviar o link
- Aceite obrigatório dos Termos de Uso e Privacidade ao criar conta
- Página de Termos de Uso e Privacidade com 8 seções completas (LGPD, regras do bolão, privacidade, contato)
- Página de confirmação de conta com instruções passo a passo para ativar a conta via e-mail, exibida automaticamente após o cadastro bem-sucedido
- Transições animadas entre páginas (fade + translate)
- Página "Como usar" com duas abas: guia de login e guia completo de criação de conta
- Toast de boas-vindas ao fazer login e toast de erro em credenciais inválidas
- Dashboard pessoal com card de perfil (avatar escolhido pelo usuário ou inicial do nome, pontos e posição no ranking), jogos abertos para palpite, próximos jogos e últimos resultados
- Listagem de jogos com filtros por status e fase
- Palpite de placar por jogo (criação e edição enquanto a aposta está aberta)
- Ranking global com medalhas para o top 3
- **Página "Minha Conta"** acessível pelo menu hamburguer, com 4 abas:
  - **Dados Pessoais:** seleção de avatar (clique no avatar ou no ícone de câmera para abrir o catálogo); editar nome, data de nascimento (validação de maioridade ≥ 18 anos), telefone; e-mail somente leitura; botão "Salvar alterações" habilitado apenas quando há mudanças reais em relação ao que está salvo
  - **Segurança:** campo senha atual obrigatório + nova senha + confirmação; botão habilitado somente quando todos os requisitos estão satisfeitos; redireciona para o Dashboard com toast de confirmação após troca bem-sucedida
  - **Preferências:** toggles de notificações por e-mail e por ranking com salvamento automático ao alternar
  - **Excluir Conta:** zona de perigo com checkbox de confirmação + diálogo de confirmação final; exclusão em cascata via RPC SQL

### Admin
- Importação dos jogos reais da Copa 2026 em ~5s (antes levava 20-40s)
- Sincronização inteligente: jogos novos são inseridos, alterados são atualizados, iguais são ignorados
- Preview com indicador visual por jogo: **Novo** (verde), **Alterado** (laranja), **Igual** (cinza)
- CRUD de jogos (times, flags, data, fase, grupo, status)
- Lançamento de resultados e recálculo automático de pontos via RPC SQL
- Gerenciamento de avatares: cadastro, edição, ativação/desativação e exclusão de avatares disponíveis para os usuários escolherem em seus perfis
- **Selos da Copa**: configuração dos eventos que concedem selos aos jogadores (baú diário, acerto de placar, acerto de vencedor, empate, palpite enviado, bônus mata-mata)

---

## Estrutura do Projeto

```
copa-do-mundo/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── supabase/
│   ├── schema.sql              # Schema principal: tabelas, funções, triggers, RLS
│   ├── avatars-schema.sql      # Schema isolado: tabela avatars, RLS, bucket de storage
│   └── coins-schema.sql        # Schema de selos: tabela seal_rewards, RLS e seed de eventos
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js                 # Bootstrap: Vue + Pinia + Vuetify + Router
    ├── App.vue                 # Root component com transição page-fade entre rotas e provide do seletor de avatar
    ├── router/
    │   └── index.js            # 16 rotas com guards de autenticação e papel
    ├── stores/
    │   ├── auth.js             # Sessão, perfil, login, registro, logout
    │   ├── avatars.js          # CRUD de avatares + upload para Supabase Storage
    │   ├── games.js            # CRUD de jogos, lançamento de resultados
    │   ├── bets.js             # Palpites do usuário autenticado
    │   ├── ranking.js          # Leaderboard global
    │   ├── sealRewards.js      # CRUD dos eventos de selos (somente admin)
    │   └── toast.js            # Notificações globais (snackbar)
    ├── lib/
    │   ├── supabase.js         # Cliente Supabase
    │   ├── footballApi.js      # Busca jogos oficiais da Copa 2026 via OpenFootball
    │   └── gemini.js           # Tradução de nomes e emojis de bandeiras via Gemini
    ├── components/
    │   ├── AppLayout.vue       # Navbar + footer com links dinâmicos por papel e toast global
    │   └── GameCard.vue        # Card reutilizável de jogo com palpite e pontos
    └── pages/
        ├── HomePage.vue
        ├── LoginPage.vue        # Layout split-screen redesenhado
        ├── RegisterPage.vue
        ├── ForgotPasswordPage.vue  # Recuperação de senha por e-mail
        ├── ResetPasswordPage.vue   # Redefinição de senha com token
        ├── HowToPage.vue           # Guia de uso: abas de login e criação de conta
        ├── TermsPage.vue           # Termos de Uso e Privacidade (8 seções, LGPD)
        ├── AccountCreatedPage.vue  # Instruções passo a passo de ativação de conta (pós-cadastro)
        ├── PendingConfirmationPage.vue # Tela de limbo no login: conta cadastrada, e-mail não confirmado
        ├── DashboardPage.vue
        ├── GamesPage.vue
        ├── BetPage.vue
        ├── RankingPage.vue
        ├── AccountPage.vue         # Minha Conta: dados pessoais, segurança, preferências, exclusão
        ├── AdminPage.vue
        ├── AdminAvatarsPage.vue    # Gerenciamento de avatares (somente admin)
        ├── AdminSealsPage.vue      # Configuração de selos por evento (somente admin)
        └── NotFoundPage.vue        # 404 animado com bola de futebol
```

---

## Banco de Dados

Schema principal em [supabase/schema.sql](supabase/schema.sql).
Schema de avatares em [supabase/avatars-schema.sql](supabase/avatars-schema.sql) — aplicar separadamente, após o schema principal.
Schema de selos em [supabase/coins-schema.sql](supabase/coins-schema.sql) — aplicar separadamente, após o schema principal.

### Tabelas

#### `profiles`
Extensão de `auth.users`. Criada automaticamente via trigger no signup.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | FK → auth.users |
| name | text | Nome do usuário |
| role | text | `'user'` \| `'admin'` |
| birth_date | date | Data de nascimento (opcional, validação de maioridade ≥ 18 anos) |
| phone | text | Telefone (opcional) |
| avatar_url | text | URL do avatar escolhido pelo usuário (selecionado via catálogo de avatares) |
| notifications_email | boolean | Preferência de notificações por e-mail (padrão: true) |
| notifications_ranking | boolean | Preferência de notificações de ranking (padrão: true) |
| created_at | timestamptz | — |

#### `games`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| team_a / team_b | text | Nomes dos times |
| flag_a / flag_b | text | Emojis de bandeira |
| match_date | timestamptz | Data e hora da partida |
| phase | text | `group` \| `round_of_16` \| `quarter` \| `semi` \| `final` |
| group_name | text | Letra do grupo (fase de grupos) |
| status | text | `upcoming` \| `open` \| `closed` \| `live` \| `finished` |
| score_a / score_b | int | Placar final (nullable) |
| bet_opens_at / bet_closes_at | timestamptz | Janela de apostas |

> Constraint `games_unique_match` garante unicidade por `(team_a, team_b, match_date)`, evitando duplicatas na importação.

> Trigger `set_bet_window()` calcula automaticamente a janela de apostas: abre 24h antes e fecha no horário da partida.

#### `bets`
| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| game_id | uuid | FK → games |
| score_a / score_b | int | Palpite do usuário |
| points | int | Pontos obtidos após resultado |
| hit_type | text | `exact` \| `winner` \| `draw` \| null |

> Unique constraint em `(user_id, game_id)` — um palpite por jogo por usuário.

#### `ranking`
| Coluna | Tipo | Descrição |
|---|---|---|
| user_id | uuid | PK, FK → profiles |
| total_points | int | Soma total de pontos |
| exact_hits | int | Acertos de placar exato |
| winner_hits | int | Acertos de vencedor |
| draw_hits | int | Acertos de empate |
| total_bets | int | Total de palpites feitos |

> Atualizada via RPC `recalculate_game_bets(game_id)` ao lançar um resultado.

#### `avatars`
Catálogo de avatares disponíveis para os usuários escolherem em seus perfis. Gerenciado pelo admin via `/admin/avatares`.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| name | text | Nome de exibição do avatar |
| url | text | URL pública da imagem |
| category | text | Categoria opcional para agrupamento |
| active | boolean | Se visível para os usuários (padrão: true) |
| created_by | uuid | FK → auth.users (admin que criou) |
| created_at | timestamptz | — |

> RLS: usuários autenticados veem apenas avatares com `active = true`; admins veem todos.
> Storage: bucket público `avatars` no Supabase Storage armazena as imagens enviadas via upload.

#### `seal_rewards`
Tabela de configuração dos eventos que concedem selos aos jogadores. Gerenciada pelo admin via `/admin/selos`.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| event_key | text | Chave única do evento (ex: `daily_chest`, `exact_score`) |
| label | text | Nome de exibição (ex: "Baú Diário") |
| description | text | Descrição curta do evento (opcional) |
| seals | int | Quantidade de selos concedidos (≥ 0) |
| icon | text | Ícone MDI (ex: `mdi-treasure-chest`) |
| active | boolean | Se o evento está ativo (padrão: true) |
| created_at | timestamptz | — |

> RLS: usuários autenticados podem ler; apenas admins podem inserir, atualizar e deletar.
> Eventos iniciais criados via seed: `daily_chest`, `exact_score`, `winner_hit`, `draw_hit`, `bet_sent`, `knockout_bonus`.

### Funções SQL principais

| Função | Descrição |
|---|---|
| `calculate_hit_type(...)` | Compara palpite vs resultado, retorna tipo de acerto |
| `points_for_hit(hit)` | Converte tipo de acerto em pontos |
| `recalculate_game_bets(game_id)` | Calcula pontos de todos os palpites de um jogo e atualiza ranking |
| `handle_new_user()` | Trigger: cria perfil automaticamente no signup |
| `set_bet_window()` | Trigger: define janela de apostas ao criar/atualizar jogo |
| `delete_user()` | RPC com SECURITY DEFINER: exclui o usuário autenticado de `auth.users` (cascade apaga profiles, bets e ranking) |

---

## Pontuação

| Tipo de acerto | Pontos |
|---|---|
| Placar exato | **10 pts** |
| Vencedor correto (não exato) | **5 pts** |
| Empate correto (não exato) | **5 pts** |
| Errou | **0 pts** |

**Critério de desempate no ranking:** total de pontos → acertos exatos → acertos de vencedor → total de palpites.

---

## Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Chave de API do [Google Gemini](https://aistudio.google.com)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/darioreisjr/copadomundo2026.git
cd copadomundo2026

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves (ver seção abaixo)

# 4. Aplique os schemas no Supabase
# Acesse seu projeto Supabase → SQL Editor
# Execute primeiro:  supabase/schema.sql
# Execute depois:    supabase/avatars-schema.sql
# Execute por fim:   supabase/coins-schema.sql

# 5. Adicione a constraint de unicidade (se o banco já existia)
# Execute no SQL Editor do Supabase:
# ALTER TABLE public.games DROP CONSTRAINT IF EXISTS games_unique_match;
# ALTER TABLE public.games ADD CONSTRAINT games_unique_match UNIQUE (team_a, team_b, match_date);

# 6. Crie o primeiro usuário admin
# Registre normalmente na aplicação, depois atualize via SQL:
# UPDATE profiles SET role = 'admin' WHERE id = '<seu-uuid>';

# 7. Inicie o servidor de desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_GEMINI_API_KEY=sua-gemini-api-key
VITE_EVA_API_URL=https://api.eva.pingutil.com/email
```

> As variáveis `VITE_*` são expostas no bundle do cliente. **Nunca** coloque a service role key do Supabase aqui.

> `VITE_EVA_API_URL` — API gratuita sem necessidade de chave, usada para verificar se o domínio do e-mail possui servidor de e-mail ativo (MX record) durante o cadastro.

---

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento (Vite)
npm run build    # Build de produção → /dist
npm run preview  # Preview do build local
```

---

## Rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` | HomePage | Público |
| `/login` | LoginPage | Público (redireciona se logado) |
| `/register` | RegisterPage | Público (redireciona se logado) |
| `/como-usar` | HowToPage | Público |
| `/termos` | TermsPage | Público |
| `/forgot-password` | ForgotPasswordPage | Público |
| `/reset-password` | ResetPasswordPage | Público |
| `/conta-criada` | AccountCreatedPage | Público |
| `/aguardando-confirmacao` | PendingConfirmationPage | Público |
| `/dashboard` | DashboardPage | Autenticado |
| `/games` | GamesPage | Autenticado |
| `/games/:id/bet` | BetPage | Autenticado |
| `/ranking` | RankingPage | Autenticado |
| `/minha-conta` | AccountPage | Autenticado |
| `/admin` | AdminPage | Admin apenas |
| `/admin/avatares` | AdminAvatarsPage | Admin apenas |
| `/admin/selos` | AdminSealsPage | Admin apenas |
| `/:pathMatch(.*)*` | NotFoundPage | Público (404) |

---

## Perfis e Permissões

| Ação | Usuário | Admin |
|---|---|---|
| Ver jogos | ✅ | ✅ |
| Fazer palpite | ✅ | ✅ |
| Ver ranking | ✅ | ✅ |
| Editar próprio perfil e senha | ✅ | ✅ |
| Excluir própria conta | ✅ | ✅ |
| Criar/editar jogos | ❌ | ✅ |
| Lançar resultados | ❌ | ✅ |
| Acessar painel admin | ❌ | ✅ |
| Ver palpites de outros | ❌ | ✅ |
| Gerenciar avatares do catálogo | ❌ | ✅ |
| Configurar selos da copa | ❌ | ✅ |

RLS (Row Level Security) ativado em todas as tabelas. As políticas estão definidas em `supabase/schema.sql` e `supabase/avatars-schema.sql`.

---

## Painel Admin

Acesse `/admin` com uma conta de role `admin`. O menu lateral exibe três itens exclusivos para admins: **Painel Admin**, **Avatares** e **Selos da Copa**.

### Aba 1 — Importar Jogos

Importa os jogos reais da Copa 2026 em duas etapas automáticas:

1. **Busca via OpenFootball** (~200ms): calendário oficial da FIFA sem necessidade de API key
2. **Enriquecimento via Gemini** (~3-5s): traduz os nomes dos times para português e adiciona emojis de bandeiras

Após a busca, uma tabela de preview exibe cada jogo com seu status de sincronização:

| Chip | Cor | Significado |
|---|---|---|
| Novo | Verde | Será inserido no banco |
| Alterado | Laranja | Dados diferentes do banco — será atualizado |
| Igual | Cinza | Sem mudanças — será ignorado |

Clique em **Confirmar e sincronizar** para aplicar apenas as mudanças necessárias. O resultado exibe quantos jogos foram inseridos, atualizados, ignorados ou tiveram erro.

### Aba 2 — Gerenciar Jogos
- Visualize todos os jogos com status editável inline
- Clique em **Novo Jogo** para adicionar manualmente
- Campos: Time A/B, Bandeira A/B (emoji), Data, Fase, Grupo

### Aba 3 — Lançar Resultados
- Lista jogos com status `closed` ou `live`
- Insira o placar final e clique em **Salvar**
- Pontos de todos os palpites são recalculados automaticamente

### Avatares — `/admin/avatares`
Gerenciamento do catálogo de avatares disponíveis para os usuários:

- **Cadastrar** novo avatar com nome, categoria opcional e imagem (URL externa ou upload direto)
- **Editar** nome, categoria e status de qualquer avatar
- **Ativar / Desativar** avatar (soft delete — inativo fica invisível para usuários)
- **Excluir definitivamente** (hard delete — remove o registro permanentemente)
- Imagens enviadas são armazenadas no bucket público `avatars` do Supabase Storage

### Selos da Copa — `/admin/selos`
Configuração do sistema de recompensas em **Selos** (⚽) concedidos aos jogadores por cada tipo de ação:

- **Cards de resumo** no topo: total de tipos de evento, selos por login diário e selos num jogo perfeito
- **Cadastrar** novo evento com nome, chave (slug único), descrição, quantidade de selos e ícone MDI
- **Editar** configurações de qualquer evento (a chave não pode ser alterada após criação)
- **Ativar / Desativar** evento — eventos inativos não concedem selos
- **Excluir** evento permanentemente
- Pré-visualização do ícone em tempo real durante criação/edição

**Eventos pré-cadastrados via seed:**

| Chave | Evento | Selos padrão |
|---|---|---|
| `daily_chest` | Baú Diário | 10 |
| `exact_score` | Acerto Exato do Placar | 50 |
| `winner_hit` | Acerto do Vencedor | 20 |
| `draw_hit` | Acerto de Empate | 20 |
| `bet_sent` | Palpite Enviado | 5 |
| `knockout_bonus` | Bônus Mata-Mata | 30 |
