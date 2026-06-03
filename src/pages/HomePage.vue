<template>
  <AppLayout fluid is-public>
    <LandingNavbar />

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
              <div class="d-flex flex-wrap justify-center gap-3 mb-12 hero-btns">
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
              <div class="d-flex flex-wrap justify-center gap-3 hero-pills-grid">
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

    <LandingFooter />

  </AppLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import LandingNavbar from '@/components/LandingNavbar.vue'
import LandingFooter from '@/components/LandingFooter.vue'

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


/* ---- Gap utility ---- */
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

/* ---- Mobile hero adjustments ---- */
@media (max-width: 599px) {
  .hero-btns {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-btns .v-btn {
    width: 100% !important;
  }

  .hero-pills-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .hero-pills-grid .hero-pill {
    min-width: unset;
    width: 100%;
  }
}
</style>
