<template>
  <LandingLayout>

    <!-- 1. Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Competição</div>
        <h1 class="page-title mb-4">Dispute de igual pra igual</h1>
        <p class="page-subtitle mx-auto mb-8">
          Vá além do ranking global. Crie seu próprio campo de batalha, aposte selos em jogos específicos
          ou forme um grupo privado com quem você escolher. Cada disputa tem um vencedor e só um.
        </p>
      </v-container>
    </section>

    <!-- 2. O que é uma disputa? -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Entenda o conceito</div>
          <h2 class="content-title">O que é uma disputa?</h2>
          <p class="content-subtitle mx-auto mt-3">
            Aqui "disputa" reúne todas as formas de você competir com outros jogadores além do ranking geral.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="pillar in pillars" :key="pillar.title" cols="12" sm="6" md="4">
            <div class="pillar-card pa-8 text-center h-100">
              <v-icon :icon="pillar.icon" size="48" color="#1f7a33" class="mb-4 d-none d-sm-inline-flex" />
              <div class="d-flex d-sm-none align-center justify-center mb-3" style="gap:10px">
                <v-icon :icon="pillar.icon" size="22" color="#1f7a33" />
                <div class="pillar-title">{{ pillar.title }}</div>
              </div>
              <div class="pillar-title mb-3 d-none d-sm-block">{{ pillar.title }}</div>
              <p class="text-body-2" style="color:#6b7280;line-height:1.7">{{ pillar.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 3. Como funciona -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Passo a passo</div>
          <h2 class="content-title">Como funciona na prática</h2>
          <p class="content-subtitle mx-auto mt-3">
            Quatro passos simples do palpite ao recebimento dos selos.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="(step, i) in steps" :key="i" cols="12" sm="6" md="3">
            <div class="step-card pa-6 h-100">
              <div class="step-card-top">
                <div class="step-number mx-auto mb-4">{{ i + 1 }}</div>
                <v-icon :icon="step.icon" size="32" color="#1f7a33" class="mb-3" />
                <div class="step-title font-weight-bold mb-2" style="color:#111827;text-align:center">{{ step.title }}</div>
              </div>
              <div class="d-flex d-sm-none align-center justify-center mb-2" style="gap:10px">
                <span class="step-number-inline">{{ i + 1 }}</span>
                <div class="step-title font-weight-bold" style="color:#111827">{{ step.title }}</div>
              </div>
              <div class="text-body-2 text-center" style="color:#6b7280;line-height:1.7">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
        <div class="text-center mt-8">
          <div class="score-note mx-auto">
            <span class="score-note-asterisk">*</span> Você precisa ter feito seu palpite no jogo antes de criar ou aceitar qualquer disputa naquele jogo.
          </div>
        </div>
      </v-container>
    </section>

    <!-- 4. Tipos de disputa -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Escolha seu modo</div>
          <h2 class="content-title">Tipos de disputa</h2>
          <p class="content-subtitle mx-auto mt-3">
            Três formas diferentes de competir. Cada uma com sua estratégia e nível de adrenalina.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="type in disputeTypes" :key="type.title" cols="12" sm="6" md="4">
            <div class="light-card pa-8 h-100">
              <div class="text-center mb-4">
                <v-icon :icon="type.icon" size="40" color="#1f7a33" class="mb-3 d-none d-sm-inline-flex" />
                <div class="type-title mb-1">{{ type.title }}</div>
                <div class="type-badge">{{ type.badge }}</div>
              </div>
              <ul class="bet-features-list">
                <li v-for="feat in type.features" :key="feat">{{ feat }}</li>
              </ul>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 5. Por que disputar? -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Vantagens</div>
          <h2 class="content-title">Por que disputar?</h2>
        </div>
        <v-row justify="center">
          <v-col v-for="why in whys" :key="why.title" cols="12" sm="6" md="3">
            <div class="why-card pa-6 text-center h-100">
              <v-icon :icon="why.icon" size="36" color="#1f7a33" class="mb-3 d-none d-sm-inline-flex" />
              <div class="why-title mb-2">{{ why.title }}</div>
              <p class="text-body-2" style="color:#6b7280;line-height:1.6">{{ why.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 6. Custos e limites -->
    <section class="section-light py-16 section-costs">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Transparência</div>
          <h2 class="content-title">Custos e limites</h2>
          <p class="content-subtitle mx-auto mt-3">Participar é gratuito dentro dos limites. Selos permitem expandir.</p>
        </div>
        <v-row justify="center">
          <v-col v-for="cost in costs" :key="cost.label" cols="12" sm="6" md="3">
            <div class="cost-card-light text-center pa-6">
              <v-icon :icon="cost.icon" size="36" color="#1f7a33" class="mb-3 d-none d-sm-inline-flex" />
              <div class="cost-value-light mb-1">{{ cost.value }}</div>
              <div class="text-subtitle-2 font-weight-bold mb-1" style="color:#111827">{{ cost.label }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.6">{{ cost.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>


  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const pillars = [
  {
    icon: 'mdi-account-group',
    title: 'Grupos Privados',
    desc: 'Crie um grupo só com as pessoas que você conhece e veja quem manda mais no bolão. Cada grupo tem seu próprio ranking, só entre vocês.',
  },
  {
    icon: 'mdi-sword-cross',
    title: 'Apostas P2P',
    desc: 'Desafie outros jogadores diretamente ou abra uma aposta pública. Quem acertar melhor o resultado leva todos os selos apostados, automaticamente.',
  },
  {
    icon: 'mdi-earth',
    title: 'Ranking Global',
    desc: 'Além das disputas privadas, você compete com pessoas do mundo inteiro no ranking geral. Cada palpite certo sobe sua posição entre milhares de participantes.',
  },
]

const steps = [
  {
    icon: 'mdi-soccer',
    title: 'Faça seu palpite',
    text: 'Antes de entrar em qualquer disputa, você precisa dar seu palpite no jogo. É rápido e simples, basta escolher o placar que você acha que vai acontecer.',
  },
  {
    icon: 'mdi-plus-circle-outline',
    title: 'Crie ou entre numa disputa',
    text: 'Crie um grupo privado, abra uma aposta ou aceite um desafio direto de outro jogador.',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Acompanhe em tempo real',
    text: 'Veja a posição de cada participante atualizando conforme o jogo acontece.',
  },
  {
    icon: 'mdi-seal',
    title: 'Receba os selos',
    text: 'Após o resultado oficial, o sistema determina o vencedor e transfere os selos automaticamente.',
  },
]

const disputeTypes = [
  {
    icon: 'mdi-sword-cross',
    title: 'Duelo Direto',
    badge: '1 vs 1',
    features: [
      'Desafie um jogador pelo @username',
      'Combate individual, máxima tensão',
      'Inclua uma provocação (até 120 caracteres)',
      'Vencedor leva todos os selos apostados',
      'Resolução automática após o apito final',
    ],
  },
  {
    icon: 'mdi-earth',
    title: 'Aposta Aberta',
    badge: 'Até 10 jogadores',
    features: [
      'Qualquer jogador pode entrar',
      'Até 9 participantes adicionais',
      'Todos apostam o mesmo valor em selos',
      'Quem tiver o melhor palpite leva tudo',
      'Ideal para disputas rápidas e emocionantes',
    ],
  },
  {
    icon: 'mdi-account-group',
    title: 'Grupo Privado',
    badge: 'Liga com amigos',
    features: [
      'Crie seu bolão particular com convidados',
      'Ranking interno exclusivo do grupo',
      'Grupos públicos (entrada livre) ou privados',
      'Cada grupo começa com 5 vagas expansíveis',
      'Administre membros e configurações do grupo',
    ],
  },
]

const whys = [
  {
    icon: 'mdi-lightning-bolt-circle',
    title: 'Resolução automática',
    desc: 'Nada de combinação manual. Assim que o resultado é oficial, o sistema calcula e distribui os selos.',
  },
  {
    icon: 'mdi-shield-check',
    title: 'Sem dinheiro real',
    desc: 'Selos são moeda virtual do jogo. Toda a diversão, zero risco financeiro.',
  },
  {
    icon: 'mdi-cellphone-check',
    title: 'Jogue em qualquer lugar',
    desc: 'Interface otimizada para celular e computador. Acompanhe suas disputas de onde estiver.',
  },
  {
    icon: 'mdi-history',
    title: 'Histórico completo',
    desc: 'Veja todas as suas apostas passadas, grupos que participou e selos ganhos ou perdidos.',
  },
]

const costs = [
  { icon: 'mdi-account-multiple-check', value: 'Grátis',    label: 'Até 2 grupos',        desc: 'Participe de até 2 grupos sem custo algum.' },
  { icon: 'mdi-account-group-outline',  value: '30 selos',  label: 'Grupos adicionais',   desc: 'Cada grupo além do 2º custa 30 selos de entrada.' },
  { icon: 'mdi-account-group',          value: '100 selos', label: 'Criar um grupo',       desc: 'Crie seu próprio grupo e convide quem quiser.' },
  { icon: 'mdi-account-multiple-plus',  value: '+50 selos', label: 'Expandir +5 vagas',    desc: 'Aumente a capacidade do seu grupo conforme precisar.' },
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
  max-width: 560px;
  line-height: 1.7;
}

/* Sections */
.section-light { background: #fafafa; }
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
.section-cta   { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 100%); }

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
.content-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 520px;
  line-height: 1.7;
}

/* Pillar cards */
.pillar-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.pillar-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.pillar-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

/* Step cards */
.step-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.step-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.step-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
@media (max-width: 599px) {
  .step-card-top { display: none !important; }
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
.step-title {
  font-size: .97rem;
}
.step-number-inline {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: .9rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Light card (dispute types) */
.light-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.light-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.type-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}
.type-badge {
  display: inline-block;
  font-size: .78rem;
  font-weight: 700;
  color: #1f7a33;
  letter-spacing: .04em;
}
.bet-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bet-features-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: .88rem;
  color: #374151;
  line-height: 1.5;
}
.bet-features-list li:last-child { border-bottom: none; }
.bet-features-list li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1f7a33;
  margin-right: 10px;
  vertical-align: middle;
}

/* Why cards */
.why-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.why-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.why-title {
  font-size: .97rem;
  font-weight: 700;
  color: #111827;
}

/* Note */
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

/* Cost cards */
.cost-card-light {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow .2s;
}
.cost-card-light:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.cost-value-light {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1f7a33;
  line-height: 1;
}

/* CTA */
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.cta-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,.65);
  max-width: 400px;
  line-height: 1.6;
}

.gap-3 { gap: 12px; }
@media (max-width: 599px) {
  .section-costs { padding-top: 0 !important; }
}
</style>
