<template>
  <LandingLayout>

    <!-- 1. Hero -->
    <section class="page-hero py-16 text-center">
      <v-container>
        <div class="section-label mb-2">Tecnologia</div>
        <h1 class="page-title mb-4">A tecnologia por trás do bolão</h1>
        <p class="page-subtitle mx-auto">
          Uma plataforma moderna construída para entregar uma experiência rápida, justa e inteligente.
          Cada ferramenta foi escolhida com um propósito claro.
        </p>
      </v-container>
    </section>

    <!-- 2. Infraestrutura -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Infraestrutura</div>
          <h2 class="content-title">Cada peça no lugar certo</h2>
          <p class="content-subtitle mx-auto mt-3">
            Três tecnologias principais formam a base da plataforma e trabalham juntas para que tudo funcione sem atrito.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="pillar in pillars" :key="pillar.title" cols="12" sm="6" md="4">
            <div class="pillar-card pa-8 text-center h-100">
              <div class="pillar-title mb-3">{{ pillar.title }}</div>
              <p class="text-body-2" style="color:#6b7280;line-height:1.7">{{ pillar.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 3. Consultor IA com Gemini -->
    <section class="section-light pb-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Inteligência artificial</div>
          <h2 class="content-title">Palpite com informação, não com achismo</h2>
          <p class="content-subtitle mx-auto mt-3">
            Antes de registrar seu palpite, você pode pedir ao Gemini uma análise completa do confronto.
            Ele cruza o histórico real de partidas, calcula probabilidades e ainda sugere um placar baseado em dados.
          </p>
        </div>

        <v-row justify="center" class="mb-8">
          <v-col cols="12" md="8">
            <div class="d-flex flex-wrap justify-center gap-2 mb-6">
              <span v-for="tag in aiTags" :key="tag" class="feature-tag">{{ tag }}</span>
            </div>
            <div class="ai-cost-note mx-auto" style="max-width:480px">
              Cada consulta ao Consultor IA custa 20 selos. Use com critério para tirar o máximo de cada análise.
            </div>
          </v-col>
        </v-row>

        <div class="text-center mb-8">
          <div class="section-label-green mb-2">Passo a passo</div>
          <h3 class="content-title" style="font-size:clamp(1.1rem,2.5vw,1.5rem)">Como funciona o Consultor IA</h3>
        </div>
        <v-row justify="center">
          <v-col v-for="(step, i) in aiSteps" :key="i" cols="12" sm="6" md="3">
            <div class="step-card pa-6 h-100">
              <div class="step-card-top">
                <div class="step-number mx-auto mb-4">{{ i + 1 }}</div>
                <div class="step-title font-weight-bold mb-2" style="color:#111827;text-align:center">{{ step.title }}</div>
              </div>
              <div class="d-flex d-sm-none align-center justify-center mb-2" style="gap:10px">
                <span class="step-number-inline">{{ i + 1 }}</span>
                <div class="step-title font-weight-bold" style="color:#111827">{{ step.title }}</div>
              </div>
              <div class="text-body-2 text-center" style="color:#6b7280;line-height:1.7">{{ step.text }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 4. Como os dados chegam até você (dark) -->
    <section class="section-light py-16">
      <v-container>
        <h2 class="text-center mb-2" style="font-size:clamp(1.4rem,3vw,1.9rem);font-weight:700;color:#111827">
          Da Copa para a sua tela em segundos
        </h2>
        <p class="text-center mb-12" style="color:#6b7280;max-width:480px;margin:0 auto 48px">
          Cada tecnologia tem um papel definido para que a informação chegue rápida e correta.
        </p>
        <v-row justify="center">
          <v-col v-for="tech in techStack" :key="tech.name" cols="12" sm="6" md="3">
            <div class="tech-card-light text-center pa-6">
              <div class="text-subtitle-1 font-weight-bold mb-1" style="color:#111827">{{ tech.name }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.6">{{ tech.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 5. Por que essas escolhas -->
    <section class="section-light py-16">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Decisões de produto</div>
          <h2 class="content-title">Por que escolhemos cada ferramenta</h2>
          <p class="content-subtitle mx-auto mt-3">
            Nenhuma escolha foi por moda. Cada tecnologia resolve um problema real da plataforma.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="why in whys" :key="why.title" cols="12" sm="6" md="3">
            <div class="why-card pa-6 text-center h-100">
              <v-icon :icon="why.icon" size="36" color="#1f7a33" class="mb-3 d-none d-sm-inline-flex" />
              <div class="why-title mb-2">{{ why.title }}</div>
              <p class="text-body-2" style="color:#6b7280;line-height:1.6">{{ why.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 6. Segurança e privacidade -->
    <section class="section-light pb-16 section-security">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-label-green mb-2">Privacidade</div>
          <h2 class="content-title">Seus dados ficam protegidos</h2>
          <p class="content-subtitle mx-auto mt-3">
            A plataforma usa os padrões de segurança do Supabase, que roda sobre infraestrutura da AWS.
          </p>
        </div>
        <v-row justify="center">
          <v-col v-for="sec in security" :key="sec.label" cols="12" sm="6" md="4">
            <div class="cost-card-light text-center pa-6">
              <v-icon :icon="sec.icon" size="36" color="#1f7a33" class="mb-3 d-none d-sm-inline-flex" />
              <div class="cost-value-light mb-1">{{ sec.value }}</div>
              <div class="text-subtitle-2 font-weight-bold mb-1" style="color:#111827">{{ sec.label }}</div>
              <div class="text-body-2" style="color:#6b7280;line-height:1.6">{{ sec.desc }}</div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>


  </LandingLayout>
</template>

<script setup>
import LandingLayout from '@/components/LandingLayout.vue'

const pillars = [
  {
    icon: 'mdi-vuejs',
    color: '#42b883',
    title: 'Vue 3 e Vite',
    desc: 'A interface é construída em Vue 3 com Vite como ferramenta de build. O resultado é uma aplicação que carrega rápido e responde imediatamente a cada ação do usuário, sem recarregar a página.',
  },
  {
    icon: 'mdi-database',
    color: '#3ecf8e',
    title: 'Supabase e PostgreSQL',
    desc: 'Todos os dados de palpites, rankings e grupos ficam em um banco PostgreSQL gerenciado pelo Supabase. As atualizações chegam em tempo real, então o placar que você vê é sempre o mais recente.',
  },
  {
    icon: 'mdi-palette',
    color: '#1565c0',
    title: 'Vuetify 3',
    desc: 'A biblioteca de componentes Material Design garante que a interface funcione igual no celular, no tablet e no computador. Botões, cards e formulários seguem um padrão visual consistente em toda a plataforma.',
  },
]

const aiTags = [
  'Histórico real de confrontos',
  'Probabilidade de resultado',
  'Placar sugerido pela IA',
  'Dados verificados da Copa',
  'Resposta em segundos',
]

const aiSteps = [
  {
    icon: 'mdi-eye-outline',
    title: 'Abra a análise',
    text: 'Na tela de palpites, antes de confirmar, clique em "Consultar IA" para iniciar a análise do confronto.',
  },
  {
    icon: 'mdi-database-search',
    title: 'Gemini busca o histórico',
    text: 'O modelo consulta o histórico real de partidas entre as duas seleções em Copas, eliminatórias e amistosos.',
  },
  {
    icon: 'mdi-chart-areaspline',
    title: 'Probabilidades e placar',
    text: 'A IA calcula as chances de vitória de cada lado, o histórico de gols e sugere o placar mais provável.',
  },
  {
    icon: 'mdi-check-decagram',
    title: 'Você decide',
    text: 'Com a análise em mãos, você registra o palpite que achar melhor. A IA informa, a decisão é sempre sua.',
  },
]

const techStack = [
  {
    icon: 'mdi-vuejs',
    color: '#42b883',
    name: 'Vue 3',
    desc: 'Framework que atualiza só o que mudou. A tela reage rápido, sem recarregar a página inteira.',
  },
  {
    icon: 'mdi-database',
    color: '#3ecf8e',
    name: 'Supabase',
    desc: 'Banco de dados PostgreSQL com atualizações em tempo real. Ranking e resultados chegam ao instante.',
  },
  {
    icon: 'mdi-robot-excited',
    color: '#4285f4',
    name: 'Gemini AI',
    desc: 'Modelo de linguagem do Google. Analisa estatísticas e entrega uma leitura clara de cada confronto.',
  },
  {
    icon: 'mdi-palette',
    color: '#1565c0',
    name: 'Vuetify 3',
    desc: 'Biblioteca de componentes visuais. Funciona igual no celular, no tablet e no computador.',
  },
]

const whys = [
  {
    icon: 'mdi-source-branch',
    title: 'Código aberto sempre que possível',
    desc: 'Vue, Vuetify e Supabase são projetos de código aberto com comunidades ativas. Isso garante suporte contínuo e ausência de dependência de um único fornecedor.',
  },
  {
    icon: 'mdi-cloud-check',
    title: 'Sem servidor próprio para gerenciar',
    desc: 'O Supabase cuida da infraestrutura de banco de dados e autenticação. A equipe foca no produto, não em manutenção de servidores.',
  },
  {
    icon: 'mdi-shield-check',
    title: 'IA com dados verificados',
    desc: 'O Gemini recebe dados reais do histórico da Copa antes de responder. As análises são baseadas em fatos, não em suposições do modelo.',
  },
  {
    icon: 'mdi-cellphone-check',
    title: 'Funciona bem em qualquer conexão',
    desc: 'A arquitetura foi pensada para carregar rápido mesmo em redes móveis lentas. Você não perde um palpite por causa de lentidão.',
  },
]

const security = [
  {
    icon: 'mdi-lock-check',
    value: 'Autenticação segura',
    label: 'Sem senha armazenada localmente',
    desc: 'O login é gerenciado pelo Supabase Auth. Nenhuma senha fica salva no navegador ou em servidores da aplicação.',
  },
  {
    icon: 'mdi-shield-lock-outline',
    value: 'HTTPS sempre',
    label: 'Comunicação criptografada',
    desc: 'Toda troca de dados entre o seu dispositivo e os servidores acontece por conexão criptografada, sem exceção.',
  },
  {
    icon: 'mdi-eye-off-outline',
    value: 'Acesso restrito',
    label: 'Dados de palpite só seus',
    desc: 'Suas apostas e histórico são visíveis apenas para você e para os grupos dos quais você faz parte. Nada é público sem sua permissão.',
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
  .section-security { padding-top: 0 !important; }
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
  max-width: 560px;
  line-height: 1.7;
}

/* Sections */
.section-light { background: #fafafa; }
.section-dark  { background: linear-gradient(160deg, #0d3d1f 0%, #145c27 50%, #1f7a33 100%); }
.section-cta   { background: linear-gradient(160deg, #0a2e17 0%, #0d3d1f 100%); }

/* Typography */
.content-title {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}
.content-subtitle {
  font-size: 1rem;
  color: #6b7280;
  max-width: 520px;
  line-height: 1.7;
}

/* Pillar cards */
.pillar-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.pillar-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.pillar-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

/* Feature tags */
.feature-tag {
  display: inline-block;
  background: transparent;
  border: none;
  padding: 5px 16px;
  font-size: .82rem;
  font-weight: 600;
  color: #1f7a33;
}

/* AI cost note */
.ai-cost-note {
  display: block;
  background: transparent;
  border: none;
  padding: 0;
  font-size: .88rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.6;
}
.ai-cost-note::before {
  content: '*';
  color: #1f7a33;
  font-weight: 900;
  font-size: 1.1rem;
  margin-right: 6px;
}

/* Step cards */
.step-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.step-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.step-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
@media (max-width: 599px) {
  .step-card-top { display: none !important; }
}
.step-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: 1.3rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-number-inline {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f7a33, #2e9e47);
  color: #fff;
  font-size: .9rem;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-title {
  font-size: .97rem;
}

/* Tech cards (light section) */
.tech-card-light {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow .2s;
}
.tech-card-light:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }

/* Why cards */
.why-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow .2s;
}
.why-card:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.why-title {
  font-size: .97rem;
  font-weight: 700;
  color: #111827;
}

/* Security / cost cards */
.cost-card-light {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow .2s;
}
.cost-card-light:hover { box-shadow: 0 4px 20px rgba(31,122,51,.1); }
.cost-value-light {
  font-size: 1.1rem;
  font-weight: 900;
  color: #1f7a33;
  line-height: 1;
}

/* CTA */
.cta-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
  color: #fff;
}
.cta-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,.65);
  max-width: 400px;
  line-height: 1.6;
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
