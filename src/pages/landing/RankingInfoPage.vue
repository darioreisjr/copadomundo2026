<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Competição real</div>
        <h1 class="page-title mb-4">Ranking</h1>
        <p class="page-subtitle mx-auto">
          Cada palpite certo move você uma posição acima. O ranking reflete em tempo real
          o desempenho de todos os participantes ao longo da Copa.
        </p>
      </v-container>
    </section>

    <!-- Resumo rápido -->
    <section class="section-summary py-10">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <div class="summary-box">
              <div class="summary-title mb-4">Em resumo</div>
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

    <!-- O que aparece no ranking -->
    <section class="section-light py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6">
            <img
              src="@/image/dashboardRanking.png"
              alt="Preview do Ranking Copa 26"
              class="feature-preview-img"
            />
          </v-col>
          <v-col cols="12" md="5" class="pl-md-10 mt-10 mt-md-0">
            <div class="section-label-green mb-2">O que você vê no ranking</div>
            <h2 class="content-title mb-2">Ranking geral</h2>
            <p class="content-desc mb-5">
              A tabela mostra todos os participantes ordenados por pontuação.
              Cada coluna revela um detalhe do desempenho de quem está à frente.
            </p>
            <ul class="ranking-features">
              <li v-for="f in rankingFeatures" :key="f">{{ f }}</li>
            </ul>
            <div class="ranking-note mt-5">
              <span class="note-dot"></span>
              Sua linha aparece destacada em verde para você se localizar rapidamente na tabela.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Como os pontos chegam ao ranking -->
    <section class="section-pts py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">De onde vêm os pontos</div>
          <h2 class="section-title mb-3">Pontos que movem você no ranking</h2>
          <p class="section-subtitle mx-auto">
            Cada palpite é comparado ao resultado real assim que o jogo termina.
            O sistema calcula automaticamente quantos pontos você ganhou.
          </p>
        </div>

        <v-row justify="center" class="mb-8">
          <v-col
            v-for="rule in scoringRules"
            :key="rule.title"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="pts-card pa-6" rounded="xl" elevation="0" height="100%">
              <div class="pts-value mb-1" :style="{ color: rule.color }">{{ rule.pts }}</div>
              <div class="pts-unit mb-3" :style="{ color: rule.color }">pontos</div>
              <div class="pts-name mb-2">{{ rule.title }}</div>
              <div class="pts-desc">{{ rule.desc }}</div>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <router-link :to="{ name: 'Pontuacao' }" class="pts-link">
              Ver a tabela completa de pontuacao
              <v-icon size="14" class="ml-1">mdi-arrow-right</v-icon>
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Critérios de desempate -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Mesma pontuacao?</div>
          <h2 class="section-title mb-3">Como o empate é resolvido</h2>
          <p class="section-subtitle mx-auto">
            Se dois participantes terminarem com a mesma pontuacao, o sistema usa
            estes critérios em ordem para decidir quem fica à frente.
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
              Esse sistema valoriza a precisão. Quem acerta o placar número por número
              fica à frente de quem acerta só o vencedor, mesmo que ambos tenham a mesma pontuacao total.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Tipos de ranking -->
    <section class="section-dark py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Onde você compete</div>
          <h2 class="section-title mb-3">Tipos de ranking</h2>
          <p class="section-subtitle mx-auto">
            Você disputa a liderança em dois cenários ao mesmo tempo,
            no bolão geral e dentro do seu grupo privado.
          </p>
        </div>
        <v-row justify="center">
          <v-col
            v-for="rank in rankingTypes"
            :key="rank.title"
            cols="12"
            sm="6"
            md="4"
          >
            <div class="rank-card text-center pa-8">
              <v-icon :icon="rank.icon" size="44" color="#1f7a33" class="mb-4" />
              <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#111827">{{ rank.title }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.6">{{ rank.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Como subir no ranking -->
    <section class="section-strategy py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Estratégia</div>
          <h2 class="section-title mb-3">O que separa os primeiros dos demais</h2>
          <p class="section-subtitle mx-auto">
            Pequenas decisões ao palpitar fazem diferença no final do torneio.
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="10" lg="9">
            <div class="strategy-list">
              <div
                v-for="tip in strategyTips"
                :key="tip.num"
                class="strategy-item"
              >
                <div class="strategy-num">{{ tip.num }}</div>
                <div class="strategy-body">
                  <div class="strategy-title">{{ tip.title }}</div>
                  <div class="strategy-desc">{{ tip.desc }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>


  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const quickSummary = [
  'Cada palpite certo soma pontos ao seu total e pode mover você no ranking.',
  'O ranking atualiza automaticamente após cada resultado confirmado.',
  'Quem tiver mais pontos ao final do torneio vence o bolão.',
]

const rankingFeatures = [
  'Posição numerada, com medalha para o top 3',
  'Nome do participante',
  'Total de pontos acumulados',
  'Quantidade de placares exatos acertados',
  'Quantidade de vencedores e empates certos',
  'Total de palpites feitos no torneio',
]

const scoringRules = [
  {
    pts: 10,
    color: '#2e9e47',
    title: 'Placar Exato',
    desc: 'Você acertou o número exato de gols de cada time. O resultado bate número por número com o seu palpite.',
  },
  {
    pts: 5,
    color: '#2e9e47',
    title: 'Vencedor ou Empate Certo',
    desc: 'Você acertou quem venceu ou previu o empate, mas os números dos gols foram diferentes do resultado.',
  },
  {
    pts: 0,
    color: '#9ca3af',
    title: 'Sem Acerto',
    desc: 'Seu palpite não corresponde ao resultado em nenhum critério. Nenhum ponto é adicionado ao total.',
  },
]

const tiebreakers = [
  {
    pos: 1,
    label: 'Mais Placares Exatos',
    detail: 'Quem acertou mais vezes o placar número por número fica à frente.',
  },
  {
    pos: 2,
    label: 'Mais Acertos de Vencedor',
    detail: 'Se ainda empatados, conta quem acertou mais vezes o time vencedor ou o empate.',
  },
  {
    pos: 3,
    label: 'Mais Palpites Feitos',
    detail: 'Se ainda empatados, quem participou de mais jogos fica melhor posicionado.',
  },
]

const rankingTypes = [
  {
    icon: 'mdi-earth',
    title: 'Ranking Global',
    desc: 'Todos os participantes do bolão disputam a liderança geral. O campeão é quem acumulou mais pontos em toda a Copa.',
  },
  {
    icon: 'mdi-account-group',
    title: 'Ranking do Grupo',
    desc: 'Cada grupo privado tem seu próprio ranking. Você compete separadamente com os amigos que convidou.',
  },
  {
    icon: 'mdi-update',
    title: 'Tempo Real',
    desc: 'Assim que o resultado de um jogo é registrado, pontos e posicoes sao recalculados para todos os participantes.',
  },
]

const strategyTips = [
  {
    num: 1,
    title: 'Priorize placares exatos',
    desc: 'Um placar exato vale 10 pontos, o dobro de um simples acerto de vencedor. Pesquisar o histórico dos times antes de palpitar faz diferença no final da tabela.',
  },
  {
    num: 2,
    title: 'Palpite em todos os jogos',
    desc: 'O terceiro critério de desempate é o total de palpites feitos. Não pular jogos garante que você não perde por falta de participacao.',
  },
  {
    num: 3,
    title: 'Fique atento às fases eliminatórias',
    desc: 'A partir das oitavas de final, cada acerto rende 30 selos extras. Além de pontos no ranking, os placares corretos nas fases finais valem muito mais na economia do bolão.',
  },
]
</script>

<style scoped>
/* Hero */
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
.section-label-green {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1f7a33;
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

/* Section headers */
.section-title {
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.section-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 540px;
  line-height: 1.7;
}
.content-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.content-desc {
  font-size: .95rem;
  color: #6b7280;
  line-height: 1.7;
}

/* Summary */
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

/* Ranking features list */
.section-light { background: #fff; }
.feature-preview-img {
  width: 90%;
  max-width: 560px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,.12);
  display: block;
  margin: 0 auto;
}
.ranking-features {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ranking-features li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: .95rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  line-height: 1.6;
}
.ranking-features li::before {
  content: '';
  display: inline-block;
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1f7a33;
  margin-right: 12px;
}
.ranking-note {
  display: flex;
  align-items: flex-start;
  font-size: .85rem;
  color: #6b7280;
  line-height: 1.6;
  gap: 10px;
}
.note-dot {
  display: inline-block;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background: #d1fae5;
  border: 2px solid #2e9e47;
  margin-top: 5px;
}

/* Scoring points cards */
.section-pts { background: #fff; }
.pts-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow .2s;
}
.pts-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,.08) !important; }
.pts-value {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -.02em;
}
.pts-unit {
  font-size: .85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.pts-name { font-size: 1rem; font-weight: 700; color: #111827; }
.pts-desc { font-size: .88rem; color: #6b7280; line-height: 1.6; }
.pts-link {
  font-size: .88rem;
  font-weight: 700;
  color: #1f7a33;
  text-decoration: none;
}
.pts-link:hover { text-decoration: underline; }

/* Tiebreakers */
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

/* Ranking types (light section) */
.section-dark { background: #fff; }
.rank-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow .2s;
}
.rank-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.08); }

/* Strategy tips */
.section-strategy { background: #fff; }
.strategy-list { display: flex; flex-direction: column; gap: 16px; }
.strategy-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px;
  transition: box-shadow .2s;
}
.strategy-item:hover { box-shadow: 0 4px 20px rgba(31,122,51,.08); }
.strategy-num {
  font-size: 2rem;
  font-weight: 900;
  color: #e5e7eb;
  line-height: 1;
  min-width: 36px;
}
.strategy-body { flex: 1; }
.strategy-title { font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 4px; }
.strategy-desc { font-size: .88rem; color: #6b7280; line-height: 1.6; }

/* CTA */
.section-cta { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 100%); }
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.cta-sub {
  font-size: 1rem;
  color: rgba(255,255,255,.65);
}
.gap-3 { gap: 12px; }

@media (max-width: 599px) {
  .page-hero { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-summary { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-light,
  .section-pts,
  .section-strategy { padding-top: 64px !important; padding-bottom: 64px !important; }
  .pts-value { font-size: 2.2rem; }
}
</style>
