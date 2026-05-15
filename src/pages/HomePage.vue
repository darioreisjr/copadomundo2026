<template>
  <AppLayout fluid>

    <!-- ===== HERO ===== -->
    <section class="hero-section py-10 py-md-16">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" class="text-center">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              class="hero-logo mb-6"
            />
            <h1 class="hero-title mb-4">
              Entre no clima da Copa com seus palpites
            </h1>
            <p class="hero-subtitle mb-8 mx-auto">
              Dê seus palpites nos jogos, acumule pontos e dispute o ranking geral com seus amigos.
            </p>
            <div class="d-flex flex-wrap justify-center gap-3 mb-10">
              <v-btn
                :to="{ name: 'Register' }"
                color="#f5c542"
                size="large"
                class="font-weight-bold text-black px-8"
                prepend-icon="mdi-account-plus"
                elevation="3"
              >
                Criar conta
              </v-btn>
              <v-btn
                :to="{ name: 'Login' }"
                variant="outlined"
                size="large"
                class="font-weight-bold px-8"
                style="border-color:#fff;color:#fff"
                prepend-icon="mdi-login"
              >
                Entrar
              </v-btn>
              <v-btn
                href="#como-funciona"
                variant="text"
                size="large"
                class="px-8"
                style="color:#f5c542"
                prepend-icon="mdi-chevron-down"
              >
                Ver como funciona
              </v-btn>
            </div>

            <!-- Mini-cards de destaque -->
            <v-row justify="center" class="mt-2">
              <v-col
                v-for="card in heroCards"
                :key="card.label"
                cols="6"
                sm="3"
                class="d-flex"
              >
                <v-card
                  class="hero-mini-card pa-4 text-center flex-grow-1"
                  rounded="lg"
                  elevation="0"
                >
                  <v-icon :color="card.iconColor" size="32" class="mb-2">{{ card.icon }}</v-icon>
                  <div class="text-caption font-weight-bold text-white">{{ card.label }}</div>
                  <div class="text-caption" style="color:#f5c54290">{{ card.sub }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== COMO FUNCIONA ===== -->
    <section id="como-funciona" class="py-12 bg-white">
      <v-container>
        <div class="section-label text-center mb-2">Simples e rápido</div>
        <h2 class="section-title text-center mb-2">Como funciona</h2>
        <p class="section-subtitle text-center mb-10 mx-auto">
          Participar do Bolão Copa 26 é fácil. Veja os quatro passos para começar.
        </p>
        <v-row justify="center">
          <v-col
            v-for="(step, i) in steps"
            :key="i"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="step-card text-center pa-4">
              <div class="step-number mx-auto mb-4">{{ i + 1 }}</div>
              <img v-if="step.img" :src="step.img" :alt="step.title" style="width:52px;height:52px;object-fit:contain" class="mb-3" />
              <v-icon v-else :color="step.color" size="40" class="mb-3">{{ step.icon }}</v-icon>
              <div class="text-subtitle-1 font-weight-bold mb-2">{{ step.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== PONTUAÇÃO ===== -->
    <section class="py-12 bg-scoring">
      <v-container>
        <div class="section-label text-center mb-2" style="color:#f5c542">Regras do jogo</div>
        <h2 class="section-title text-center text-white mb-2">Pontuação</h2>
        <p class="section-subtitle text-center mb-10 mx-auto text-white" style="opacity:.8">
          Quanto mais preciso o seu palpite, mais pontos você ganha.
        </p>
        <v-row justify="center">
          <v-col
            v-for="rule in scoringRules"
            :key="rule.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card
              class="scoring-card pa-6 text-center"
              rounded="xl"
              elevation="4"
              height="100%"
            >
              <v-icon :color="rule.iconColor" size="48" class="mb-3">{{ rule.icon }}</v-icon>
              <div class="scoring-pts mb-2" :style="{ color: rule.ptsColor }">{{ rule.pts }}</div>
              <div class="text-subtitle-1 font-weight-bold mb-2">{{ rule.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ rule.text }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== RANKING ===== -->
    <section class="py-12 bg-white">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="mb-8 mb-md-0">
            <img
              src="@/image/dashboardRanking.png"
              alt="Preview do Ranking Copa 26"
              class="ranking-preview-img"
            />
          </v-col>
          <v-col cols="12" md="5" class="pl-md-8">
            <div class="section-label mb-2">Competição real</div>
            <h2 class="section-title mb-4">Ranking geral</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">
              Acompanhe em tempo real sua posição no ranking. Cada palpite certo faz a diferença.
            </p>
            <ul class="ranking-features">
              <li v-for="f in rankingFeatures" :key="f">
                <v-icon color="green-darken-3" size="18" class="mr-2">mdi-check-circle</v-icon>
                {{ f }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== 24H PALPITES ===== -->
    <section class="py-12 bg-green-rule">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="2" class="text-center mb-4 mb-sm-0">
            <img src="@/image/weatherIcon.png" alt="24h" style="width:150px;height:auto" />
          </v-col>
          <v-col cols="12" sm="8">
            <h2 class="text-white font-weight-bold text-h5 text-md-h4 mb-3">
              Palpites liberados 24h antes de cada jogo
            </h2>
            <p class="text-white mb-4" style="opacity:.85">
              Cada partida abre uma janela de palpites que começa <strong>24 horas antes</strong> do início do jogo
              e fecha automaticamente no horário da bola rolando. Fique de olho na agenda!
            </p>
            <div class="d-flex flex-wrap gap-3">
              <v-chip color="#f5c542" variant="elevated" rounded="lg" class="text-black font-weight-bold">
                <v-icon start>mdi-pencil</v-icon>
                Crie ou edite enquanto estiver aberto
              </v-chip>
              <v-chip color="white" variant="elevated" rounded="lg" class="font-weight-bold">
                <v-icon start color="red">mdi-lock</v-icon>
                Fecha no horário do jogo
              </v-chip>
              <v-chip color="white" variant="elevated" rounded="lg" class="font-weight-bold">
                <v-icon start color="orange">mdi-alert</v-icon>
                Sem alteração após início
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== GEMINI ===== -->
    <section class="py-12 bg-white">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" md="5" class="mb-8 mb-md-0">
            <div class="section-label mb-2" style="color:#1e88e5">Tecnologia</div>
            <h2 class="section-title mb-4">Powered by Gemini</h2>
            <p class="text-body-1 text-medium-emphasis mb-6">
              O Gemini auxilia na organização dos confrontos da Copa, mas tudo passa pela revisão do
              administrador antes de ser salvo no sistema.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <img
              src="@/image/geminiPass.png"
              alt="Gemini no Bolão"
              class="gemini-preview-img"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== RECURSOS MVP ===== -->
    <section class="py-14 bg-features">
      <v-container>
        <!-- Cabeçalho -->
        <div class="text-center mb-10">
          <v-icon color="#f5c542" size="48" class="mb-2">mdi-trophy</v-icon>
          <div class="mvp-divider mx-auto mb-4"></div>
          <h2 class="mvp-title mb-3">
            RECURSOS
          </h2>
          <p class="mvp-subtitle mx-auto">
            Tudo o que você precisa para viver o Bolão da Copa como nunca antes!
          </p>
        </div>

        <!-- Linha 1 — 6 cards -->
        <v-row justify="center" class="mb-4">
          <v-col
            v-for="feat in featuresRow1"
            :key="feat.label"
            cols="6"
            sm="4"
            md="2"
          >
            <v-card class="mvp-card pa-5 text-center" rounded="xl" elevation="0" height="100%">
              <div class="mvp-icon-wrap mx-auto mb-4">
                <img v-if="feat.img" :src="feat.img" :alt="feat.label"  />
                <v-icon v-else :color="feat.color" size="52">{{ feat.icon }}</v-icon>
              </div>
              <div class="mvp-card-title mb-2">{{ feat.label }}</div>
              <div class="mvp-card-desc">{{ feat.desc }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Linha 2 — 4 cards centralizados -->
        <v-row justify="center">
          <v-col
            v-for="feat in featuresRow2"
            :key="feat.label"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card class="mvp-card pa-5 text-center" rounded="xl" elevation="0" height="100%">
              <div class="mvp-icon-wrap mx-auto mb-4">
                <img v-if="feat.img" :src="feat.img" :alt="feat.label"  />
                <v-icon v-else :color="feat.color" size="52">{{ feat.icon }}</v-icon>
              </div>
              <div class="mvp-card-title mb-2">{{ feat.label }}</div>
              <div class="mvp-card-desc">{{ feat.desc }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="py-16 cta-section text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="7">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              style="height:clamp(56px,14vw,100px);width:auto;margin-bottom:24px"
            />
            <h2 class="cta-title mb-4">Pronto para entrar no bolão?</h2>
            <p class="cta-subtitle mb-10 mx-auto">
              Crie sua conta, acompanhe os jogos da Copa e dispute cada ponto no ranking.
            </p>
            <div class="d-flex flex-wrap justify-center gap-4">
              <v-btn
                :to="{ name: 'Register' }"
                color="#f5c542"
                size="x-large"
                class="font-weight-bold text-black px-10"
                prepend-icon="mdi-account-plus"
                elevation="4"
              >
                Criar conta grátis
              </v-btn>
              <v-btn
                :to="{ name: 'Login' }"
                variant="outlined"
                size="x-large"
                class="font-weight-bold px-10"
                style="border-color:#fff;color:#fff"
                prepend-icon="mdi-login"
              >
                Já tenho conta
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const heroCards = [
  { icon: 'mdi-clock-fast',    iconColor: '#f5c542', label: 'Palpites 24h antes', sub: 'de cada partida' },
  { icon: 'mdi-check-bold',    iconColor: '#4caf50', label: '10 pts placar exato', sub: 'máxima pontuação' },
  { icon: 'mdi-trophy-outline',iconColor: '#ff8c00', label: '5 pts vencedor',      sub: 'ou empate certo' },
  { icon: 'mdi-podium',        iconColor: '#1e88e5', label: 'Ranking em tempo real',sub: 'posição atualizada' },
]

const steps = [
  { img: new URL('@/image/addPersonIcon.png', import.meta.url).href, color: '#1f7a33', title: 'Crie sua conta', text: 'Cadastre-se de forma simples para participar do bolão.' },
  { icon: 'mdi-calendar-check', color: '#1e88e5', title: 'Veja os jogos liberados',text: 'Os palpites ficam disponíveis 24h antes de cada partida.' },
  { icon: 'mdi-pencil-box',     color: '#ff8c00', title: 'Envie seu placar',       text: 'Escolha o resultado que acredita para cada jogo.' },
  { icon: 'mdi-podium-gold',    color: '#f5c542', title: 'Suba no ranking',        text: 'Ganhe pontos pelos acertos e acompanhe sua posição.' },
]

const scoringRules = [
  { icon: 'mdi-bullseye-arrow', iconColor: '#1f7a33', ptsColor: '#1f7a33', pts: '10 pts', ptsColor2: '#1f7a33', title: 'Placar exato',    text: 'Acerte exatamente o resultado da partida.' },
  { icon: 'mdi-trophy',         iconColor: '#ff8c00', ptsColor: '#ff8c00', pts: '5 pts',  title: 'Vencedor certo',  text: 'Acerte quem venceu, mesmo sem acertar o placar.' },
  { icon: 'mdi-handshake',      iconColor: '#1e88e5', ptsColor: '#1e88e5', pts: '5 pts',  title: 'Empate certo',    text: 'Acerte que o jogo terminou empatado.' },
  { icon: 'mdi-close-circle',   iconColor: '#9e9e9e', ptsColor: '#9e9e9e', pts: '0 pts',  title: 'Sem acerto',      text: 'Caso o palpite não bata com o resultado.' },
]

const rankingFeatures = [
  'Posição e nome do participante',
  'Total de pontos acumulados',
  'Palpites enviados',
  'Placares exatos acertados',
  'Vencedores e empates certos',
]

const featuresRow1 = [
  { img: new URL('@/image/addPersonIcon.png', import.meta.url).href, color: '#90caf9', label: 'Cadastro e login', desc: 'Crie sua conta de forma simples e segura.' },
  { img: new URL('@/image/dashboardIcon.png', import.meta.url).href, color: '#64b5f6', label: 'Dashboard', desc: 'Acompanhe seus palpites, pontos e desempenho.' },
  { img: new URL('@/image/calendarIcon.png', import.meta.url).href, color: '#f5c542', label: 'Jogos da Copa', desc: 'Veja todos os jogos, datas, horários e fases.' },
  { img: new URL('@/image/forecastIcon.png', import.meta.url).href, color: '#ce93d8', label: 'Envio de palpites', desc: 'Dê seus palpites e edite enquanto estiver aberto.' },
  { img: new URL('@/image/rankingIcon.png', import.meta.url).href, color: '#f5c542', label: 'Ranking geral', desc: 'Dispute as primeiras posições e seja o melhor do bolão.' },
  { icon: 'mdi-shield-crown',    color: '#ffb74d', label: 'Painel admin',          desc: 'Gerencie jogos, resultados e usuários do bolão.' },
]

const featuresRow2 = [
  { icon: 'mdi-calculator-variant', color: '#a5d6a7', label: 'Pontuação automática', desc: 'Pontuação calculada automaticamente após cada jogo.' },
  { icon: 'mdi-robot-happy',        color: '#81d4fa', label: 'Integração Gemini',   desc: 'IA que ajuda a organizar confrontos e sugerir jogos da Copa.' },
  { icon: 'mdi-lock-check',         color: '#f5c542', label: 'Supabase Auth',       desc: 'Autenticação segura com tecnologia de ponta.' },
  { icon: 'mdi-database',           color: '#ce93d8', label: 'Banco PostgreSQL',    desc: 'Dados armazenados com segurança, escalabilidade e confiabilidade.' },
]
</script>

<style scoped>
/* ---- Hero ---- */
.hero-section {
  background: linear-gradient(135deg, #145c27 0%, #1f7a33 60%, #2e9e47 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-logo {
  height: clamp(80px, 22vw, 160px);
  width: auto;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,.4));
}

.hero-title {
  font-size: clamp(1.6rem, 5vw, 2.8rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0,0,0,.3);
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255,255,255,.85);
  max-width: 600px;
}

.hero-mini-card {
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  backdrop-filter: blur(6px);
}

/* ---- Sections ---- */
.section-label {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #1f7a33;
}

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.section-subtitle {
  max-width: 560px;
  color: #6b7280;
  font-size: 1rem;
}

/* ---- Steps ---- */
.step-card {
  border-radius: 16px;
  transition: box-shadow .2s;
}
.step-card:hover {
  box-shadow: 0 8px 32px rgba(31,122,51,.12);
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #f5c542);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(31,122,51,.3);
}

/* ---- Scoring ---- */
.bg-scoring {
  background: linear-gradient(135deg, #145c27 0%, #1f7a33 100%);
}

.scoring-card {
  border-top: 4px solid #f5c542;
}

.scoring-pts {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
}

/* ---- Ranking ---- */
.ranking-preview-img {
  width: 90%;
  max-width: 560px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
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
  padding: 6px 0;
  font-size: .95rem;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

/* ---- 24h Green ---- */
.bg-green-rule {
  background: linear-gradient(135deg, #145c27 0%, #1f7a33 100%);
}

/* ---- Gemini ---- */
.gemini-preview-img {
  width: 90%;
  max-width: 560px;
  height: auto;
  border-radius: 0;
  box-shadow: none;
  display: block;
  margin: 0 auto;
}

/* ---- Features MVP ---- */
.bg-features {
  background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #0d3d1f 100%);
}

.mvp-title {
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: .04em;
}

.mvp-subtitle {
  color: rgba(255,255,255,.8);
  font-size: 1rem;
  max-width: 560px;
}

.mvp-divider {
  width: 180px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #f5c542, transparent);
}

.mvp-card {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  color: #fff;
  transition: background .2s, transform .2s;
}
.mvp-card:hover {
  background: rgba(255,255,255,.12);
  transform: translateY(-4px);
}

.mvp-icon-wrap {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mvp-icon-wrap img {
  width: 88px;
  height: 88px;
  object-fit: contain;
}

.mvp-card-title {
  font-size: .95rem;
  font-weight: 700;
  color: #fff;
}

.mvp-card-desc {
  font-size: .78rem;
  color: rgba(255,255,255,.65);
  line-height: 1.4;
}

/* ---- CTA ---- */
.cta-section {
  background: linear-gradient(135deg, #145c27 0%, #1f7a33 100%);
}

.cta-title {
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,.75);
  max-width: 520px;
}

/* ---- Gap utility (Vuetify 3 já fornece, mas fallback) ---- */
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
