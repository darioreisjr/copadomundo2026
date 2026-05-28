<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Regras do jogo</div>
        <h1 class="page-title mb-4">Pontuação</h1>
        <p class="page-subtitle mx-auto">
          Quanto mais preciso o seu palpite, mais pontos você ganha.
        </p>
      </v-container>
    </section>

    <!-- Cards de pontuação -->
    <section class="section-light py-16">
      <v-container>
        <v-row justify="center">
          <v-col
            v-for="rule in scoringRules"
            :key="rule.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="scoring-card pa-8 text-center" rounded="xl" elevation="0" height="100%">
              <div class="scoring-pts mb-3" :style="{ color: rule.ptsColor }">{{ rule.pts }}</div>
              <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#111827">{{ rule.title }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.7">{{ rule.text }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Nota extra -->
        <v-row justify="center" class="mt-12">
          <v-col cols="12" md="7" class="text-center">
            <div class="extra-note">
              <v-icon color="#f5c542" class="mr-2">mdi-information-outline</v-icon>
              Jogos da fase eliminatória têm um bônus extra de pontos pelo maior risco do palpite.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Comece a acumular pontos agora</h2>
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

const scoringRules = [
  { pts: '10 pts', ptsColor: '#2e9e47', title: 'Placar exato',   text: 'Acerte exatamente o resultado da partida.' },
  { pts: '5 pts',  ptsColor: '#f5c542', title: 'Vencedor certo', text: 'Acerte quem venceu, mesmo sem acertar o placar.' },
  { pts: '5 pts',  ptsColor: '#f5c542', title: 'Empate certo',   text: 'Acerte que o jogo terminou empatado.' },
  { pts: '0 pts',  ptsColor: '#9ca3af', title: 'Sem acerto',     text: 'Caso o palpite não bata com o resultado.' },
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
.extra-note {
  display: inline-flex;
  align-items: center;
  background: rgba(31,122,51,.08);
  border: 1px solid rgba(31,122,51,.2);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: .9rem;
  color: #374151;
  font-weight: 500;
}
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-3 { gap: 12px; }
</style>
