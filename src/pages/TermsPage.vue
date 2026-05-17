<template>
  <AppLayout is-public>
    <v-container style="max-width:860px" class="py-8">

      <!-- Cabeçalho -->
      <div class="text-center mb-8">
        <v-icon icon="mdi-shield-check" color="green-darken-3" size="48" class="mb-3" />
        <div class="text-h4 font-weight-bold mb-2">Termos de Uso e Privacidade</div>
        <div class="text-body-2 text-grey-darken-1">Bolão da Copa do Mundo 2026</div>
        <v-chip color="green-darken-3" variant="tonal" size="small" class="mt-3">
          Vigência a partir de 17 de maio de 2026
        </v-chip>
      </div>

      <!-- Aviso resumido -->
      <v-alert
        type="info"
        variant="tonal"
        color="green-darken-3"
        icon="mdi-information"
        class="mb-8"
        rounded="lg"
      >
        Ao criar uma conta e participar do Bolão da Copa, você concorda com todos os termos descritos nesta página. Leia com atenção antes de se cadastrar.
      </v-alert>

      <!-- Seção 1 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-soccer" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">1. Sobre o Bolão da Copa</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          O <strong>Bolão da Copa do Mundo 2026</strong> é uma plataforma digital de entretenimento criada para que amigos, familiares e colegas possam competir entre si prevendo os resultados dos jogos da Copa do Mundo FIFA 2026.
        </p>
        <p class="text-body-2 text-grey-darken-2 mb-3">
          A participação é <strong>completamente gratuita</strong> e o serviço tem caráter recreativo. Não há apostas financeiras, prêmios em dinheiro ou qualquer vínculo com empresas de jogos ou apostas esportivas regulamentadas.
        </p>
        <p class="text-body-2 text-grey-darken-2">
          O serviço é disponibilizado sem garantia de disponibilidade contínua e pode ser descontinuado ou alterado a qualquer momento.
        </p>
      </section>

      <!-- Seção 2 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-account-circle" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">2. Cadastro e Conta</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Para participar do bolão, é necessário criar uma conta com nome, endereço de e-mail válido e senha. Você é responsável por manter suas credenciais em sigilo e por todas as atividades realizadas com sua conta.
        </p>
        <v-list density="compact" class="mb-3 pa-0 bg-transparent">
          <v-list-item prepend-icon="mdi-check-circle" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">As informações fornecidas devem ser verdadeiras e atualizadas.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">É proibido criar contas em nome de terceiros sem autorização.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">O serviço é destinado a pessoas com 18 anos ou mais.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check-circle" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Contas suspeitas de uso indevido podem ser suspensas sem aviso prévio.</v-list-item-title>
          </v-list-item>
        </v-list>
        <p class="text-body-2 text-grey-darken-2">
          Ao detectar acesso não autorizado à sua conta, entre em contato imediatamente pelo e-mail de suporte.
        </p>
      </section>

      <!-- Seção 3 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-trophy" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">3. Regras do Bolão</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-4">
          A participação no bolão segue as seguintes regras de pontuação e conduta:
        </p>
        <v-row class="mb-4">
          <v-col cols="12" sm="6">
            <v-card variant="tonal" color="green-darken-3" rounded="lg" class="pa-4 h-100">
              <div class="d-flex align-center mb-2" style="gap:8px">
                <v-icon icon="mdi-star-circle" color="green-darken-3" />
                <strong class="text-body-2">Resultado exato</strong>
              </div>
              <div class="text-h5 font-weight-bold text-green-darken-3">+10 pts</div>
              <div class="text-caption text-grey-darken-1">Acertou o placar exato do jogo</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card variant="tonal" color="blue-darken-1" rounded="lg" class="pa-4 h-100">
              <div class="d-flex align-center mb-2" style="gap:8px">
                <v-icon icon="mdi-shield-half-full" color="blue-darken-1" />
                <strong class="text-body-2">Vencedor correto</strong>
              </div>
              <div class="text-h5 font-weight-bold text-blue-darken-1">+5 pts</div>
              <div class="text-caption text-grey-darken-1">Acertou quem venceu, mas não o placar</div>
            </v-card>
          </v-col>
        </v-row>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item prepend-icon="mdi-clock-outline" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Apostas devem ser registradas antes do início do jogo; após o apito, o campo é bloqueado.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-account-cancel" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">É estritamente proibido tentar manipular o ranking ou as apostas de outros usuários.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-pencil-lock" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Os resultados dos jogos são registrados pela administração com base em fontes oficiais da FIFA.</v-list-item-title>
          </v-list-item>
        </v-list>
      </section>

      <!-- Seção 4 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-lock-outline" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">4. Privacidade e Proteção de Dados</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Levamos a privacidade dos nossos usuários a sério. Esta seção descreve quais dados coletamos, como os utilizamos e como os protegemos, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
        </p>

        <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-3">Dados coletados</div>
        <v-list density="compact" class="mb-4 pa-0 bg-transparent">
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2"><strong>Nome:</strong> exibido no ranking e nas apostas.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2"><strong>E-mail:</strong> usado para autenticação e comunicações do serviço.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2"><strong>Apostas e pontuações:</strong> armazenadas para operação do bolão.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2"><strong>Dados de acesso:</strong> data/hora de login para segurança da conta.</v-list-item-title>
          </v-list-item>
        </v-list>

        <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-3">Como utilizamos seus dados</div>
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Seus dados são utilizados exclusivamente para operar o bolão: autenticação, exibição no ranking, registro de apostas e envio de e-mails relacionados à sua conta (confirmação, redefinição de senha). <strong>Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins comerciais.</strong>
        </p>

        <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-3">Segurança</div>
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Os dados são armazenados na plataforma <strong>Supabase</strong>, que utiliza criptografia em trânsito (HTTPS/TLS) e em repouso. Senhas nunca são armazenadas em texto simples — utilizamos o sistema de autenticação seguro do Supabase Auth.
        </p>

        <div class="text-subtitle-2 font-weight-bold mb-2 text-grey-darken-3">Seus direitos (LGPD)</div>
        <v-list density="compact" class="pa-0 bg-transparent">
          <v-list-item prepend-icon="mdi-check" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Acessar os dados que temos sobre você.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Solicitar correção de dados incorretos.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-check" color="green-darken-3" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Solicitar a exclusão da sua conta e todos os dados associados.</v-list-item-title>
          </v-list-item>
        </v-list>
      </section>

      <!-- Seção 5 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-palette" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">5. Propriedade Intelectual</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Todo o conteúdo desta plataforma — incluindo logotipo, emblema, identidade visual, código-fonte, textos e design — são de propriedade do Bolão da Copa 2026 e protegidos pelas leis de direitos autorais.
        </p>
        <p class="text-body-2 text-grey-darken-2">
          É vedado reproduzir, distribuir ou utilizar qualquer parte desta plataforma para fins comerciais sem autorização prévia e expressa dos responsáveis. Os nomes e marcas da FIFA e Copa do Mundo são propriedade de seus respectivos titulares e são referenciados aqui apenas para fins descritivos.
        </p>
      </section>

      <!-- Seção 6 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-alert-circle-outline" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">6. Limitação de Responsabilidade</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          O Bolão da Copa é uma plataforma de entretenimento. Não nos responsabilizamos por:
        </p>
        <v-list density="compact" class="mb-3 pa-0 bg-transparent">
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Resultados dos jogos da Copa do Mundo — estes são determinados exclusivamente pela FIFA.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Interrupções no serviço por manutenção, falhas técnicas ou terceiros.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Perdas decorrentes do uso ou impossibilidade de uso da plataforma.</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-circle-small" class="px-0">
            <v-list-item-title class="text-body-2 text-grey-darken-2">Apostas não registradas antes do início do jogo por falha do usuário.</v-list-item-title>
          </v-list-item>
        </v-list>
        <p class="text-body-2 text-grey-darken-2">
          O uso da plataforma é de inteira responsabilidade do usuário.
        </p>
      </section>

      <!-- Seção 7 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-file-document-edit-outline" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">7. Alterações nestes Termos</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-3">
          Reservamo-nos o direito de atualizar estes Termos de Uso e Privacidade a qualquer momento. Quando isso ocorrer, a data de vigência no topo desta página será atualizada.
        </p>
        <p class="text-body-2 text-grey-darken-2">
          Alterações significativas serão comunicadas por e-mail aos usuários cadastrados. O uso contínuo da plataforma após as alterações implica na aceitação dos novos termos.
        </p>
      </section>

      <!-- Seção 8 -->
      <section class="mb-8">
        <div class="d-flex align-center mb-3" style="gap:10px">
          <v-icon icon="mdi-email-outline" color="green-darken-3" />
          <div class="text-h6 font-weight-bold">8. Contato</div>
        </div>
        <v-divider color="green-darken-3" thickness="2" class="mb-4" />
        <p class="text-body-2 text-grey-darken-2 mb-4">
          Em caso de dúvidas, solicitações relacionadas aos seus dados ou qualquer questão sobre estes termos, entre em contato:
        </p>
        <v-card variant="outlined" color="green-darken-3" rounded="lg" class="pa-4" style="max-width:360px">
          <div class="d-flex align-center mb-2" style="gap:8px">
            <v-icon icon="mdi-email" color="green-darken-3" size="20" />
            <strong class="text-body-2 text-green-darken-3">E-mail de suporte</strong>
          </div>
          <div class="text-body-2 text-grey-darken-2">dev.darioreis@gmail.com</div>
        </v-card>
      </section>

      <!-- Rodapé da página -->
      <v-divider class="mb-6" />
      <div class="text-center text-caption text-grey">
        Bolão da Copa do Mundo 2026 · Vigência: 17/05/2026 · Todos os direitos reservados.
      </div>

    </v-container>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
</script>
