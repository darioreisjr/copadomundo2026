<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Competição real</div>
        <h1 class="page-title mb-4">Ranking</h1>
        <p class="page-subtitle mx-auto">
          Acompanhe em tempo real sua posição no ranking. Cada palpite certo faz a diferença.
        </p>
      </v-container>
    </section>

    <!-- Conteúdo ranking -->
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
            <h2 class="content-title mb-5">Ranking geral</h2>
            <ul class="ranking-features">
              <li v-for="f in rankingFeatures" :key="f">{{ f }}</li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Tipos de ranking -->
    <section class="section-dark py-16">
      <v-container>
        <h2 class="text-center text-white mb-2" style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700">Tipos de ranking</h2>
        <p class="text-center mb-12" style="color:rgba(255,255,255,.65);max-width:480px;margin:0 auto 48px">
          Compete tanto no ranking global quanto dentro do seu grupo.
        </p>
        <v-row justify="center">
          <v-col
            v-for="rank in rankingTypes"
            :key="rank.title"
            cols="12"
            sm="6"
            md="4"
          >
            <div class="rank-card text-center pa-8">
              <v-icon :icon="rank.icon" size="44" color="#f5c542" class="mb-4" />
              <div class="text-subtitle-1 font-weight-bold text-white mb-2">{{ rank.title }}</div>
              <div class="text-body-2" style="color:rgba(255,255,255,.6);line-height:1.6">{{ rank.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Dispute a liderança do ranking</h2>
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

const rankingFeatures = [
  'Posição e nome do participante',
  'Total de pontos acumulados',
  'Palpites enviados',
  'Placares exatos acertados',
  'Vencedores e empates certos',
]

const rankingTypes = [
  { icon: 'mdi-earth',         title: 'Ranking Global',  desc: 'Todos os participantes do bolão disputam a liderança geral.' },
  { icon: 'mdi-account-group', title: 'Ranking do Grupo', desc: 'Cada grupo tem seu próprio ranking exclusivo entre membros.' },
  { icon: 'mdi-update',        title: 'Tempo real',       desc: 'Atualizado automaticamente após cada resultado confirmado.' },
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
  max-width: 520px;
  line-height: 1.7;
}
.content-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.section-light { background: #fafafa; }
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
.section-cta   { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 100%); }
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
.rank-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  transition: background .2s;
}
.rank-card:hover { background: rgba(255,255,255,.09); }
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-3 { gap: 12px; }
</style>
