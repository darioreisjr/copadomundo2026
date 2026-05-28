<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Economia do bolão</div>
        <h1 class="page-title mb-4">Selos</h1>
        <p class="page-subtitle mx-auto">
          Selos são a moeda do bolão. Acumule participando e use para potencializar sua experiência.
        </p>
      </v-container>
    </section>

    <!-- Como ganhar -->
    <section class="section-light py-16">
      <v-container>
        <h2 class="content-title text-center mb-2">Como ganhar selos</h2>
        <p class="content-subtitle text-center mb-12 mx-auto">
          Existem várias formas de acumular selos ao longo da Copa.
        </p>
        <v-row justify="center">
          <v-col
            v-for="earn in selosEarn"
            :key="earn.label"
            cols="12"
            sm="4"
          >
            <div class="earn-card text-center pa-8">
              <div class="earn-value mb-3">{{ earn.value }}</div>
              <div class="text-subtitle-1 font-weight-bold mb-2" style="color:#111827">{{ earn.label }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.6">{{ earn.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Como usar -->
    <section class="section-dark py-16">
      <v-container>
        <h2 class="text-center text-white mb-2" style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700">Como usar seus selos</h2>
        <p class="text-center mb-12" style="color:rgba(255,255,255,.65);max-width:480px;margin:0 auto 48px">
          Troque selos por vantagens dentro do bolão.
        </p>
        <v-row justify="center">
          <v-col
            v-for="item in selosUseDetailed"
            :key="item.label"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="use-card text-center pa-6">
              <v-icon :icon="item.icon" size="36" color="#f5c542" class="mb-3" />
              <div class="use-cost mb-2">{{ item.cost }}</div>
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">{{ item.label }}</div>
              <div class="text-body-2" style="color:rgba(255,255,255,.55);line-height:1.6">{{ item.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Comece a acumular selos hoje</h2>
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

const selosEarn = [
  { value: 'Diário',   label: 'Login diário',      desc: 'Faça login todos os dias e acumule selos de forma consistente.' },
  { value: 'Perfeito', label: 'Palpite perfeito',  desc: 'Acerte todos os palpites de uma rodada e ganhe um bônus especial.' },
  { value: 'Missões',  label: 'Eventos especiais', desc: 'Recompensas configuradas pelo administrador para eventos da Copa.' },
]

const selosUseDetailed = [
  { icon: 'mdi-account-group',          cost: '100 selos', label: 'Criar grupo',        desc: 'Crie seu próprio grupo de bolão.' },
  { icon: 'mdi-account-multiple-plus',  cost: '50 selos',  label: 'Expandir +5 vagas',  desc: 'Adicione 5 vagas ao seu grupo.' },
  { icon: 'mdi-account-group-outline',  cost: '90 selos',  label: 'Expandir +10 vagas', desc: 'Adicione 10 vagas ao seu grupo.' },
  { icon: 'mdi-robot',                  cost: '20 selos',  label: 'Consultor IA',        desc: 'Consulte o Gemini antes de palpitar.' },
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
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
.section-cta   { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 100%); }
.content-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #111827;
}
.content-subtitle {
  max-width: 480px;
  color: #6b7280;
  line-height: 1.7;
}
.earn-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow .2s;
}
.earn-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.earn-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1f7a33;
  line-height: 1;
}
.use-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  transition: background .2s;
}
.use-card:hover { background: rgba(255,255,255,.09); }
.use-cost {
  font-size: 1.4rem;
  font-weight: 900;
  color: #f5c542;
  line-height: 1;
}
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-3 { gap: 12px; }
</style>
