<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Social</div>
        <h1 class="page-title mb-4">Disputa</h1>
        <p class="page-subtitle mx-auto">
          Crie seu próprio grupo ou entre em um público e dispute com quem você conhece.
        </p>
      </v-container>
    </section>

    <!-- Conteúdo grupos -->
    <section class="section-light py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="mb-10 mb-md-0">
            <img
              src="@/image/interactiveSportsPanel.png"
              alt="Grupos do Bolão Copa 26"
              class="feature-preview-img"
            />
          </v-col>
          <v-col cols="12" md="5" class="pl-md-10">
            <div class="section-label-green mb-2">Como funciona a disputa</div>
            <h2 class="content-title mb-5">Dispute com quem você conhece</h2>
            <p class="text-body-1 mb-6" style="color:#6b7280;line-height:1.7">
              Crie seu próprio grupo ou entre em um público. Cada grupo tem seu ranking interno,
              então você pode competir de perto com amigos, família ou colegas de trabalho.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="tag in groupTags" :key="tag" class="feature-tag">{{ tag }}</span>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Detalhe de custos -->
    <section class="section-dark py-16">
      <v-container>
        <h2 class="text-center text-white mb-2" style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700">Custos e limites</h2>
        <p class="text-center mb-10" style="color:rgba(255,255,255,.65);max-width:480px;margin:0 auto 40px">
          Participar é gratuito dentro dos limites. Selos permitem expandir.
        </p>
        <v-row justify="center">
          <v-col
            v-for="cost in costs"
            :key="cost.label"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="cost-card text-center pa-6">
              <v-icon :icon="cost.icon" size="36" color="#f5c542" class="mb-3" />
              <div class="cost-value mb-1">{{ cost.value }}</div>
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">{{ cost.label }}</div>
              <div class="text-body-2" style="color:rgba(255,255,255,.55);line-height:1.6">{{ cost.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Entre na disputa agora</h2>
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

const groupTags = [
  'Grupos públicos e privados',
  'Convite por @username',
  'Ranking exclusivo do grupo',
  'Vagas expansíveis',
  'Solicitação de entrada',
]

const costs = [
  { icon: 'mdi-account-multiple-check', value: 'Grátis',    label: 'Até 2 grupos',        desc: 'Participe de até 2 grupos sem custo algum.' },
  { icon: 'mdi-account-group-outline',  value: '30 selos',  label: 'Grupos adicionais',   desc: 'Cada grupo além do 2º custa 30 selos de entrada.' },
  { icon: 'mdi-account-group',          value: '100 selos', label: 'Criar um grupo',       desc: 'Crie seu próprio grupo e convide quem quiser.' },
  { icon: 'mdi-account-multiple-plus',  value: '+50 selos', label: 'Expandir +5 vagas',    desc: 'Aumente a capacidade do seu grupo conforme precisar.' },
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
.cost-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  transition: background .2s;
}
.cost-card:hover { background: rgba(255,255,255,.09); }
.cost-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #f5c542;
  line-height: 1;
}
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
