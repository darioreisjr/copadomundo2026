<template>
  <AppLayout>
    <v-container style="max-width:780px" class="py-8">

      <!-- Cabeçalho -->
      <div class="text-center mb-10">
        <div class="text-h4 font-weight-bold mb-2">Como usar o Bolão</div>
        <div class="text-body-1 text-medium-emphasis">
          Guia completo da tela de login — entenda cada elemento antes de começar.
        </div>
      </div>

      <!-- Passo a passo -->
      <v-timeline side="end" align="start">

        <!-- Passo 1 -->
        <v-timeline-item dot-color="green-darken-3" icon="mdi-email-outline" size="small">
          <template #opposite>
            <span class="text-caption text-medium-emphasis">Passo 1</span>
          </template>
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">E-mail e senha</div>
            <div class="text-body-2 text-medium-emphasis">
              Digite o e-mail e a senha que você usou ao criar sua conta. O campo de senha tem
              um <strong>ícone de olho</strong> no lado direito — clique nele para mostrar ou
              ocultar a senha digitada.
            </div>
          </v-card>
        </v-timeline-item>

        <!-- Passo 2 -->
        <v-timeline-item dot-color="green-darken-3" icon="mdi-checkbox-marked-outline" size="small">
          <template #opposite>
            <span class="text-caption text-medium-emphasis">Passo 2</span>
          </template>
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">Lembrar-me</div>
            <div class="text-body-2 text-medium-emphasis">
              Esse checkbox fica <strong>desmarcado por padrão</strong>. Ao marcá-lo antes de
              entrar, o seu e-mail será salvo no navegador — na próxima vez que você abrir a
              tela de login, o campo de e-mail já virá preenchido automaticamente.
              Se desmarcar, nenhum dado fica guardado.
            </div>
          </v-card>
        </v-timeline-item>

        <!-- Passo 3 -->
        <v-timeline-item dot-color="green-darken-3" icon="mdi-lock-reset" size="small">
          <template #opposite>
            <span class="text-caption text-medium-emphasis">Passo 3</span>
          </template>
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">Esqueceu a senha?</div>
            <div class="text-body-2 text-medium-emphasis">
              Caso não lembre da sua senha, clique no link <strong>"Esqueceu a senha?"</strong>
              localizado acima do checkbox "Lembrar-me". Você será levado a uma tela onde
              digita seu e-mail e recebe um link de redefinição de senha diretamente na caixa
              de entrada.
            </div>
          </v-card>
        </v-timeline-item>

        <!-- Passo 4 -->
        <v-timeline-item dot-color="green-darken-3" icon="mdi-account-plus-outline" size="small">
          <template #opposite>
            <span class="text-caption text-medium-emphasis">Passo 4</span>
          </template>
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">Não tem conta?</div>
            <div class="text-body-2 text-medium-emphasis">
              Se ainda não possui cadastro, clique em <strong>"Criar conta"</strong> no rodapé
              da tela de login. Você será direcionado ao formulário de registro para criar seu
              usuário e começar a participar do bolão.
            </div>
          </v-card>
        </v-timeline-item>

        <!-- Passo 5 -->
        <v-timeline-item dot-color="green-darken-3" icon="mdi-arrow-left" size="small">
          <template #opposite>
            <span class="text-caption text-medium-emphasis">Passo 5</span>
          </template>
          <v-card variant="outlined" class="pa-4">
            <div class="text-subtitle-1 font-weight-bold mb-1">Botão "Voltar ao site"</div>
            <div class="text-body-2 text-medium-emphasis">
              No canto superior direito da tela de login há um botão <strong>"Voltar ao site"</strong>.
              Ele leva de volta à página inicial do Bolão sem precisar fazer login — útil para
              quem quer apenas navegar pelo site antes de entrar.
            </div>
          </v-card>
        </v-timeline-item>

      </v-timeline>

      <!-- CTA -->
      <div class="text-center mt-10">
        <v-btn :to="{ name: 'Login' }" color="green-darken-3" size="large" prepend-icon="mdi-login">
          Ir para o login
        </v-btn>
      </div>

    </v-container>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
</script>
