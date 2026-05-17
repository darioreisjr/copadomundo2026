<template>
  <v-app>
    <v-main>
      <v-row no-gutters style="min-height:100vh">

        <!-- Lado esquerdo: conteúdo -->
        <v-col cols="12" md="6" class="d-flex flex-column" style="background:#f5f5f5">
          <div class="pa-4 d-flex justify-end">
            <v-btn
              :to="{ name: 'Home' }"
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              size="small"
            >
              Voltar ao site
            </v-btn>
          </div>

          <div class="d-flex align-center justify-center flex-grow-1">
            <div style="width:100%;max-width:560px;padding:0 56px 48px">

              <div class="d-flex justify-center mb-4">
                <img
                  src="@/image/emblema.png"
                  alt="Bolão Copa 26"
                  style="height:clamp(80px,15vw,140px);width:auto"
                />
              </div>

              <div class="d-flex flex-column align-center mb-6">
                <v-icon icon="mdi-check-circle" color="green-darken-3" size="64" class="mb-3" />
                <div class="text-h5 font-weight-bold text-center">Conta criada com sucesso!</div>
                <div class="text-body-1 text-grey-darken-1 text-center mt-2">
                  Siga os passos abaixo para ativar sua conta
                </div>
              </div>

              <v-list lines="two" class="pa-0 mb-6" style="background:transparent">
                <v-list-item class="px-0 mb-4">
                  <template #prepend>
                    <v-avatar color="green-darken-3" size="36" class="mr-4 flex-shrink-0">
                      <span class="text-body-2 font-weight-bold text-white">1</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1">
                    Abra seu e-mail
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2" style="white-space:normal">
                    Acesse a caixa de entrada do e-mail que você cadastrou.
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0 mb-4">
                  <template #prepend>
                    <v-avatar color="green-darken-3" size="36" class="mr-4 flex-shrink-0">
                      <span class="text-body-2 font-weight-bold text-white">2</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1">
                    Procure o e-mail do Bolão Copa 26
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2" style="white-space:normal">
                    O assunto será "Confirme seu endereço de e-mail".
                    Verifique também a pasta de <strong>Spam / Lixo eletrônico</strong>.
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0 mb-4">
                  <template #prepend>
                    <v-avatar color="green-darken-3" size="36" class="mr-4 flex-shrink-0">
                      <span class="text-body-2 font-weight-bold text-white">3</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1">
                    Clique no link de confirmação
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2" style="white-space:normal">
                    Dentro do e-mail haverá um botão ou link — clique nele para ativar sua conta.
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0">
                  <template #prepend>
                    <v-avatar color="green-darken-3" size="36" class="mr-4 flex-shrink-0">
                      <span class="text-body-2 font-weight-bold text-white">4</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium text-body-1 mb-1">
                    Pronto! Faça login
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-body-2" style="white-space:normal">
                    Após confirmar, volte aqui e entre com seu e-mail e senha.
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-btn
                color="green-darken-3"
                variant="flat"
                block
                size="large"
                prepend-icon="mdi-login"
                :to="{ name: 'Login' }"
              >
                Ir para o login
              </v-btn>

            </div>
          </div>
        </v-col>

        <!-- Lado direito: imagem — oculta em mobile -->
        <v-col cols="12" md="6" class="d-none d-md-flex" style="position:relative;overflow:hidden">
          <img
            src="@/image/futuristicStadium.png"
            alt=""
            style="width:100%;height:100%;object-fit:cover;display:block;filter:blur(3px);transform:scale(1.05)"
          />
          <div style="position:absolute;inset:0;background:rgba(0,0,0,0.25)" />
        </v-col>

      </v-row>
    </v-main>

    <v-footer color="green-darken-4" class="text-white">
      <v-container class="py-10">
        <v-row>
          <v-col cols="12" sm="4" class="mb-6 mb-sm-0 text-center text-sm-start">
            <router-link :to="{ name: 'Home' }" class="d-inline-block mb-3" style="text-decoration:none">
              <img src="@/image/logo.png" alt="Bolão Copa 26" style="height:40px;width:auto" />
            </router-link>
            <p class="text-body-2 mb-1" style="opacity:.75">
              O bolão mais emocionante da Copa do Mundo 2026.
            </p>
            <v-icon icon="mdi-trophy-outline" color="#f5c542" size="small" class="mr-1" />
            <span class="text-caption font-weight-medium" style="color:#f5c542">Copa do Mundo 2026</span>
          </v-col>

          <v-col cols="6" sm="4" class="mb-6 mb-sm-0 text-center">
            <p class="text-body-2 font-weight-bold mb-3 text-uppercase" style="letter-spacing:.08em">
              Links Rápidos
            </p>
            <div class="d-flex flex-column gap-2">
              <router-link :to="{ name: 'HowTo' }" class="footer-link text-caption">
                <v-icon icon="mdi-help-circle-outline" size="x-small" class="mr-1" />Como Usar
              </router-link>
              <router-link :to="{ name: 'Terms' }" class="footer-link text-caption">
                <v-icon icon="mdi-file-document-outline" size="x-small" class="mr-1" />Termos de Uso
              </router-link>
              <router-link :to="{ name: 'Ranking' }" class="footer-link text-caption">
                <v-icon icon="mdi-podium" size="x-small" class="mr-1" />Ranking
              </router-link>
              <router-link :to="{ name: 'Games' }" class="footer-link text-caption">
                <v-icon icon="mdi-soccer" size="x-small" class="mr-1" />Fazer Palpite
              </router-link>
            </div>
          </v-col>

          <v-col cols="6" sm="4" class="text-center text-sm-end">
            <p class="text-body-2 font-weight-bold mb-3 text-uppercase" style="letter-spacing:.08em">
              Suporte
            </p>
            <p class="text-caption mb-1" style="opacity:.75">Dúvidas? Entre em contato</p>
            <a
              href="mailto:dev.darioreis@gmail.com"
              class="footer-link text-caption d-inline-flex align-center"
            >
              <v-icon icon="mdi-email-outline" size="x-small" class="mr-1" />dev.darioreis@gmail.com
            </a>
            <div class="mt-4 d-flex align-center justify-center justify-sm-end">
              <v-icon icon="mdi-brain" size="small" class="mr-1" style="opacity:.6" />
              <span class="text-caption" style="opacity:.6">Powered by Gemini AI</span>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6" style="border-color:rgba(255,255,255,.2)" />

        <div class="text-center">
          <p class="text-caption" style="opacity:.75">
            &copy; {{ new Date().getFullYear() }} Bolão da Copa 26 &middot; Todos os direitos reservados
          </p>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
</script>

<style scoped>
.footer-link {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #f5c542;
}
</style>
