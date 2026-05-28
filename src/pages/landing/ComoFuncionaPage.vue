<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Simples e rápido</div>
        <h1 class="page-title mb-4">Como funciona</h1>
        <p class="page-subtitle mx-auto">
          Participar do Bolão Copa 26 é fácil. Veja os quatro passos para começar.
        </p>
      </v-container>
    </section>

    <!-- Steps -->
    <section class="section-light py-16">
      <v-container>
        <v-row justify="center">
          <v-col
            v-for="(step, i) in steps"
            :key="i"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="step-card text-center pa-6">
              <div class="step-number mx-auto mb-5">{{ i + 1 }}</div>
              <div class="text-subtitle-1 font-weight-bold mb-2">{{ step.title }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.7">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Pronto para começar?</h2>
        <div class="d-flex flex-wrap justify-center gap-3">
          <v-btn :to="{ name: 'Register' }" color="#f5c542" size="large" class="font-weight-bold text-black px-10" elevation="0" rounded="lg">
            Criar conta grátis
          </v-btn>
          <v-btn :to="{ name: 'Login' }" variant="outlined" size="large" class="font-weight-bold px-10" style="border-color:rgba(255,255,255,.5);color:#fff" rounded="lg">
            Já tenho conta
          </v-btn>
        </div>
      </v-container>
    </section>
  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const steps = [
  { title: 'Crie sua conta',         text: 'Cadastre-se de forma simples para participar do bolão.' },
  { title: 'Veja os jogos liberados', text: 'Os palpites ficam disponíveis 24h antes de cada partida.' },
  { title: 'Envie seu placar',        text: 'Escolha o resultado que acredita para cada jogo.' },
  { title: 'Suba no ranking',         text: 'Ganhe pontos pelos acertos e acompanhe sua posição.' },
]
</script>

<style scoped>
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
.section-light { background: #fafafa; }
.section-cta   { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
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
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-3 { gap: 12px; }
</style>
