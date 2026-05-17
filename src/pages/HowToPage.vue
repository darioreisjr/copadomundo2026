<template>
  <AppLayout>
    <v-container style="max-width:820px" class="py-8">

      <!-- Cabeçalho -->
      <div class="text-center mb-10">
        <v-icon icon="mdi-help-circle" color="green-darken-3" size="48" class="mb-3" />
        <div class="text-h4 font-weight-bold mb-2">Como usar o Bolão</div>
        <div class="text-body-1 text-medium-emphasis">
          Guia completo para entrar na sua conta e criar um novo cadastro.
        </div>
      </div>

      <!-- Abas: Login / Criar conta -->
      <v-tabs v-model="tab" color="green-darken-3" align-tabs="center" class="mb-8">
        <v-tab value="login" prepend-icon="mdi-login">Entrar na conta</v-tab>
        <v-tab value="register" prepend-icon="mdi-account-plus">Criar conta</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">

        <!-- ===== ABA: LOGIN ===== -->
        <v-tabs-window-item value="login">
          <v-timeline side="end" align="start">

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

          <div class="text-center mt-10">
            <v-btn :to="{ name: 'Login' }" color="green-darken-3" size="large" prepend-icon="mdi-login">
              Ir para o login
            </v-btn>
          </div>
        </v-tabs-window-item>

        <!-- ===== ABA: CRIAR CONTA ===== -->
        <v-tabs-window-item value="register">
          <v-timeline side="end" align="start">

            <!-- Passo 1 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-account-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 1</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">Digite seu nome</div>
                <div class="text-body-2 text-medium-emphasis">
                  No campo <strong>Nome</strong>, digite como você quer ser identificado no ranking
                  e nas apostas. Este nome será exibido para todos os participantes do bolão.
                </div>
              </v-card>
            </v-timeline-item>

            <!-- Passo 2 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-email-check-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 2</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-2">Digite seu e-mail</div>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  O e-mail é validado automaticamente em duas etapas ao sair do campo:
                </div>
                <v-list density="compact" class="pa-0 bg-transparent">
                  <v-list-item prepend-icon="mdi-shield-check" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">
                      <strong>Verificação offline:</strong> detecta e bloqueia e-mails temporários ou descartáveis (Mailinator, TempMail, etc.)
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-web-check" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">
                      <strong>Verificação online:</strong> confirma que o domínio do e-mail possui um servidor real ativo
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-alert type="success" variant="tonal" density="compact" class="mt-3" icon="mdi-check-circle">
                  Um ícone verde aparece ao lado do campo quando o e-mail é válido.
                </v-alert>
              </v-card>
            </v-timeline-item>

            <!-- Passo 3 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-lock-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 3</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-2">Crie uma senha forte</div>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  A senha precisa atender a todos os 4 requisitos abaixo. Um indicador visual
                  mostra em tempo real quais já foram cumpridos:
                </div>
                <v-list density="compact" class="pa-0 bg-transparent">
                  <v-list-item prepend-icon="mdi-numeric" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">No mínimo <strong>8 dígitos</strong></v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-format-letter-case-upper" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">No mínimo <strong>uma letra maiúscula</strong> (A–Z)</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-format-letter-case-lower" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">No mínimo <strong>uma letra minúscula</strong> (a–z)</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-pound" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">No mínimo <strong>um número</strong> (0–9)</v-list-item-title>
                  </v-list-item>
                </v-list>
                <div class="text-body-2 text-medium-emphasis mt-3">
                  Use o <strong>ícone de olho</strong> no lado direito do campo para mostrar ou ocultar a senha digitada.
                </div>
              </v-card>
            </v-timeline-item>

            <!-- Passo 4 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-lock-check-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 4</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">Confirme a senha</div>
                <div class="text-body-2 text-medium-emphasis">
                  Digite a mesma senha novamente no campo <strong>Confirmar senha</strong>.
                  As duas senhas precisam ser idênticas para prosseguir.
                  Você também pode usar o ícone de olho para conferir o que digitou.
                </div>
              </v-card>
            </v-timeline-item>

            <!-- Passo 5 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-file-document-check-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 5</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-1">Aceite os Termos de Uso</div>
                <div class="text-body-2 text-medium-emphasis">
                  Marque o checkbox <strong>"Concordo com os
                  <router-link :to="{ name: 'Terms' }" class="text-green-darken-3 font-weight-bold" style="text-decoration:none">Termos de Uso e Privacidade</router-link>"</strong>.
                  Você pode clicar no link para ler o documento completo antes de aceitar.
                  Este passo é obrigatório para criar a conta.
                </div>
              </v-card>
            </v-timeline-item>

            <!-- Passo 6 -->
            <v-timeline-item dot-color="green-darken-3" icon="mdi-rocket-launch-outline" size="small">
              <template #opposite>
                <span class="text-caption text-medium-emphasis">Passo 6</span>
              </template>
              <v-card variant="outlined" class="pa-4">
                <div class="text-subtitle-1 font-weight-bold mb-2">Clique em "Criar conta"</div>
                <div class="text-body-2 text-medium-emphasis mb-3">
                  O botão <strong>"Criar conta"</strong> só fica habilitado quando todos os requisitos
                  acima estão satisfeitos. Ao clicar:
                </div>
                <v-list density="compact" class="pa-0 bg-transparent">
                  <v-list-item prepend-icon="mdi-email-fast-outline" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Um e-mail de confirmação será enviado para o endereço cadastrado</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-cursor-default-click-outline" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Clique no link do e-mail para ativar sua conta</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-login-variant" color="green-darken-3" class="px-0">
                    <v-list-item-title class="text-body-2 text-medium-emphasis">Após confirmar, faça login normalmente com seu e-mail e senha</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-alert type="warning" variant="tonal" density="compact" class="mt-3" icon="mdi-alert">
                  Se o e-mail já estiver cadastrado, o botão será bloqueado até que você troque o endereço.
                </v-alert>
              </v-card>
            </v-timeline-item>

          </v-timeline>

          <div class="text-center mt-10">
            <v-btn :to="{ name: 'Register' }" color="green-darken-3" size="large" prepend-icon="mdi-account-plus">
              Criar minha conta
            </v-btn>
          </div>
        </v-tabs-window-item>

      </v-tabs-window>
    </v-container>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

const tab = ref('login')
</script>
