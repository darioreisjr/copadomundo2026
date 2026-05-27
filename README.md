# Bolão Copa 26

Aplicação web de bolão para a Copa do Mundo 2026 com apostas de placar, ranking em tempo real e importação automática de jogos oficiais via OpenFootball + Google Gemini.

<img width="1899" height="915" alt="image" src="https://github.com/user-attachments/assets/c0c5ec1c-9892-4b80-bd5f-141a75485331" />

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
- **Landing page redesenhada:** design minimalista e moderno com efeito parallax duplo no hero (gradiente + imagem de estádio), scroll reveal com `IntersectionObserver`, seções dedicadas a Grupos, Selos e Consultor IA, pills de estatísticas e sem uso de ícones MDI
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
- **Navegação responsiva:** menu lateral fixo no desktop; barra de ícones no rodapé (mobile) com "Grupos" e "Criar Grupo" agrupados sob ícone "+" e menu admin agrupado sob ícone de escudo; hambúrguer abre tela cheia no mobile; abas do Painel Admin, Minha Conta e detalhe de grupo substituídas por select dropdown no mobile; listas administrativas (avatares, selos) exibidas como cards adaptativos com ações em botões de largura total no mobile; página de detalhe do grupo com layout mobile dedicado (botão Voltar com texto, avatar e botão Sair na mesma linha, nome/descrição/status em linhas separadas); página "Meus Grupos" com input de pesquisa em largura total e botão "Encontrar Grupo" em linha separada no mobile; página "Meus Grupos" (`/meus-grupos`) com botão "+ Criar Grupo" em linha separada abaixo do título, ocupando largura total no mobile (desktop inalterado); input de convidar membro por `@username` em `/meus-grupos/:id` ocupa largura total no mobile
- Página "Como usar" com duas abas: guia de login e guia completo de criação de conta
- Toast de boas-vindas ao fazer login e toast de erro em credenciais inválidas
- Dashboard pessoal com card de perfil (avatar escolhido pelo usuário ou inicial do nome, pontos, posição no ranking e total de selos), jogos abertos para palpite, próximos jogos e últimos resultados
- **Seletor de avatar redesenhado:** modal de dois painéis — esquerda exibe o catálogo em grade 3×N (avatares desbloqueados sempre primeiro, bloqueados com cadeado e custo em selos); direita exibe preview em tela cheia do avatar selecionado; clicar em avatar bloqueado abre diálogo de confirmação de desbloqueio com verificação de saldo
- **Desbloqueio de avatares por selos:** avatares com `seal_cost > 0` requerem gasto de selos para serem usados; a RPC `unlock_avatar` é atômica (debita selos e registra desbloqueio em única transação)
- Listagem de jogos com filtros por status e fase
- Palpite de placar por jogo: primeira vez gratuita; após salvar, a tela exibe o placar em modo somente leitura — atualizar um palpite existente custa 30 selos (confirmação via diálogo antes do débito); placar centralizado nos campos de entrada; feedback de sucesso via toast no canto inferior direito
- **Especialista IA:** botão "Chamar Especialista" na tela de palpite custa **20 selos** e consulta o histórico real de confrontos entre as duas seleções em Copas do Mundo (via OpenFootball, 1930–2022), passando os dados verificados ao Google Gemini para gerar análise estatística com vitórias, empates, gols, probabilidades de cada resultado e sugestão de placar; a análise é gerada **uma única vez** e armazenada em cache no banco (tabela `match_analyses`) — usuários subsequentes reutilizam o resultado sem nova chamada à IA; o usuário que já pagou tem a análise carregada automaticamente ao retornar à página e o botão fica desabilitado (consulta registrada em `user_seals` com `event_key = 'ai_expert_called'`)
- **Grupos privados e públicos:** crie grupos com nome, descrição, imagem (URL ou upload) e privacidade (privado/público); convide participantes por `@username`; ranking privado do grupo calculado automaticamente a partir dos palpites reais dos membros — todos os membros ativos aparecem no ranking mesmo sem palpites (valores zerados); busca de grupos (públicos e privados) por nome e descoberta de grupo aleatório em "Grupos"; grupos públicos permitem entrada direta via botão "Entrar" e confirmação; **grupos privados exigem solicitação de entrada** — botão "Solicitar" envia pedido ao dono, que aparece como chip "Aguardando" até aprovação ou rejeição; membros não-donos podem sair do grupo digitando "SAIR DO GRUPO" para confirmar; remoção de membro exige digitação do nome exato do usuário para confirmar; ranking do grupo visível apenas para membros; **"Meus Grupos"** (`/meus-grupos`) lista exclusivamente os grupos criados pelo próprio usuário com dialog de criação integrado — ao clicar num grupo abre `/meus-grupos/:id` com duas abas exclusivas para o dono: **Membros** (convidar por `@username`; seção separada de **Solicitações de entrada** com botões Aceitar/Rejeitar por linha; membros ativos e convites pendentes exibidos em cards com status) e **Gerenciar** (editar nome, descrição, visibilidade e imagem do grupo com botão "Salvar alterações" habilitado apenas quando há mudanças reais; excluir grupo na zona de perigo); **"Grupos"** (`/grupos`) lista todos os grupos em que o usuário participa com pesquisa e botão "Encontrar Grupo" — ao entrar em um grupo exibe apenas a aba Ranking; **modal de criação responsivo:** layout do modal adaptado para mobile com seções de privacidade e imagem centralizadas, botões de toggle em largura total e espaçamento otimizado; **criação de grupo custa 100 selos** — botões de criação ficam desabilitados quando o saldo é insuficiente (badge laranja "🔒 100 selos" exibida no botão da tela vazia); ao clicar em "Criar", um dialog de confirmação exibe o nome do grupo, o custo e o saldo atual com animação de selos voando; cards de grupos sem imagem exibem placeholder verde com ícone centralizado, igual ao comportamento com imagem; ao criar um grupo, uma notificação personalizada é gerada na aba GRUPOS do painel de notificações; **sistema de vagas:** cada grupo inicia com 5 vagas (1 dono + 4 convidados); vagas adicionais são compradas com selos (+5 vagas por 50 selos, +10 vagas por 90 selos) via modal de compra com confirmação antes do débito; convites pendentes reservam vaga imediatamente; card "Vaga livre" exibido na grade de membros para cada vaga disponível — ao clicar redireciona ao campo de convite por `@username`; card "Comprar vagas" sempre visível ao final da grade para o dono; contador `(X/Y) vagas usadas` exibido acima do campo de convite
- Ranking global com medalhas para o top 3; nomes de todos os participantes exibidos corretamente (policy RLS de leitura pública de perfis); **responsivo no mobile**: exibe apenas Posição, Nome e Pontos na tabela — tocar em qualquer linha abre um modal com todos os detalhes (Placares exatos, Vencedor, Empates, Palpites); legenda "Entenda a pontuação" abaixo dos critérios de desempate explica cada coluna
- **Página "Minha Conta"** acessível pelo menu hamburguer, com 4 abas:
  - **Dados Pessoais:** seleção de avatar (clique no avatar ou no ícone de câmera para abrir o catálogo); editar nome, data de nascimento (validação de maioridade ≥ 18 anos), telefone, **username** (identificador único com `@`, validação de formato e disponibilidade em tempo real) e **nome fantasia** (apelido de exibição no bolão); e-mail somente leitura; botão "Salvar alterações" habilitado apenas quando há mudanças reais em relação ao que está salvo
  - **Segurança:** campo senha atual obrigatório + nova senha + confirmação; botão habilitado somente quando todos os requisitos estão satisfeitos; redireciona para o Dashboard com toast de confirmação após troca bem-sucedida
  - **Preferências:** toggles de notificações por e-mail e por ranking com salvamento automático ao alternar
  - **Excluir Conta:** zona de perigo com checkbox de confirmação + diálogo de confirmação final; exclusão em cascata via RPC SQL

- **Sistema de Notificações:** sino no app bar com badge de contagem de não lidas; painel dropdown com duas abas (Não lidas / Lidas); convites de grupo recebidos ficam em "Não lidas" até aceitar ou recusar; **solicitações de entrada em grupos privados** aparecem para o dono com botões Aceitar/Rejeitar inline e em popup de detalhe; selos ganhos aparecem automaticamente; **notificação de criação de grupo** exibe categoria `GRUPOS` com ícone de grupo, título personalizado com o nome do grupo e descrição informativa; ao clicar em qualquer notificação abre um popup de detalhe — convites e solicitações exibem botões de ação, selos exibem o evento e a quantidade, grupos exibem a descrição; estado de leitura persistido no localStorage por usuário

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
│   ├── schema.sql                  # Schema principal: tabelas, funções, triggers, RLS
│   ├── avatars-schema.sql          # Schema isolado: tabela avatars, RLS, bucket de storage
│   ├── coins-schema.sql            # Schema de selos: tabela seal_rewards, RLS e seed de eventos
│   ├── seals-awards-schema.sql     # Schema de distribuição: tabela user_seals, coluna total_seals, RPCs de concessão
│   ├── match-analyses-schema.sql   # Cache de análises do Especialista IA: tabela match_analyses, RLS
│   └── grupos-schema.sql           # Grupos privados/públicos: tabelas groups e group_members, RLS, funções helper, bucket group-images
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.js                 # Bootstrap: Vue + Pinia + Vuetify + Router
    ├── App.vue                 # Root component com transição page-fade, provide do seletor de avatar e modal global de selos
    ├── router/
    │   └── index.js            # 21 rotas com guards de autenticação e papel
    ├── stores/
    │   ├── auth.js             # Sessão, perfil, login, registro, logout
    │   ├── avatars.js          # CRUD de avatares + upload para Supabase Storage
    │   ├── games.js            # CRUD de jogos, lançamento de resultados
    │   ├── bets.js             # Palpites, débito de selos e verificação de pagamento do especialista
    │   ├── ranking.js          # Leaderboard global
    │   ├── groups.js           # Grupos privados/públicos: CRUD (incluindo updateGroup), convites, membros, ranking de grupo
    │   ├── sealRewards.js      # CRUD dos eventos de selos (somente admin)
    │   ├── seals.js            # Concessão de selos ao usuário: baú diário, estado do modal
    │   ├── toast.js            # Notificações globais (snackbar)
    │   └── notifications.js   # Agregação de notificações: convites pendentes, selos ganhos e resultados de solicitação de entrada em grupos (tabela `notifications`); leitura persistida no banco
    ├── composables/
    │   └── useMatchAnalysis.js # Cache do Especialista IA: busca no Supabase ou gera via Gemini e salva
    ├── lib/
    │   ├── supabase.js         # Cliente Supabase
    │   ├── footballApi.js      # Busca jogos oficiais da Copa 2026 via OpenFootball
    │   ├── openfootball.js     # Busca histórico real de confrontos entre seleções (Copas do Mundo 1930–2022)
    │   └── gemini.js           # Tradução de nomes/bandeiras e análise estatística de confrontos via Gemini
    ├── components/
    │   ├── AppLayout.vue       # Layout principal: menu lateral (desktop), bottom nav com ícones (mobile), drawer fullscreen do hambúrguer (mobile), footer e toast global
    │   ├── GameCard.vue        # Card reutilizável de jogo com palpite e pontos
    │   ├── SealRewardModal.vue    # Modal animado de recompensa de selos (baú diário e outros eventos)
  │   └── NotificationPanel.vue # Sino de notificações no app bar: convites de grupo e selos ganhos, popup de detalhe ao clicar, badge de não lidas
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
        ├── MeusGruposPage.vue          # Grupos: listagem dos grupos em que participo + convites recebidos
        ├── MeusGruposOwnerPage.vue     # Meus Grupos: lista e cria grupos próprios do usuário
        ├── GrupoDetailPage.vue         # Detalhe do grupo: ranking privado (/grupos/:id) e abas Membros + Gerenciar (/meus-grupos/:id)
        ├── AccountPage.vue         # Minha Conta: dados pessoais, segurança, preferências, exclusão
        ├── AdminPage.vue
        ├── AdminAvatarsPage.vue    # Gerenciamento de avatares (somente admin)
        ├── AdminSealsPage.vue      # Configuração de selos por evento (somente admin)
        └── NotFoundPage.vue        # 404 animado com bola de futebol
```

---

## Banco de Dados

Schema principal em [supabase/schema.sql](supabase/schema.sql).
Schema de avatares em [supabase/avatars-schema.sql](supabase/avatars-schema.sql) — aplicar após o schema principal.
Schema de eventos de selos em [supabase/coins-schema.sql](supabase/coins-schema.sql) — aplicar após o schema principal.
Schema de distribuição de selos em [supabase/seals-awards-schema.sql](supabase/seals-awards-schema.sql) — aplicar após coins-schema.sql.
Schema de cache do Especialista IA em [supabase/match-analyses-schema.sql](supabase/match-analyses-schema.sql) — aplicar após seals-awards-schema.sql.
Schema de grupos privados em [supabase/grupos-schema.sql](supabase/grupos-schema.sql) — aplicar após o schema principal.

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
| username | text | Identificador único com `@` (opcional, `[a-z0-9_]`, 3–20 chars) |
| nome_fantasia | text | Nome de exibição / apelido (opcional, máx. 50 chars) |
| total_seals | int | Total acumulado de selos do usuário (padrão: 0) |
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
| seal_cost | int | Custo em selos para desbloquear (0 = gratuito, ≥ 0) |
| is_default | boolean | Avatar padrão atribuído a novos usuários (único por vez) |
| created_by | uuid | FK → auth.users (admin que criou) |
| created_at | timestamptz | — |

> RLS: usuários autenticados veem apenas avatares com `active = true`; admins veem todos.
> Storage: bucket público `avatars` no Supabase Storage armazena as imagens enviadas via upload.
> Índice único parcial `avatars_single_default` garante que apenas um avatar tenha `is_default = true` por vez.

#### `user_avatar_unlocks`
Registro de avatares desbloqueados por cada usuário via gasto de selos.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| avatar_id | uuid | FK → avatars |
| unlocked_at | timestamptz | Data/hora do desbloqueio |

> Unique constraint em `(user_id, avatar_id)` — cada avatar só pode ser desbloqueado uma vez por usuário.
> RLS: usuários leem apenas seus próprios registros; inserção feita exclusivamente pela RPC `unlock_avatar` (security definer).

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

#### `notifications`
Notificações persistentes para o usuário (ex: resultado de solicitação de entrada em grupo). Aplicado via [supabase/grupos-schema.sql](supabase/grupos-schema.sql).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| type | text | Tipo da notificação (ex: `request_result`) |
| title | text | Título exibido no sininho |
| description | text | Descrição detalhada |
| read | boolean | Se foi lida (padrão: false) |
| created_at | timestamptz | — |

> RLS: usuário lê e atualiza apenas as próprias notificações; qualquer autenticado pode inserir (necessário para o dono do grupo notificar o solicitante).

#### `user_seals`
Histórico de selos concedidos a cada usuário. Aplicado via [supabase/seals-awards-schema.sql](supabase/seals-awards-schema.sql).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| event_key | text | Chave do evento (ex: `daily_chest`, `exact_score`, `ai_expert_called`) |
| seals | int | Quantidade de selos gastos/concedidos neste evento (sempre positivo) |
| game_id | uuid | FK → games (nullable — preenchido para eventos de jogo) |
| awarded_at | timestamptz | Data/hora da concessão |

> Índice em `(user_id, event_key, awarded_at)` para verificação eficiente do baú diário.
> RLS: usuários leem apenas seus próprios registros; inserção feita exclusivamente por RPCs `security definer`.
> O evento `ai_expert_called` registra o custo de 20 selos ao chamar o Especialista IA por jogo.

#### `match_analyses`
Cache das análises do Especialista IA, compartilhado entre todos os usuários. Aplicado via [supabase/match-analyses-schema.sql](supabase/match-analyses-schema.sql).

| Coluna | Tipo | Descrição |
|---|---|---|
| game_id | uuid | PK, FK → games (uma análise por jogo) |
| total_jogos | int | Total de confrontos em todas as competições |
| vitorias_a | int | Vitórias do time A em todas as competições |
| vitorias_b | int | Vitórias do time B em todas as competições |
| empates | int | Empates em todas as competições |
| gols_a / gols_b | int | Total de gols de cada time (nullable se incerto) |
| ultima_copa | text | Descrição do último confronto em Copa do Mundo com placar |
| probabilidade_a / probabilidade_empate / probabilidade_b | int | Probabilidades (somam 100) |
| placar_sugerido | text | Placar mais provável segundo o histórico |
| analise | text | 2–3 frases factuais sobre a rivalidade |
| created_at | timestamptz | Data/hora da geração |

> RLS: qualquer usuário autenticado pode ler; inserção permitida a usuários autenticados (PK impede duplicatas).
> A análise é gerada uma única vez pelo primeiro usuário a pagar o especialista e reutilizada por todos os demais.

#### `groups`
Grupos privados ou públicos de ranking. Aplicado via [supabase/grupos-schema.sql](supabase/grupos-schema.sql).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| name | text | Nome do grupo |
| owner_id | uuid | FK → profiles (criador) |
| description | text | Descrição opcional |
| is_public | boolean | Visível para busca pública (padrão: false) |
| image_url | text | URL da imagem do grupo (opcional) |
| created_at | timestamptz | — |

> RLS: dono e membros leem; grupos públicos e privados são visíveis para descoberta por qualquer autenticado; somente o dono gerencia.
> Storage: bucket público `group-images` para upload de imagens de grupo.

#### `group_members`
Membros e convites pendentes de cada grupo.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | PK |
| group_id | uuid | FK → groups |
| user_id | uuid | FK → profiles |
| status | text | `pending` \| `active` |
| invited_by | uuid | FK → profiles (quem convidou — `null` quando é solicitação de entrada do próprio usuário) |
| created_at | timestamptz | — |

> Unique constraint em `(group_id, user_id)`.
> Discriminante: `invited_by IS NULL + status = 'pending'` → solicitação de entrada; `invited_by IS NOT NULL + status = 'pending'` → convite do dono.
> RLS usa funções `is_group_owner` e `is_group_member` com `security definer` para evitar recursão infinita entre as policies das duas tabelas.

### Funções SQL principais

| Função | Descrição |
|---|---|
| `calculate_hit_type(...)` | Compara palpite vs resultado, retorna tipo de acerto |
| `points_for_hit(hit)` | Converte tipo de acerto em pontos |
| `recalculate_game_bets(game_id)` | Calcula pontos de todos os palpites de um jogo, atualiza ranking e distribui selos |
| `award_game_seals(game_id)` | Distribui selos de `bet_sent`, acerto e `knockout_bonus` para cada apostador do jogo |
| `claim_daily_seal()` | Concede selos do baú diário ao usuário autenticado (idempotente por dia) |
| `unlock_avatar(p_avatar_id)` | Atômico: verifica saldo de selos, debita e registra o desbloqueio em `user_avatar_unlocks` |
| `set_default_avatar(p_avatar_id)` | Admin only: limpa o avatar padrão anterior e define o novo (somente admins) |
| `handle_new_user()` | Trigger: cria perfil automaticamente no signup |
| `set_bet_window()` | Trigger: define janela de apostas ao criar/atualizar jogo |
| `delete_user()` | RPC com SECURITY DEFINER: exclui o usuário autenticado de `auth.users` (cascade apaga profiles, bets e ranking) |
| `is_group_owner(group_id, user_id)` | Retorna boolean — verifica se o usuário é dono do grupo (security definer, usado nas RLS policies) |
| `is_group_member(group_id, user_id)` | Retorna boolean — verifica se o usuário é membro do grupo (security definer, usado nas RLS policies) |

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
# Execute na ordem:
# 1. supabase/schema.sql
# 2. supabase/avatars-schema.sql
# 3. supabase/coins-schema.sql
# 4. supabase/seals-awards-schema.sql
# 5. supabase/match-analyses-schema.sql
# 6. supabase/grupos-schema.sql

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
| `/grupos` | MeusGruposPage | Autenticado |
| `/grupos/:id` | GrupoDetailPage | Autenticado |
| `/meus-grupos` | MeusGruposOwnerPage | Autenticado |
| `/meus-grupos/:id` | GrupoDetailPage (contexto Meus Grupos) | Autenticado |
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
| Criar grupos e convidar membros | ✅ | ✅ |
| Solicitar entrada em grupo privado | ✅ | ✅ |
| Aceitar/recusar convites e solicitações | ✅ (dono) | ✅ |
| Ver ranking privado do grupo | ✅ | ✅ |
| Desbloquear avatares com selos | ✅ | ✅ |
| Gerenciar avatares do catálogo | ❌ | ✅ |
| Configurar selos da copa | ❌ | ✅ |
| Definir avatar padrão | ❌ | ✅ |

RLS (Row Level Security) ativado em todas as tabelas. As políticas estão definidas em `supabase/schema.sql` e `supabase/avatars-schema.sql`.

---

## Painel Admin

Acesse `/admin` com uma conta de role `admin`. No desktop, o menu lateral exibe três itens exclusivos para admins: **Painel Admin**, **Avatares** e **Selos da Copa**. No mobile, esses itens ficam agrupados sob o ícone de escudo na barra de navegação inferior.

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

### Aba 3 — Inserir Resultados
- Lista jogos com status `closed` ou `live`
- Campos de placar iniciam vazios (placeholder "0") para facilitar a digitação — valores entre 0 e 99
- Validação antes de salvar: ambos os placares devem ser preenchidos
- Colunas de placar e ação centralizadas na tabela
- Clique em **Salvar** para aplicar o resultado; pontos de todos os palpites são recalculados automaticamente

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
| `group_created` | Grupo Criado | — (evento de custo, não de ganho) |

---

## Sistema de Selos — Funcionamento

### Baú Diário
Ao acessar o dashboard, após 20 segundos a aplicação chama automaticamente a RPC `claim_daily_seal()`. Se o usuário ainda não resgatou o baú no dia atual, um **modal animado** aparece com o ícone do evento, nome, descrição e quantidade de selos ganhos. O contador de selos no card do perfil é atualizado em tempo real, sem necessidade de recarregar a página.

### Selos por resultado de jogo
Quando o admin lança o resultado de um jogo, a RPC `recalculate_game_bets()` recalcula os pontos de todos os apostadores **e** chama automaticamente `award_game_seals()`, que distribui:

| Evento | Condição |
|---|---|
| `bet_sent` | Qualquer apostador do jogo |
| `exact_score` | Acertou o placar exato |
| `winner_hit` | Acertou o vencedor (sem ser exato) |
| `draw_hit` | Acertou o empate (sem ser exato) |
| `knockout_bonus` | Jogo de fase eliminatória (phase ≠ `group`) |

Cada concessão é idempotente: se a RPC for chamada novamente para o mesmo jogo, não duplica os selos.

### Visualização
O total acumulado de selos aparece no card de perfil do **Dashboard** ao lado da posição no ranking, atualizado em tempo real após qualquer concessão.
