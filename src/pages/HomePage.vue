<template>
  <AppLayout fluid is-public>

    <!-- ===== HERO (parallax duplo) ===== -->
    <section class="hero-section">
      <div ref="heroStadium" class="hero-parallax-stadium" aria-hidden="true">
        <img src="@/image/futuristicStadium.png" alt="" />
      </div>
      <div ref="heroParallax" class="hero-parallax-bg" aria-hidden="true"></div>
      <div class="hero-content">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <img
                src="@/image/logo.png"
                alt="Bolão Copa 26"
                class="hero-logo mb-8"
              />
              <h1 class="hero-title mb-5">
                Entre no clima da Copa com seus palpites
              </h1>
              <p class="hero-subtitle mb-10 mx-auto">
                Dê seus palpites nos jogos, acumule pontos e dispute o ranking geral com seus amigos.
              </p>
              <div class="d-flex flex-wrap justify-center gap-3 mb-12">
                <v-btn
                  :to="{ name: 'Register' }"
                  color="#f5c542"
                  size="large"
                  class="font-weight-bold text-black px-10"
                  elevation="0"
                  rounded="lg"
                >
                  Criar conta
                </v-btn>
                <v-btn
                  :to="{ name: 'Login' }"
                  variant="outlined"
                  size="large"
                  class="font-weight-bold px-10"
                  style="border-color:rgba(255,255,255,.5);color:#fff"
                  rounded="lg"
                >
                  Entrar
                </v-btn>
              </div>

              <!-- Stat pills -->
              <div class="d-flex flex-wrap justify-center gap-3">
                <div
                  v-for="card in heroCards"
                  :key="card.label"
                  class="hero-pill"
                >
                  <span class="hero-pill-value">{{ card.value }}</span>
                  <span class="hero-pill-label">{{ card.label }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </section>

    <!-- ===== COMO FUNCIONA ===== -->
    <section class="section-light py-16">
      <v-container>
        <div class="section-label text-center mb-2 reveal">Simples e rápido</div>
        <h2 class="section-title text-center mb-2 reveal">Como funciona</h2>
        <p class="section-subtitle text-center mb-12 mx-auto reveal">
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
            <div class="step-card text-center pa-6 reveal">
              <div class="step-number mx-auto mb-5">{{ i + 1 }}</div>
              <img
                v-if="step.img"
                :src="step.img"
                :alt="step.title"
                class="step-img mb-4"
              />
              <div class="text-subtitle-1 font-weight-bold mb-2">{{ step.title }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.7">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== PONTUAÇÃO ===== -->
    <section class="section-dark py-16">
      <v-container>
        <div class="section-label text-center mb-2 reveal" style="color:#f5c542">Regras do jogo</div>
        <h2 class="section-title text-center text-white mb-2 reveal">Pontuação</h2>
        <p class="section-subtitle text-center mb-12 mx-auto reveal" style="color:rgba(255,255,255,.7)">
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
              class="scoring-card pa-8 text-center reveal"
              rounded="xl"
              elevation="0"
              height="100%"
            >
              <div class="scoring-pts mb-3" :style="{ color: rule.ptsColor }">{{ rule.pts }}</div>
              <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#111827">{{ rule.title }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.7">{{ rule.text }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== GRUPOS ===== -->
    <section class="section-light py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="mb-10 mb-md-0">
            <img
              src="@/image/interactiveSportsPanel.png"
              alt="Grupos do Bolão Copa 26"
              class="feature-preview-img reveal"
            />
          </v-col>
          <v-col cols="12" md="5" class="pl-md-10">
            <div class="section-label mb-2 reveal">Social</div>
            <h2 class="section-title mb-5 reveal">Dispute com quem você conhece</h2>
            <p class="text-body-1 mb-6 reveal" style="color:#6b7280;line-height:1.7">
              Crie seu próprio grupo ou entre em um público. Cada grupo tem seu ranking interno,
              então você pode competir de perto com amigos, família ou colegas de trabalho.
            </p>
            <div class="d-flex flex-wrap gap-2 reveal">
              <span v-for="tag in groupTags" :key="tag" class="feature-tag">{{ tag }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== SELOS & CONQUISTAS ===== -->
    <section class="section-dark py-16">
      <v-container>
        <div class="section-label text-center mb-2 reveal" style="color:#f5c542">Economia do bolão</div>
        <h2 class="section-title text-center text-white mb-2 reveal">Ganhe selos, desbloqueie vantagens</h2>
        <p class="section-subtitle text-center mb-12 mx-auto reveal" style="color:rgba(255,255,255,.7)">
          Selos são a moeda do bolão. Acumule participando e use para potencializar sua experiência.
        </p>

        <!-- Como ganhar -->
        <v-row justify="center" class="mb-10">
          <v-col
            v-for="earn in selosEarn"
            :key="earn.label"
            cols="12"
            sm="4"
            md="4"
          >
            <div class="selos-earn-card text-center pa-6 reveal">
              <div class="selos-earn-value mb-3">{{ earn.value }}</div>
              <div class="text-subtitle-1 font-weight-bold text-white mb-1">{{ earn.label }}</div>
              <div class="text-body-2" style="color:rgba(255,255,255,.6);line-height:1.6">{{ earn.desc }}</div>
            </div>
          </v-col>
        </v-row>

        <!-- Divisor -->
        <div class="selos-divider reveal"></div>

        <!-- Como usar -->
        <p class="text-center mb-6 reveal" style="color:rgba(255,255,255,.5);font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:700">
          Como usar seus selos
        </p>
        <div class="d-flex flex-wrap justify-center gap-3 reveal">
          <span v-for="use in selosUse" :key="use" class="selos-use-tag">{{ use }}</span>
        </div>
      </v-container>
    </section>

    <!-- ===== CONSULTOR IA ===== -->
    <section class="section-light py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="5" class="mb-10 mb-md-0 pr-md-10">
            <div class="section-label mb-2 reveal">Tecnologia</div>
            <h2 class="section-title mb-5 reveal">Analise antes de palpitar</h2>
            <p class="text-body-1 mb-6 reveal" style="color:#6b7280;line-height:1.7">
              Antes de enviar seu palpite, consulte o histórico real de confrontos entre as seleções.
              O Google Gemini processa os dados da Copa e entrega probabilidades, histórico de vitórias
              e um placar sugerido baseado em estatísticas.
            </p>
            <div class="d-flex flex-wrap gap-2 mb-6 reveal">
              <span v-for="tag in aiTags" :key="tag" class="feature-tag">{{ tag }}</span>
            </div>
            <div class="ai-cost-note reveal">
              Cada consulta custa 20 selos — use com sabedoria.
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <img
              src="@/image/geminiPass.png"
              alt="Consultor IA Gemini"
              class="feature-preview-img reveal"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== RANKING ===== -->
    <section class="section-dark py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="5" class="mb-10 mb-md-0 pr-md-10">
            <div class="section-label mb-2 reveal" style="color:#f5c542">Competição real</div>
            <h2 class="section-title text-white mb-5 reveal">Ranking geral</h2>
            <p class="text-body-1 mb-6 reveal" style="color:rgba(255,255,255,.7);line-height:1.7">
              Acompanhe em tempo real sua posição no ranking. Cada palpite certo faz a diferença.
            </p>
            <ul class="ranking-features reveal">
              <li v-for="f in rankingFeatures" :key="f">{{ f }}</li>
            </ul>
          </v-col>
          <v-col cols="12" md="6">
            <img
              src="@/image/dashboardRanking.png"
              alt="Preview do Ranking Copa 26"
              class="feature-preview-img reveal"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="section-cta py-16 text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="7">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              style="height:clamp(56px,14vw,100px);width:auto;margin-bottom:32px"
            />
            <h2 class="cta-title mb-5 reveal">Pronto para entrar no bolão?</h2>
            <p class="cta-subtitle mb-12 mx-auto reveal">
              Crie sua conta, acompanhe os jogos da Copa e dispute cada ponto no ranking.
            </p>
            <div class="d-flex flex-wrap justify-center gap-4 reveal">
              <v-btn
                :to="{ name: 'Register' }"
                color="#f5c542"
                size="x-large"
                class="font-weight-bold text-black px-12"
                elevation="0"
                rounded="lg"
              >
                Criar conta grátis
              </v-btn>
              <v-btn
                :to="{ name: 'Login' }"
                variant="outlined"
                size="x-large"
                class="font-weight-bold px-12"
                style="border-color:rgba(255,255,255,.5);color:#fff"
                rounded="lg"
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
import { ref, onMounted, onUnmounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

// ---- Parallax ----
const heroParallax = ref(null)
const heroStadium = ref(null)

function onScroll() {
  if (window.innerWidth < 768) return
  const y = window.scrollY
  if (heroParallax.value) heroParallax.value.style.transform = `translateY(${y * 0.4}px)`
  if (heroStadium.value)  heroStadium.value.style.transform  = `translateY(${y * 0.22}px)`
}

// ---- Scroll reveal ----
let observer = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})

// ---- Data ----
const heroCards = [
  { value: '24h',    label: 'antes de cada partida' },
  { value: '10 pts', label: 'no placar exato' },
  { value: '5 pts',  label: 'no vencedor ou empate' },
  { value: '#1',     label: 'ranking em tempo real' },
]

const steps = [
  { img: new URL('@/image/addPersonIcon.png', import.meta.url).href, title: 'Crie sua conta', text: 'Cadastre-se de forma simples para participar do bolão.' },
  { title: 'Veja os jogos liberados', text: 'Os palpites ficam disponíveis 24h antes de cada partida.' },
  { title: 'Envie seu placar', text: 'Escolha o resultado que acredita para cada jogo.' },
  { title: 'Suba no ranking', text: 'Ganhe pontos pelos acertos e acompanhe sua posição.' },
]

const scoringRules = [
  { pts: '10 pts', ptsColor: '#2e9e47', title: 'Placar exato',   text: 'Acerte exatamente o resultado da partida.' },
  { pts: '5 pts',  ptsColor: '#f5c542', title: 'Vencedor certo', text: 'Acerte quem venceu, mesmo sem acertar o placar.' },
  { pts: '5 pts',  ptsColor: '#f5c542', title: 'Empate certo',   text: 'Acerte que o jogo terminou empatado.' },
  { pts: '0 pts',  ptsColor: '#9ca3af', title: 'Sem acerto',     text: 'Caso o palpite não bata com o resultado.' },
]

const groupTags = [
  'Grupos públicos e privados',
  'Convite por @username',
  'Ranking exclusivo do grupo',
  'Vagas expansíveis',
  'Solicitação de entrada',
]

const selosEarn = [
  { value: 'Diário',   label: 'Login diário',      desc: 'Faça login todos os dias e acumule selos de forma consistente.' },
  { value: 'Perfeito', label: 'Palpite perfeito',  desc: 'Acerte todos os palpites de uma rodada e ganhe um bônus especial.' },
  { value: 'Missões',  label: 'Eventos especiais', desc: 'Recompensas configuradas pelo administrador para eventos da Copa.' },
]

const selosUse = [
  'Criar um grupo — 100 selos',
  'Expandir vagas +5 — 50 selos',
  'Expandir vagas +10 — 90 selos',
  'Consultor IA por jogo — 20 selos',
]

const aiTags = [
  'Histórico de confrontos',
  'Probabilidades de resultado',
  'Placar sugerido pela IA',
  'Dados reais da Copa',
]

const rankingFeatures = [
  'Posição e nome do participante',
  'Total de pontos acumulados',
  'Palpites enviados',
  'Placares exatos acertados',
  'Vencedores e empates certos',
]
</script>

<style scoped>
/* ---- Scroll reveal ---- */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .65s ease, transform .65s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ---- Hero ---- */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-parallax-stadium {
  position: absolute;
  inset: -20% 0;
  z-index: 0;
  will-change: transform;
}
.hero-parallax-stadium img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: .13;
  display: block;
}

.hero-parallax-bg {
  position: absolute;
  inset: -20% 0;
  background: linear-gradient(160deg, #0d3d1f 0%, #145c27 40%, #1f7a33 70%, #2e9e47 100%);
  will-change: transform;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 80px 0;
}

.hero-logo {
  height: clamp(80px, 22vw, 160px);
  width: auto;
  filter: drop-shadow(0 4px 24px rgba(0,0,0,.35));
}

.hero-title {
  font-size: clamp(1.7rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -.01em;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: rgba(255,255,255,.8);
  max-width: 560px;
  line-height: 1.7;
}

.hero-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2px;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 16px;
  padding: 10px 20px;
  backdrop-filter: blur(8px);
  min-width: 120px;
}
.hero-pill-value {
  color: #f5c542;
  font-weight: 800;
  font-size: 1rem;
}
.hero-pill-label {
  color: rgba(255,255,255,.85);
  font-size: .78rem;
  font-weight: 500;
}

/* ---- Section bases ---- */
.section-light { background: #fafafa; }
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
.section-cta   { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }

.section-label {
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1f7a33;
}

.section-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.section-subtitle {
  max-width: 560px;
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.7;
}

/* ---- Steps ---- */
.step-card {
  border-radius: 16px;
  transition: background .2s;
}
.step-card:hover { background: rgba(31,122,51,.04); }

.step-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

/* ---- Scoring ---- */
.scoring-card {
  background: #fff;
  border: 1px solid #e5e7eb;
}
.scoring-pts {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -.02em;
}

/* ---- Feature preview images ---- */
.feature-preview-img {
  width: 90%;
  max-width: 560px;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,.12);
  display: block;
  margin: 0 auto;
}

/* ---- Feature tags (light sections) ---- */
.feature-tag {
  display: inline-block;
  background: rgba(31,122,51,.08);
  border: 1px solid rgba(31,122,51,.2);
  border-radius: 999px;
  padding: 5px 16px;
  font-size: .82rem;
  font-weight: 600;
  color: #1f7a33;
}

/* ---- Grupos ---- */
/* (uses .feature-preview-img and .feature-tag) */

/* ---- Selos ---- */
.selos-earn-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  transition: background .2s;
}
.selos-earn-card:hover { background: rgba(255,255,255,.09); }

.selos-earn-value {
  font-size: 1.6rem;
  font-weight: 900;
  color: #f5c542;
  letter-spacing: -.01em;
  line-height: 1;
}

.selos-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
  margin: 0 auto 40px;
  max-width: 480px;
}

.selos-use-tag {
  display: inline-block;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 999px;
  padding: 6px 18px;
  font-size: .82rem;
  font-weight: 600;
  color: rgba(255,255,255,.85);
}

/* ---- IA ---- */
.ai-cost-note {
  display: inline-block;
  background: rgba(31,122,51,.1);
  border-left: 3px solid #f5c542;
  border-radius: 0 8px 8px 0;
  padding: 10px 16px;
  font-size: .88rem;
  color: #374151;
  font-weight: 500;
}

/* ---- Ranking ---- */
.ranking-features {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ranking-features li {
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: .95rem;
  color: rgba(255,255,255,.8);
  border-bottom: 1px solid rgba(255,255,255,.08);
  line-height: 1.6;
}
.ranking-features li::before {
  content: '';
  display: inline-block;
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f5c542;
  margin-right: 12px;
}

/* ---- CTA ---- */
.cta-title {
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,.7);
  max-width: 520px;
  line-height: 1.7;
}

/* ---- Gap utility ---- */
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
