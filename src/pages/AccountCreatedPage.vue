<template>
  <v-app>
    <v-main style="height:100%">
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
  </v-app>
</template>

<script setup>
</script>
