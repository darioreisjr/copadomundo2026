<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Tudo que você precisa saber</div>
        <h1 class="page-title mb-4">Como funciona</h1>
        <p class="page-subtitle mx-auto">
          Do cadastro ao troféu, entenda cada detalhe do Bolão Copa 26.
        </p>
      </v-container>
    </section>

    <!-- Seção 1: Os 4 passos da jornada -->
    <section class="section-light pb-16 pt-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Passo a passo</div>
          <h2 class="content-title">Sua jornada no bolão</h2>
        </div>
        <v-row justify="center">
          <v-col
            v-for="(step, i) in steps"
            :key="i"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="step-card pa-6">
              <div class="step-card-top">
                <div class="step-number mx-auto mb-4">{{ i + 1 }}</div>
                <v-icon :icon="step.icon" size="32" color="#1f7a33" class="mb-3" />
                <div class="step-title-desktop font-weight-bold mb-2" style="color:#111827">{{ step.title }}</div>
              </div>
              <div class="step-title-mobile font-weight-bold mb-2 d-flex align-center justify-center d-sm-none">
                <span class="step-number-inline mr-2">{{ i + 1 }}</span>
                {{ step.title }}
              </div>
              <div class="text-body-2 text-center" style="color:#6b7280;line-height:1.7">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Seção 2: Pontuação -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Regras de pontuação</div>
          <h2 class="content-title">Como os pontos são contados</h2>
          <p class="content-subtitle mx-auto mt-3">
            Cada palpite vale pontos de acordo com a precisão. Quanto mais exato, maior a recompensa.
          </p>
        </div>
        <v-row justify="center">
          <v-col
            v-for="rule in scoringRules"
            :key="rule.pts"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="light-card text-center pa-8">
              <v-icon :icon="rule.icon" size="36" :color="rule.iconColor" class="mb-4 d-none d-sm-inline-flex" />
              <div class="score-pts mb-2" :style="{ color: rule.ptsColor }">{{ rule.pts }}</div>
              <div class="score-label-dark mb-1">{{ rule.title }}</div>
              <div class="score-desc-dark">{{ rule.desc }}</div>
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-10">
          <div class="score-note mx-auto">
            <span class="score-note-asterisk">*</span> Nas fases eliminatórias (oitavas em diante) os pontos têm multiplicador bônus, o risco é maior, a recompensa também.
          </div>
        </div>
      </v-container>
    </section>

    <!-- Seção 3: Selos -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Moeda virtual</div>
          <h2 class="content-title">Selos: a moeda do jogo</h2>
          <p class="content-subtitle mx-auto mt-3">
            Selos são ganhos gratuitamente e abrem funcionalidades extras. Nenhum dinheiro real envolvido.
          </p>
        </div>
        <v-row>
          <!-- Como ganhar -->
          <v-col cols="12" md="5">
            <div class="earn-block pa-8">
              <div class="block-label mb-5">
                <v-icon icon="mdi-plus-circle" size="18" color="#1f7a33" class="mr-1" />
                Como ganhar selos
              </div>
              <div
                v-for="earn in selosEarn"
                :key="earn.title"
                class="earn-item d-flex align-start mb-5"
              >
                <v-icon :icon="earn.icon" size="28" color="#1f7a33" class="mr-4 mt-1 flex-shrink-0" />
                <div>
                  <div class="earn-title">{{ earn.title }}</div>
                  <div class="earn-desc">{{ earn.desc }}</div>
                </div>
              </div>
            </div>
          </v-col>
          <!-- Como gastar -->
          <v-col cols="12" md="7">
            <div class="spend-block pa-8">
              <div class="block-label mb-5">
                <v-icon icon="mdi-minus-circle" size="18" color="#1f7a33" class="mr-1" />
                Como usar selos
              </div>
              <div
                v-for="cost in selosCosts"
                :key="cost.action"
                class="cost-row d-flex align-center justify-space-between py-3"
              >
                <div class="d-flex align-center">
                  <v-icon :icon="cost.icon" size="20" color="#1f7a33" class="mr-3" />
                  <span class="cost-action">{{ cost.action }}</span>
                </div>
                <span class="cost-value">{{ cost.cost }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Seção 4: Apostas P2P -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Apostas entre jogadores</div>
          <h2 class="content-title">Apostas P2P com selos</h2>
          <p class="content-subtitle mx-auto mt-3">
            Além do ranking global, desafie outros jogadores diretamente. Aposte selos nos jogos e dispute quem faz o melhor palpite.
          </p>
        </div>
        <v-row justify="center">
          <v-col
            v-for="bet in betTypes"
            :key="bet.title"
            cols="12"
            sm="6"
            md="4"
          >
            <div class="light-card pa-8 h-100">
              <v-icon :icon="bet.icon" size="40" color="#1f7a33" class="mb-4 d-none d-sm-inline-flex" />
              <div class="bet-card-title mb-3 bet-card-title-wrap">{{ bet.title }}</div>
              <ul class="bet-features-light">
                <li v-for="feat in bet.features" :key="feat">{{ feat }}</li>
              </ul>
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-10">
          <div class="score-note mx-auto">
            <span class="score-note-asterisk">*</span> Para criar ou aceitar uma aposta, você precisa já ter feito seu palpite naquele jogo.
          </div>
        </div>
      </v-container>
    </section>

    <!-- Seção 5: Grupos -->
    <section class="section-light pb-16">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="pr-md-10">
            <div class="section-label-green mb-2">Competição privada</div>
            <h2 class="content-title mb-4">Crie seu grupo e dispute com quem você quer</h2>
            <p style="color:#6b7280;line-height:1.7;font-size:1rem" class="mb-6">
              Os grupos permitem que você monte seu próprio bolão dentro do bolão. Perfeito para competir com amigos, família ou colegas de trabalho.
            </p>
            <p class="group-note mb-3">Seja o líder do bolão no trabalho, na família ou entre amigos.</p>
          </v-col>
          <v-col cols="12" md="6" class="mt-6 mt-md-0">
            <div class="features-card pa-6">
              <ul class="features-list">
                <li v-for="feat in groupFeatures" :key="feat.text" class="d-flex align-start">
                  <v-icon :icon="feat.icon" size="18" color="#1f7a33" class="mr-3 mt-1 flex-shrink-0" />
                  <span>{{ feat.text }}</span>
                </li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Seção 6: FAQ -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Dúvidas frequentes</div>
          <h2 class="content-title">Perguntas rápidas</h2>
        </div>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel
                v-for="faq in faqs"
                :key="faq.q"
                :title="faq.q"
                :text="faq.a"
                class="faq-panel"
              />
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const steps = [
  {
    icon: 'mdi-account-plus',
    title: 'Crie sua conta',
    text: 'Cadastro grátis em segundos. A partir do primeiro login você já começa a acumular selos diários.',
  },
  {
    icon: 'mdi-soccer',
    title: 'Faça seus palpites',
    text: 'Os jogos abrem para palpites 24 horas antes da partida. Escolha o placar exato de cada confronto.',
  },
  {
    icon: 'mdi-trophy',
    title: 'Suba no ranking',
    text: 'Cada acerto vira pontos. Acompanhe sua posição no ranking global e nos seus grupos privados.',
  },
  {
    icon: 'mdi-seal',
    title: 'Use seus selos',
    text: 'Com os selos ganhos você cria grupos, desafia outros jogadores e consulta o especialista de IA.',
  },
]

const scoringRules = [
  {
    icon: 'mdi-bullseye-arrow',
    pts: '10 pontos',
    title: 'Placar exato',
    desc: 'Você acertou o resultado exato da partida.',
    iconColor: '#1f7a33',
    ptsColor: '#1f7a33',
  },
  {
    icon: 'mdi-check-circle',
    pts: '5 pontos',
    title: 'Vencedor certo',
    desc: 'Acertou quem ganhou, mas não o placar exato.',
    iconColor: '#2e9e47',
    ptsColor: '#2e9e47',
  },
  {
    icon: 'mdi-handshake',
    pts: '5 pontos',
    title: 'Empate certo',
    desc: 'Acertou que o jogo terminaria empatado.',
    iconColor: '#2e9e47',
    ptsColor: '#2e9e47',
  },
  {
    icon: 'mdi-close-circle',
    pts: '0 pontos',
    title: 'Sem acerto',
    desc: 'Seu palpite não corresponde ao resultado.',
    iconColor: '#9ca3af',
    ptsColor: '#9ca3af',
  },
]

const selosEarn = [
  {
    icon: 'mdi-gift',
    title: 'Baú diário',
    desc: 'Faça login todos os dias e resgate seu baú de selos. Simples assim.',
  },
  {
    icon: 'mdi-star-circle',
    title: 'Palpite perfeito',
    desc: 'Acerte todos os jogos de uma rodada e ganhe um bônus especial de selos.',
  },
  {
    icon: 'mdi-trophy-award',
    title: 'Eventos da Copa',
    desc: 'Recompensas especiais são liberadas em datas e eventos marcantes do torneio.',
  },
]

const selosCosts = [
  { icon: 'mdi-account-group', action: 'Criar um grupo privado', cost: '100 selos' },
  { icon: 'mdi-door-open', action: 'Entrar no 3º grupo ou mais', cost: '30 selos' },
  { icon: 'mdi-account-multiple-plus', action: 'Expandir grupo em +5 vagas', cost: '50 selos' },
  { icon: 'mdi-account-multiple-plus', action: 'Expandir grupo em +10 vagas', cost: '90 selos' },
  { icon: 'mdi-robot', action: 'Consultor IA Gemini (por jogo)', cost: '20 selos' },
  { icon: 'mdi-pencil', action: 'Alterar palpite após fechamento', cost: '30 selos' },
]

const betTypes = [
  {
    icon: 'mdi-sword-cross',
    title: 'Duelo Direto',
    features: [
      'Desafie um jogador específico pelo @username',
      'Combate 1 vs 1',
      'Vencedor leva todos os selos apostados',
      'Inclua uma provocação (até 120 caracteres)',
    ],
  },
  {
    icon: 'mdi-account-group',
    title: 'Aposta Aberta',
    features: [
      'Qualquer jogador pode entrar',
      'Até 9 participantes adicionais',
      'Todos apostam o mesmo valor',
      'Vencedor leva o valor total apostado',
    ],
  },
  {
    icon: 'mdi-trophy-outline',
    title: 'Aposta de Grupo',
    features: [
      'Defina o limite máximo de participantes',
      'Ideal para disputar com amigos',
      'Mesmo valor de entrada para todos',
      'Quem acertar leva tudo, automaticamente',
    ],
  },
]

const groupFeatures = [
  { icon: 'mdi-check', text: 'Grupos públicos (entrada livre) ou privados (convite)' },
  { icon: 'mdi-check', text: 'Ranking exclusivo com apenas os membros do grupo' },
  { icon: 'mdi-check', text: 'Cada grupo começa com 5 vagas, expansível com selos' },
  { icon: 'mdi-check', text: 'Os 2 primeiros grupos que você entrar são gratuitos' },
  { icon: 'mdi-check', text: 'Convide pelo @username ou compartilhe o grupo público' },
  { icon: 'mdi-check', text: 'Administre membros, aprovações e configurações do grupo' },
]

const faqs = [
  {
    q: 'Preciso pagar para participar?',
    a: 'Não. O Bolão Copa 26 é totalmente gratuito. Selos são moeda virtual do jogo, sem valor financeiro e sem custo real.',
  },
  {
    q: 'Posso mudar meu palpite depois de enviado?',
    a: 'Sim, enquanto a janela de palpites estiver aberta você pode alterar de graça. Após o fechamento (até 24h antes do jogo), a alteração custa 30 selos.',
  },
  {
    q: 'Como os pontos são calculados?',
    a: 'Automaticamente. Assim que o resultado oficial é registrado, o sistema recalcula todos os palpites daquele jogo e atualiza o ranking em tempo real.',
  },
  {
    q: 'O que acontece com os selos apostados numa aposta P2P?',
    a: 'Os selos ficam reservados enquanto a aposta está ativa. Após o resultado do jogo, o sistema determina o vencedor e transfere todos os selos do pool para ele automaticamente.',
  },
  {
    q: 'Posso participar de vários grupos ao mesmo tempo?',
    a: 'Sim. Os 2 primeiros grupos são gratuitos. A partir do 3º grupo cada adesão custa 30 selos. Não há limite máximo de grupos.',
  },
]
</script>

<style scoped>
/* Hero */
.page-hero {
  background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%);
}
@media (max-width: 599px) {
  .page-hero { padding-top: 0 !important; padding-bottom: 0 !important; }
}
.section-label {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #f5c542;
}
.page-title {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.page-subtitle {
  font-size: 1.05rem;
  color: rgba(255,255,255,.75);
  max-width: 540px;
  line-height: 1.7;
}

/* Sections */
.section-light { background: #fafafa; }
.section-dark  { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 60%, #145c27 100%); }

/* Typography */
.section-label-green {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1f7a33;
}
.content-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.content-title-light {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}
.content-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 520px;
  line-height: 1.7;
}
.content-subtitle-light {
  font-size: 1rem;
  color: rgba(255,255,255,.7);
  max-width: 520px;
  line-height: 1.7;
}

/* Step cards */
.step-card {
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
  height: 100%;
}
.step-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.step-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.step-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-number-inline {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: .95rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-title-mobile {
  font-size: 1rem;
  color: #111827;
}
@media (max-width: 599px) {
  .step-card-top {
    display: none !important;
  }
}
@media (min-width: 600px) {
  .step-title-mobile { display: none !important; }
  .step-card-top { display: flex !important; }
  .step-card { text-align: center; }
}

/* Light scoring cards */
.light-card {
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
  height: 100%;
}
.light-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.score-label-dark {
  font-size: .95rem;
  font-weight: 700;
  color: #111827;
}
.score-desc-dark {
  font-size: .85rem;
  color: #6b7280;
  line-height: 1.5;
  margin-top: 4px;
}
.info-box-light {
  display: inline-flex;
  align-items: center;
  background: rgba(31,122,51,.06);
  border: 1px solid rgba(31,122,51,.2);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: .9rem;
  color: #374151;
  font-weight: 500;
  max-width: 600px;
  text-align: left;
  line-height: 1.5;
}
.score-note {
  font-size: .9rem;
  color: #6b7280;
  max-width: 600px;
  line-height: 1.6;
  text-align: center;
}
.score-note-asterisk {
  color: #1f7a33;
  font-weight: 900;
  font-size: 1.1rem;
  margin-right: 4px;
}

/* Dark cards */
.dark-card {
  border-radius: 16px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.1);
  transition: background .2s;
  height: 100%;
}
.dark-card:hover { background: rgba(255,255,255,.09); }
.dark-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}

/* Scoring */
.score-pts {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -.02em;
}
.score-label {
  font-size: .95rem;
  font-weight: 700;
  color: #fff;
}
.score-desc {
  font-size: .85rem;
  color: rgba(255,255,255,.6);
  line-height: 1.5;
  margin-top: 4px;
}

/* Info box */
.info-box {
  display: inline-flex;
  align-items: center;
  background: rgba(245,197,66,.08);
  border: 1px solid rgba(245,197,66,.25);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: .9rem;
  color: rgba(255,255,255,.85);
  font-weight: 500;
  max-width: 600px;
  text-align: left;
  line-height: 1.5;
}

/* Selos earn / spend */
.earn-block, .spend-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  height: 100%;
}
.block-label {
  font-size: .78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: #6b7280;
  display: flex;
  align-items: center;
}
.earn-title {
  font-size: .95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}
.earn-desc {
  font-size: .87rem;
  color: #6b7280;
  line-height: 1.5;
}
.cost-row {
  border-bottom: 1px solid #f3f4f6;
}
.cost-row:last-child { border-bottom: none; }
.cost-action {
  font-size: .9rem;
  color: #374151;
}
.cost-value {
  font-size: .95rem;
  font-weight: 800;
  color: #1f7a33;
  white-space: nowrap;
  margin-left: 12px;
}

/* P2P bet card title (light) */
.bet-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}
@media (max-width: 599px) {
  .bet-card-title-wrap { text-align: center; }
}
/* P2P bet features list (light) */
.bet-features-light {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bet-features-light li {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: .88rem;
  color: #374151;
  line-height: 1.5;
}
.bet-features-light li:last-child { border-bottom: none; }
.bet-features-light li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1f7a33;
  margin-right: 10px;
  vertical-align: middle;
}

/* P2P bet features list */
.bet-features {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bet-features li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,.07);
  font-size: .88rem;
  color: rgba(255,255,255,.75);
  line-height: 1.5;
}
.bet-features li:last-child { border-bottom: none; }
.bet-features li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f5c542;
  margin-right: 10px;
  vertical-align: middle;
}

/* Groups */
.group-note {
  font-size: .9rem;
  color: #6b7280;
  line-height: 1.6;
}
.group-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(31,122,51,.08);
  border: 1px solid rgba(31,122,51,.2);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: .85rem;
  font-weight: 600;
  color: #1f7a33;
}
.features-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.features-list li {
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: .93rem;
  color: #374151;
  line-height: 1.5;
}
.features-list li:last-child { border-bottom: none; }

/* FAQ */
.faq-panels {
  border-radius: 16px;
  overflow: hidden;
}
.faq-panel {
  background: #fff !important;
  border-bottom: 1px solid #e5e7eb !important;
  color: #111827 !important;
}
:deep(.faq-panel .v-expansion-panel-title) {
  color: #111827;
  font-weight: 600;
  font-size: .97rem;
}
:deep(.faq-panel .v-expansion-panel-text__wrapper) {
  color: #6b7280;
  font-size: .9rem;
  line-height: 1.65;
}
:deep(.faq-panel .v-expansion-panel-title__overlay) {
  background: rgba(31,122,51,.04);
}
</style>
