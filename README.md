# ⚽ Bolão da Copa do Mundo

Aplicação web de bolão para a Copa do Mundo com apostas de placar, ranking em tempo real e geração de jogos via IA (Google Gemini).

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

O Bolão da Copa permite que usuários cadastrados façam palpites de placar para cada jogo da Copa do Mundo. Ao final de cada partida, pontos são calculados automaticamente via função SQL no Supabase. Um ranking global classifica os jogadores por pontos, acertos exatos e acertos de vencedor.

O painel administrativo oferece:
- Geração automática de jogos via **Google Gemini**
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
| IA | Google Gemini API (`@google/genai`) |
| Build | Vite 8 |

---

## Funcionalidades

### Usuário
- Cadastro e login com e-mail e senha (Supabase Auth)
- Dashboard pessoal com pontuação, posição no ranking, acertos exatos e total de palpites
- Listagem de jogos com filtros por status e fase
- Palpite de placar por jogo (criação e edição enquanto a aposta está aberta)
- Ranking global com medalhas para o top 3

### Admin
- Geração de jogos com IA (Google Gemini) a partir de um prompt customizável
- Preview e edição dos jogos sugeridos antes de salvar
- CRUD de jogos (times, flags, data, fase, grupo, status)
- Lançamento de resultados e recálculo automático de pontos via RPC SQL

---

## Estrutura do Projeto

```
copa-do-mundo/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── supabase/
│   └── schema.sql          # Schema completo: tabelas, funções, triggers, RLS
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js             # Bootstrap: Vue + Pinia + Vuetify + Router
    ├── App.vue             # Root component (<router-view />)
    ├── router/
    │   └── index.js        # 8 rotas com guards de autenticação e papel
    ├── stores/
    │   ├── auth.js         # Sessão, perfil, login, registro, logout
    │   ├── games.js        # CRUD de jogos, lançamento de resultados
    │   ├── bets.js         # Palpites do usuário autenticado
    │   └── ranking.js      # Leaderboard global
    ├── lib/
    │   ├── supabase.js     # Cliente Supabase
    │   └── gemini.js       # Wrapper para geração de jogos com Gemini
    ├── components/
    │   ├── AppLayout.vue   # Navbar + footer com links dinâmicos por papel
    │   └── GameCard.vue    # Card reutilizável de jogo com palpite e pontos
    └── pages/
        ├── HomePage.vue
        ├── LoginPage.vue
        ├── RegisterPage.vue
        ├── DashboardPage.vue
        ├── GamesPage.vue
        ├── BetPage.vue
        ├── RankingPage.vue
        └── AdminPage.vue
```

---

## Banco de Dados

Schema completo em [supabase/schema.sql](supabase/schema.sql). Aplicar diretamente no SQL Editor do Supabase.

### Tabelas

#### `profiles`
Extensão de `auth.users`. Criada automaticamente via trigger no signup.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | FK → auth.users |
| name | text | Nome do usuário |
| role | text | `'user'` \| `'admin'` |
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

### Funções SQL principais

| Função | Descrição |
|---|---|
| `calculate_hit_type(...)` | Compara palpite vs resultado, retorna tipo de acerto |
| `points_for_hit(hit)` | Converte tipo de acerto em pontos |
| `recalculate_game_bets(game_id)` | Calcula pontos de todos os palpites de um jogo e atualiza ranking |
| `handle_new_user()` | Trigger: cria perfil automaticamente no signup |
| `set_bet_window()` | Trigger: define janela de apostas ao criar/atualizar jogo |

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

# 4. Aplique o schema no Supabase
# Acesse seu projeto Supabase → SQL Editor
# Cole e execute o conteúdo de supabase/schema.sql

# 5. Crie o primeiro usuário admin
# Registre normalmente na aplicação, depois atualize via SQL:
# UPDATE profiles SET role = 'admin' WHERE id = '<seu-uuid>';

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_GEMINI_API_KEY=sua-gemini-api-key
```

> As variáveis `VITE_*` são expostas no bundle do cliente. **Nunca** coloque a service role key do Supabase aqui.

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
| `/dashboard` | DashboardPage | Autenticado |
| `/games` | GamesPage | Autenticado |
| `/games/:id/bet` | BetPage | Autenticado |
| `/ranking` | RankingPage | Autenticado |
| `/admin` | AdminPage | Admin apenas |

---

## Perfis e Permissões

| Ação | Usuário | Admin |
|---|---|---|
| Ver jogos | ✅ | ✅ |
| Fazer palpite | ✅ | ✅ |
| Ver ranking | ✅ | ✅ |
| Criar/editar jogos | ❌ | ✅ |
| Lançar resultados | ❌ | ✅ |
| Acessar painel admin | ❌ | ✅ |
| Ver palpites de outros | ❌ | ✅ |

RLS (Row Level Security) ativado em todas as tabelas. As políticas estão definidas em `supabase/schema.sql`.

---

## Painel Admin

Acesse `/admin` com uma conta de role `admin`.

### Aba 1 — Gerar com Gemini
1. Edite o prompt (pré-preenchido para fase de grupos)
2. Clique em **Gerar com Gemini**
3. Revise e edite os jogos na tabela de preview
4. Clique em **Confirmar e Salvar Todos**

### Aba 2 — Gerenciar Jogos
- Visualize todos os jogos com status editável inline
- Clique em **Novo Jogo** para adicionar manualmente
- Campos: Time A/B, Bandeira A/B (emoji), Data, Fase, Grupo

### Aba 3 — Lançar Resultados
- Lista jogos com status `closed` ou `live`
- Insira o placar final e clique em **Salvar**
- Pontos de todos os palpites são recalculados automaticamente
