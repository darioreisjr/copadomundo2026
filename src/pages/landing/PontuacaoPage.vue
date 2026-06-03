<template>
  <LandingLayout>
    <!-- Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Regras do jogo</div>
        <h1 class="page-title mb-4">Pontuação</h1>
        <p class="page-subtitle mx-auto">
          Entenda como cada palpite vira pontos e como você sobe no ranking.
        </p>
      </v-container>
    </section>

    <!-- Resumo rápido -->
    <section class="section-summary py-10">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <div class="summary-box">
              <div class="summary-title mb-4">
                Em resumo
              </div>
              <div class="summary-items">
                <div v-for="(item, i) in quickSummary" :key="i" class="summary-item">
                  <span class="summary-num">{{ i + 1 }}</span>
                  <span class="summary-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Tabela de pontuação detalhada -->
    <section class="section-light first-section py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label mb-2" style="color:#2e9e47">Quanto vale cada acerto</div>
          <h2 class="section-title">Tipos de pontuação</h2>
          <p class="section-subtitle mx-auto">
            Cada palpite é comparado com o resultado real. Veja exatamente o que você ganha em cada caso.
          </p>
        </div>

        <v-row justify="center" class="scoring-grid">
          <v-col
            v-for="rule in scoringRules"
            :key="rule.title"
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card class="scoring-card pa-6" rounded="xl" elevation="0" height="100%">
              <!-- Cabeçalho do card -->
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="scoring-pts" :style="{ color: rule.color }">{{ rule.pts }} pontos</div>
                <v-chip
                  :color="rule.chipColor"
                  size="small"
                  variant="tonal"
                  class="font-weight-bold"
                >{{ rule.badge }}</v-chip>
              </div>

              <!-- Ícone e título -->
              <div class="d-flex align-center mb-3">
                <v-icon :color="rule.color" size="28" class="mr-2 scoring-icon-mobile">{{ rule.icon }}</v-icon>
                <div class="scoring-name">{{ rule.title }}</div>
              </div>

              <!-- Descrição -->
              <div class="scoring-desc mb-4">{{ rule.desc }}</div>

              <!-- Exemplo -->
              <div class="scoring-example">
                <div class="example-label mb-1">Exemplo:</div>
                <div class="example-content">
                  <span class="example-bet">Palpite: {{ rule.exBet }}</span>
                  <v-icon size="14" color="#9ca3af" class="mx-1">mdi-arrow-right</v-icon>
                  <span class="example-real">Resultado: {{ rule.exReal }}</span>
                  <v-icon size="16" :color="rule.pts > 0 ? '#2e9e47' : '#f5c542'" class="ml-1">
                    {{ rule.pts > 0 ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Bônus Mata-Mata -->
    <section class="section-knockout py-16">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" md="5" class="mb-8 mb-md-0 text-center text-md-left">
            <div class="section-label mb-2" style="color:#2e9e47">Fases finais</div>
            <h2 class="section-title mb-4">Bônus Mata-Mata</h2>
            <p class="knockout-desc mb-6">
              A partir das oitavas de final, cada palpite correto vale mais.
              O risco é maior, uma eliminação muda tudo e a recompensa também.
            </p>
            <div class="mb-6">
              <div class="knockout-bonus-num">+30 selos</div>
              <div class="knockout-bonus-label">de bônus em cada acerto nas fases eliminatórias</div>
            </div>
          </v-col>

          <v-col cols="12" md="5" offset-md="1">
            <div class="phases-list">
              <div
                v-for="phase in knockoutPhases"
                :key="phase.name"
                class="phase-item"
              >
                <v-icon color="#2e9e47" size="20" class="mr-3">mdi-sword-cross</v-icon>
                <div class="phase-name">{{ phase.name }}</div>
                <v-chip color="#2e9e47" size="x-small" variant="tonal" class="ml-auto font-weight-bold">
                  +30 selos
                </v-chip>
              </div>
            </div>
            <div class="phases-note mt-4">
              Os pontos base (10, 5 ou 0) continuam os mesmos. Os 30 selos são um bônus extra por cima.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Critérios de desempate -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label mb-2" style="color:#2e9e47">Mesma pontuação?</div>
          <h2 class="section-title">Critérios de desempate</h2>
          <p class="section-subtitle mx-auto">
            Se dois jogadores terminarem com a mesma pontuação, o ranking usa estes critérios em ordem.
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <div class="tiebreaker-list">
              <div
                v-for="tb in tiebreakers"
                :key="tb.pos"
                class="tiebreaker-item"
              >
                <div class="tb-pos">{{ tb.pos }}º</div>
                <div class="tb-info">
                  <div class="tb-label">{{ tb.label }}</div>
                  <div class="tb-detail">{{ tb.detail }}</div>
                </div>
              </div>
            </div>
            <div class="tiebreaker-note mt-6">
              <span style="color:#2e9e47;font-weight:700;margin-right:6px">*</span>
              Esse sistema garante que quem acertar o melhor (placar exato) fica à frente de quem acerta só o vencedor, mesmo com a mesma pontuação.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Selos por acerto -->
    <section class="section-seals py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label mb-2" style="color:#2e9e47">Além dos pontos</div>
          <h2 class="section-title">Selos que você ganha ao acertar</h2>
          <p class="section-subtitle mx-auto">
            Acertar não dá só pontos no ranking, você também ganha selos, a moeda da plataforma.
          </p>
        </div>

        <v-row justify="center" class="mb-8">
          <v-col
            v-for="reward in sealRewards"
            :key="reward.event"
            cols="12"
            sm="4"
            md="2"
            class="text-center"
          >
            <div class="seal-reward-card pa-4">
              <div class="seal-reward-num">+{{ reward.seals }}</div>
              <div class="seal-reward-label">selos</div>
              <div class="seal-reward-event mt-1">{{ reward.event }}</div>
            </div>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="8" lg="7">
            <div class="seals-info-box">
              <span style="color:#2e9e47;font-weight:700;margin-right:6px">*</span>
              <span>
                <router-link :to="{ name: 'SelosInfo' }" class="seals-link">O que são selos?</router-link>
                É a moeda virtual do bolão. Use para criar grupos privados,
                desafiar outros jogadores em apostas P2P e consultar o Especialista IA antes de palpitar.
              </span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Quando posso palpitar -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label mb-2" style="color:#2e9e47">Janela de palpites</div>
          <h2 class="section-title">Quando posso palpitar?</h2>
          <p class="section-subtitle mx-auto">
            Existe uma janela de tempo para enviar e modificar seu palpite. Fique de olho.
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <div class="timeline">
              <div
                v-for="(step, i) in timeline"
                :key="i"
                class="timeline-item"
              >
                <div class="timeline-icon-wrap" :style="{ background: step.bg }">
                  <v-icon :color="step.color" size="22">{{ step.icon }}</v-icon>
                </div>
                <div class="timeline-connector" v-if="i < timeline.length - 1"></div>
                <div class="timeline-content">
                  <div class="timeline-time">{{ step.time }}</div>
                  <div class="timeline-title">{{ step.title }}</div>
                  <div class="timeline-desc">{{ step.desc }}</div>
                </div>
              </div>
            </div>

            <div class="timeline-note mt-6">
              <span style="color:#2e9e47;font-weight:700;margin-right:6px">*</span>
              <span><strong>Mudou de ideia?</strong> O primeiro palpite é sempre gratuito. Alterar antes do fechamento do jogo custa <strong>30 selos</strong>.</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Exemplo prático -->
    <section class="section-example py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label mb-2" style="color:#2e9e47">Veja na prática</div>
          <h2 class="section-title">Exemplo de uma rodada</h2>
          <p class="section-subtitle mx-auto">
            Veja como os pontos se acumulam ao longo de quatro jogos.
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card rounded="xl" elevation="0" class="example-table-card">
              <!-- Cabeçalho — só desktop -->
              <div class="example-table-header px-6 py-4 d-none d-sm-block">
                <v-row class="text-caption font-weight-bold" style="color:#6b7280">
                  <v-col cols="4">Jogo</v-col>
                  <v-col cols="2" class="text-center">Seu palpite</v-col>
                  <v-col cols="2" class="text-center">Resultado</v-col>
                  <v-col cols="3" class="text-center">Tipo</v-col>
                  <v-col cols="1" class="text-center">Pts</v-col>
                </v-row>
              </div>

              <!-- Linhas desktop -->
              <div
                v-for="(match, i) in exampleMatches"
                :key="'d' + i"
                class="example-table-row px-6 py-4 d-none d-sm-block"
                :class="{ 'last-row': i === exampleMatches.length - 1 }"
              >
                <v-row align="center">
                  <v-col cols="4">
                    <div class="match-name">{{ match.game }}</div>
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <span class="score-badge">{{ match.bet }}</span>
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <span class="score-badge score-real">{{ match.result }}</span>
                  </v-col>
                  <v-col cols="3" class="text-center">
                    <span class="type-text" :style="{ color: match.ptsColor }">{{ match.type }}</span>
                  </v-col>
                  <v-col cols="1" class="text-center">
                    <span class="pts-value" :style="{ color: match.ptsColor }">{{ match.pts > 0 ? '+' + match.pts : match.pts }}</span>
                  </v-col>
                </v-row>
              </div>

              <!-- Cards mobile -->
              <div class="d-sm-none">
                <div
                  v-for="(match, i) in exampleMatches"
                  :key="'m' + i"
                  class="mobile-match-card px-5 py-4"
                  :class="{ 'last-row': i === exampleMatches.length - 1 }"
                >
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="match-name">{{ match.game }}</div>
                    <span class="pts-value" :style="{ color: match.ptsColor }">{{ match.pts > 0 ? '+' + match.pts : match.pts }} pontos</span>
                  </div>
                  <div class="d-flex align-center gap-2 flex-wrap">
                    <span class="mobile-label">Palpite:</span>
                    <span class="score-badge">{{ match.bet }}</span>
                    <v-icon size="12" color="#9ca3af">mdi-arrow-right</v-icon>
                    <span class="mobile-label">Resultado:</span>
                    <span class="score-badge score-real">{{ match.result }}</span>
                    <span class="type-text ml-auto" :style="{ color: match.ptsColor }">{{ match.type }}</span>
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div class="example-table-total px-6 py-4">
                <div class="d-flex align-center justify-end gap-3">
                  <span class="total-label">Total da rodada:</span>
                  <span class="total-pts">20 pontos</span>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const quickSummary = [
  'Você palpita no placar de cada jogo antes da bola rolar.',
  'Quanto mais preciso o seu palpite, mais pontos você ganha.',
  'Quem tiver mais pontos no final vence o bolão.',
]

const scoringRules = [
  {
    pts: 10,
    color: '#2e9e47',
    chipColor: 'success',
    badge: 'Raro',
    icon: 'mdi-bullseye-arrow',
    title: 'Placar Exato',
    desc: 'Você acertou o número exato de gols de cada time. O resultado bate placar a placar.',
    exBet: '2–1',
    exReal: '2–1',
  },
  {
    pts: 5,
    color: '#2e9e47',
    chipColor: 'success',
    badge: 'Médio',
    icon: 'mdi-trophy',
    title: 'Vencedor Certo',
    desc: 'Você acertou qual time venceu, mas os números dos gols foram diferentes.',
    exBet: '3–0',
    exReal: '1–0',
  },
  {
    pts: 5,
    color: '#2e9e47',
    chipColor: 'success',
    badge: 'Médio',
    icon: 'mdi-handshake',
    title: 'Empate Certo',
    desc: 'Você previu que o jogo terminaria empatado e o resultado foi de fato um empate.',
    exBet: '0–0',
    exReal: '1–1',
  },
  {
    pts: 0,
    color: '#9ca3af',
    chipColor: 'default',
    badge: 'Erro',
    icon: 'mdi-close-circle',
    title: 'Sem Acerto',
    desc: 'Seu palpite não corresponde ao resultado em nenhum critério.',
    exBet: '2–0',
    exReal: '0–1',
  },
]

const knockoutPhases = [
  { name: 'Oitavas de final', color: '#f5c542' },
  { name: 'Quartas de final', color: '#f5c542' },
  { name: 'Semifinais',       color: '#f5c542' },
  { name: 'Final',            color: '#f5c542' },
]

const tiebreakers = [
  {
    pos: 1,
    icon: 'mdi-bullseye-arrow',
    color: '#2e9e47',
    label: 'Mais Placares Exatos',
    detail: 'Quem acertou mais vezes o placar número por número fica à frente.',
  },
  {
    pos: 2,
    icon: 'mdi-trophy',
    color: '#d97706',
    label: 'Mais Acertos de Vencedor',
    detail: 'Em segundo critério, conta quem acertou mais vezes o time vencedor.',
  },
  {
    pos: 3,
    icon: 'mdi-soccer',
    color: '#6b7280',
    label: 'Mais Palpites Feitos',
    detail: 'Se ainda empatados, quem participou de mais jogos fica melhor posicionado.',
  },
]

const sealRewards = [
  { event: 'Placar Exato',    seals: 50, icon: 'mdi-bullseye-arrow', color: '#2e9e47' },
  { event: 'Acerto Vencedor', seals: 20, icon: 'mdi-trophy',         color: '#2e9e47' },
  { event: 'Acerto Empate',   seals: 20, icon: 'mdi-handshake',      color: '#2e9e47' },
  { event: 'Palpite Enviado', seals:  5, icon: 'mdi-soccer',         color: '#2e9e47' },
  { event: 'Bônus Mata-Mata', seals: 30, icon: 'mdi-sword-cross',    color: '#2e9e47' },
]

const timeline = [
  {
    time: '24h antes do jogo',
    title: 'Palpites abrem',
    desc: 'A janela de apostas é liberada e você já pode enviar seu placar.',
    icon: 'mdi-clock-outline',
    color: '#2e9e47',
    bg: 'rgba(46,158,71,.12)',
  },
  {
    time: 'No apito inicial',
    title: 'Palpites fecham',
    desc: 'Quando a bola começa a rolar, não é mais possível enviar novos palpites.',
    icon: 'mdi-lock',
    color: '#2e9e47',
    bg: 'rgba(46,158,71,.12)',
  },
  {
    time: 'Após o apito final',
    title: 'Pontos e selos são calculados',
    desc: 'Assim que o resultado é registrado, seu ranking e selos são atualizados automaticamente.',
    icon: 'mdi-check-circle',
    color: '#2e9e47',
    bg: 'rgba(46,158,71,.12)',
  },
]

const exampleMatches = [
  { game: 'Brasil × Argentina',    bet: '2–1', result: '2–1', type: 'Placar Exato',   pts: 10, chipColor: 'success', ptsColor: '#2e9e47' },
  { game: 'França × Espanha',      bet: '1–0', result: '2–0', type: 'Vencedor Certo', pts:  5, chipColor: 'success', ptsColor: '#2e9e47' },
  { game: 'Inglaterra × Alemanha', bet: '0–0', result: '1–1', type: 'Empate Certo',   pts:  5, chipColor: 'success', ptsColor: '#2e9e47' },
  { game: 'Alemanha × Japão',      bet: '2–0', result: '0–1', type: 'Sem Acerto',     pts:  0, chipColor: 'default', ptsColor: '#9ca3af' },
]
</script>

<style scoped>
/* ── Hero ── */
.page-hero {
  background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%);
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
  max-width: 520px;
  line-height: 1.7;
}

/* ── Section headers ── */
.section-title {
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.section-title.white-text { color: #fff; }
.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 540px;
  line-height: 1.7;
}

/* ── Summary ── */
.section-summary { background: #fff; }
.summary-box {
  background: #fff;
  border-radius: 16px;
  padding: 28px 32px;
}
.summary-title {
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #374151;
  display: flex;
  align-items: center;
}
.summary-items { display: flex; flex-direction: column; gap: 12px; }
.summary-item  { display: flex; align-items: flex-start; gap: 12px; }
.summary-num {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  background: #2e9e47;
  color: #fff;
  font-size: .75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.summary-text { font-size: .95rem; color: #374151; line-height: 1.6; }

/* ── Scoring cards ── */
.section-light { background: #fff; }
.scoring-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
}
.scoring-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.08) !important; }
.scoring-pts {
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -.02em;
}
.scoring-name { font-size: 1rem; font-weight: 700; color: #111827; }
.scoring-desc { font-size: .9rem; color: #6b7280; line-height: 1.6; }
.scoring-example {
  background: #f9fafb;
  border-radius: 10px;
  padding: 10px 12px;
}
.example-label { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #9ca3af; }
.example-content { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; }
.example-bet  { font-size: .85rem; color: #374151; font-weight: 600; }
.example-real { font-size: .85rem; color: #374151; font-weight: 600; }

/* ── Knockout ── */
.section-knockout { background: #fff; }
.knockout-desc { font-size: 1rem; color: #6b7280; line-height: 1.7; }
.knockout-highlight {
  display: flex;
  align-items: center;
  background: rgba(46,158,71,.08);
  border: 1px solid rgba(46,158,71,.2);
  border-radius: 14px;
  padding: 16px 20px;
}
.knockout-bonus-num {
  font-size: 1.8rem;
  font-weight: 900;
  color: #2e9e47;
  line-height: 1;
}
.knockout-bonus-label { font-size: .85rem; color: #6b7280; margin-top: 2px; }
.phases-list { display: flex; flex-direction: column; gap: 10px; }
.phase-item {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
}
.phase-name { font-size: .95rem; color: #111827; font-weight: 600; }
.phases-note { font-size: .8rem; color: #9ca3af; line-height: 1.6; }

/* ── Tiebreakers ── */
.tiebreaker-list { display: flex; flex-direction: column; gap: 12px; }
.tiebreaker-item {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px 20px;
}
.tb-pos {
  font-size: 1.4rem;
  font-weight: 900;
  color: #d1d5db;
  width: 36px;
  min-width: 36px;
  margin-right: 4px;
}
.tb-info { flex: 1; }
.tb-label { font-size: .95rem; font-weight: 700; color: #111827; }
.tb-detail { font-size: .82rem; color: #6b7280; line-height: 1.5; margin-top: 2px; }
.tiebreaker-note {
  display: flex;
  align-items: flex-start;
  font-size: .88rem;
  color: #374151;
  line-height: 1.6;
}

/* ── Seals ── */
.section-seals { background: #fff; }
.seal-reward-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  transition: background .2s;
}
.seal-reward-card:hover { background: #f0fdf4; }
.seal-reward-num {
  font-size: 1.6rem;
  font-weight: 900;
  color: #111827;
  line-height: 1;
}
.seal-reward-label { font-size: .72rem; color: #9ca3af; font-weight: 600; letter-spacing: .05em; }
.seal-reward-event { font-size: .78rem; color: #6b7280; line-height: 1.4; }
.seals-info-box {
  display: flex;
  align-items: flex-start;
  font-size: .88rem;
  color: #374151;
  line-height: 1.6;
}
.seals-link {
  color: #2e9e47;
  font-weight: 700;
  text-decoration: none;
}
.seals-link:hover { text-decoration: underline; }

/* ── Timeline ── */
.timeline { position: relative; display: flex; flex-direction: column; gap: 0; }
.timeline-item { display: flex; align-items: flex-start; gap: 16px; position: relative; padding-bottom: 8px; }
.timeline-icon-wrap {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.timeline-connector {
  position: absolute;
  left: 21px;
  top: 44px;
  width: 2px;
  height: calc(100% - 44px + 8px);
  background: #e5e7eb;
}
.timeline-content { padding-top: 8px; padding-bottom: 24px; }
.timeline-time  { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
.timeline-title { font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
.timeline-desc  { font-size: .88rem; color: #6b7280; line-height: 1.6; }
.timeline-note {
  display: flex;
  align-items: flex-start;
  font-size: .88rem;
  color: #374151;
  line-height: 1.6;
}

/* ── Example table ── */
.section-example { background: #fff; }
.example-table-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.example-table-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}
.example-table-row {
  border-bottom: 1px solid #f3f4f6;
}
.example-table-row.last-row { border-bottom: none; }
.match-name  { font-size: .88rem; font-weight: 600; color: #111827; }
.score-badge {
  display: inline-block;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: .82rem;
  font-weight: 700;
  color: #374151;
}
.score-real  { background: #dcfce7; color: #15803d; }
.type-text   { font-size: .85rem; font-weight: 600; }
.mobile-match-card { border-bottom: 1px solid #f3f4f6; }
.mobile-match-card.last-row { border-bottom: none; }
.mobile-label { font-size: .75rem; color: #9ca3af; font-weight: 600; }
@media (max-width: 599px) {
  .mobile-match-card .score-badge {
    background: transparent;
    border-radius: 0;
    padding: 0;
    font-weight: 700;
    margin: 0 4px;
  }
  .mobile-match-card .score-real {
    color: #2e9e47;
  }
  .mobile-label {
    margin-right: 2px;
  }
}
.pts-value   { font-size: .95rem; font-weight: 800; }
.example-table-total {
  background: #f0fdf4;
  border-top: 2px solid #d1fae5;
}
.total-label { font-size: .9rem; font-weight: 700; color: #374151; }
.total-pts   { font-size: 1.2rem; font-weight: 900; color: #2e9e47; }

@media (max-width: 599px) {
  .scoring-pts { font-size: 1.6rem; }
  .scoring-icon-mobile { display: none; }
  .page-hero { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-summary { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-light:first-of-type,
  .section-light.first-section { padding-top: 64px !important; padding-bottom: 64px !important; }
  .section-light,
  .section-knockout,
  .section-seals,
  .section-example { padding-top: 0 !important; padding-bottom: 64px !important; }
}
.gap-3 { gap: 12px; }
</style>
