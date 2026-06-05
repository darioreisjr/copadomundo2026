<template>
  <LandingLayout>

    <!-- Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-4">Economia do bolão</div>
        <h1 class="page-title mb-4">Selos, a moeda do seu bolão</h1>
        <p class="page-subtitle mx-auto">
          Selos são pontos que você ganha jogando e usa para criar grupos, chamar amigos e consultar a IA.
          <strong style="color:#f5c542">Grátis. Sem compra.</strong>
        </p>
      </v-container>
    </section>

    <!-- Como ganhar -->
    <section class="section-light py-16">
      <v-container>
        <h2 class="content-title text-center mb-2">Como ganhar selos</h2>
        <p class="content-subtitle text-center mb-12 mx-auto">
          Cada palpite certo e cada login diário te aproxima de novas vantagens.
        </p>
        <v-row justify="center">
          <v-col
            v-for="earn in selosEarn"
            :key="earn.label"
            cols="12"
            sm="6"
            md="4"
          >
            <div class="earn-card text-center pa-8">
              <div class="earn-value mb-1">{{ earn.value }}</div>
              <div class="earn-label mb-2">{{ earn.label }}</div>
              <div class="earn-desc">{{ earn.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Banner: Quanto rende jogar -->
    <section class="section-banner py-10">
      <v-container>
        <div class="banner-inner pa-8 text-center">
          <div class="banner-title mb-1">Quanto rende jogar?</div>
          <p class="banner-text mb-0">
            Jogando todos os dias e acertando metade dos palpites, você acumula mais de
            <strong>200 selos em uma semana</strong>, suficiente para criar seu grupo
            e ainda ter crédito para a IA.
          </p>
        </div>
      </v-container>
    </section>

    <!-- Como usar -->
    <section class="section-light section-use py-16">
      <v-container>
        <h2 class="content-title text-center mb-2">Como usar seus selos</h2>
        <p class="content-subtitle text-center mb-12 mx-auto">
          Troque selos por vantagens reais dentro do bolão.
        </p>
        <v-row justify="center">
          <v-col
            v-for="item in selosUse"
            :key="item.label"
            cols="12"
            sm="6"
            md="3"
          >
            <div class="use-card text-center pa-6">
              <div class="use-cost mb-2">{{ item.cost }}</div>
              <div class="use-label mb-1">{{ item.label }}</div>
              <div class="use-desc">{{ item.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- FAQ -->
    <section class="section-light section-faq py-16">
      <v-container>
        <h2 class="content-title text-center mb-2">Dúvidas frequentes</h2>
        <p class="content-subtitle text-center mb-10 mx-auto">
          Tudo que você precisa saber antes de começar.
        </p>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-expansion-panels variant="accordion" class="faq-panels">
              <v-expansion-panel
                v-for="faq in faqs"
                :key="faq.q"
                :title="faq.q"
                :text="faq.a"
              />
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </section>


  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const selosEarn = [
  {
    icon: 'mdi-login',
    iconColor: '#1f7a33',
    value: '+10 selos',
    label: 'Login diário',
    desc: 'Abra o app uma vez por dia e já ganhe selos. Sem sequência obrigatória.',
  },
  {
    icon: 'mdi-check-circle-outline',
    iconColor: '#2563eb',
    value: '+20 selos',
    label: 'Palpite certo',
    desc: 'Acertou o vencedor ou o empate? Selos garantidos por cada partida.',
  },
  {
    icon: 'mdi-trophy-outline',
    iconColor: '#f59e0b',
    value: '+50 selos',
    label: 'Placar exato',
    desc: 'Acertou o placar exato? Bônus especial, o maior prêmio de palpite.',
  },
  {
    icon: 'mdi-tournament',
    iconColor: '#dc2626',
    value: '+30 selos',
    label: 'Bônus mata-mata',
    desc: 'Palpites corretos nas fases eliminatórias valem ainda mais.',
  },
  {
    icon: 'mdi-star-shooting-outline',
    iconColor: '#7c3aed',
    value: 'Variável',
    label: 'Missões especiais',
    desc: 'Recompensas extras criadas em datas especiais da Copa do Mundo.',
  },
]

const selosUse = [
  {
    icon: 'mdi-account-group',
    cost: '100 selos',
    label: 'Criar grupo',
    desc: 'Monte seu bolão privado e convide até 10 amigos. Você define as regras.',
  },
  {
    icon: 'mdi-account-multiple-plus',
    cost: '50 selos',
    label: '+5 vagas',
    desc: 'Já tem um grupo? Expanda para receber mais 5 participantes.',
  },
  {
    icon: 'mdi-account-group-outline',
    cost: '90 selos',
    label: '+10 vagas',
    desc: 'Expanda de uma vez e economize, sai mais barato que duas expansões de 5.',
  },
  {
    icon: 'mdi-robot',
    cost: '20 selos',
    label: 'Consultor IA',
    desc: 'Antes de palpitar, peça ao Gemini uma análise do jogo.',
  },
]

const faqs = [
  {
    q: 'Os selos expiram?',
    a: 'Não. Seus selos ficam na conta enquanto ela estiver ativa. Acumule sem pressa.',
  },
  {
    q: 'Posso comprar selos com dinheiro real?',
    a: 'Não. Selos só são ganhos jogando. Isso garante que a vantagem vem do mérito, não do bolso.',
  },
  {
    q: 'Posso transferir selos para outro jogador?',
    a: 'Não. Selos são pessoais e intransferíveis. Cada jogador acumula os seus.',
  },
  {
    q: 'Tem limite de selos que posso ganhar por dia?',
    a: 'O login diário pode ser feito uma vez por dia. Já os palpites geram selos a cada partida acertada, sem limite fixo, depende de quantos jogos acontecem.',
  },
]
</script>

<style scoped>
/* Hero */
.page-hero {
  background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%);
}
@media (max-width: 599px) {
  .page-hero { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-banner { padding-top: 0 !important; padding-bottom: 0 !important; }
  .section-use { padding-top: 0 !important; }
  .section-faq { padding-top: 0 !important; }
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

/* Sections */
.section-light { background: #fff; }
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }

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

/* Earn cards */
.earn-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  height: 100%;
  transition: box-shadow .2s, transform .2s;
}
.earn-card:hover {
  box-shadow: 0 6px 24px rgba(31,122,51,.12);
  transform: translateY(-2px);
}
.earn-value {
  font-size: 1.75rem;
  font-weight: 900;
  color: #1f7a33;
  line-height: 1;
}
.earn-label {
  font-size: .95rem;
  font-weight: 700;
  color: #111827;
}
.earn-desc {
  font-size: .875rem;
  color: #6b7280;
  line-height: 1.6;
}

/* Banner */
.section-banner { background: #fff; }
.banner-inner {
  background: #fff;
  text-align: center;
}
.banner-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}
.banner-text {
  font-size: .95rem;
  color: #374151;
  line-height: 1.65;
  max-width: 620px;
  margin: 0 auto;
}

/* Use cards */
.use-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  height: 100%;
  transition: box-shadow .2s, transform .2s;
}
.use-card:hover {
  box-shadow: 0 6px 24px rgba(31,122,51,.12);
  transform: translateY(-2px);
}
.use-cost {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1f7a33;
  line-height: 1;
}
.use-label {
  font-size: .95rem;
  font-weight: 700;
  color: #111827;
}
.use-desc {
  font-size: .875rem;
  color: #6b7280;
  line-height: 1.6;
}

/* FAQ */
.faq-panels {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.07);
}

.gap-3 { gap: 12px; }
</style>
