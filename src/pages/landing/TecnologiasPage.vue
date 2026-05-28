<template>
  <LandingLayout>
    <!-- Mini hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Tecnologia</div>
        <h1 class="page-title mb-4">Tecnologias</h1>
        <p class="page-subtitle mx-auto">
          O Bolão Copa 26 usa o Google Gemini para te ajudar a fazer palpites mais inteligentes.
        </p>
      </v-container>
    </section>

    <!-- Consultor IA -->
    <section class="section-light py-16">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="5" class="mb-10 mb-md-0 pr-md-10">
            <div class="section-label-green mb-2">Consultor IA com Gemini</div>
            <h2 class="content-title mb-5">Analise antes de palpitar</h2>
            <p class="text-body-1 mb-6" style="color:#6b7280;line-height:1.7">
              Antes de enviar seu palpite, consulte o histórico real de confrontos entre as seleções.
              O Google Gemini processa os dados da Copa e entrega probabilidades, histórico de vitórias
              e um placar sugerido baseado em estatísticas.
            </p>
            <div class="d-flex flex-wrap gap-2 mb-6">
              <span v-for="tag in aiTags" :key="tag" class="feature-tag">{{ tag }}</span>
            </div>
            <div class="ai-cost-note">
              Cada consulta custa 20 selos — use com sabedoria.
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <img
              src="@/image/geminiPass.png"
              alt="Consultor IA Gemini"
              class="feature-preview-img"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stack técnico -->
    <section class="section-dark py-16">
      <v-container>
        <h2 class="text-center text-white mb-2" style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700">Stack do projeto</h2>
        <p class="text-center mb-12" style="color:rgba(255,255,255,.65);max-width:480px;margin:0 auto 48px">
          Construído com tecnologias modernas e confiáveis.
        </p>
        <v-row justify="center">
          <v-col
            v-for="tech in techStack"
            :key="tech.name"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="tech-card text-center pa-6">
              <v-icon :icon="tech.icon" size="40" :color="tech.color" class="mb-3" />
              <div class="text-subtitle-1 font-weight-bold text-white mb-1">{{ tech.name }}</div>
              <div class="text-body-2" style="color:rgba(255,255,255,.55);line-height:1.6">{{ tech.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section class="section-cta py-12 text-center">
      <v-container>
        <h2 class="cta-title mb-6">Experimente o Consultor IA</h2>
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

const aiTags = [
  'Histórico de confrontos',
  'Probabilidades de resultado',
  'Placar sugerido pela IA',
  'Dados reais da Copa',
]

const techStack = [
  { icon: 'mdi-vuejs',         color: '#42b883', name: 'Vue 3',      desc: 'Framework progressivo para interfaces reativas.' },
  { icon: 'mdi-database',      color: '#3ecf8e', name: 'Supabase',   desc: 'Backend open-source com PostgreSQL em tempo real.' },
  { icon: 'mdi-robot-excited', color: '#4285f4', name: 'Gemini AI',  desc: 'IA do Google para análise de partidas e palpites.' },
  { icon: 'mdi-palette',       color: '#1565c0', name: 'Vuetify 3',  desc: 'Componentes Material Design para Vue.' },
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
.tech-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05);
  transition: background .2s;
}
.tech-card:hover { background: rgba(255,255,255,.09); }
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
