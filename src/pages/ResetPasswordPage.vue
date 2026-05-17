<template>
  <v-app>
    <v-main>
      <v-row no-gutters style="min-height:100vh">

        <!-- Lado esquerdo: imagem — oculto em mobile -->
        <v-col cols="12" md="6" class="d-none d-md-flex" style="position:relative;overflow:hidden">
          <img
            src="@/image/interactiveSportsPanel.png"
            alt=""
            style="width:100%;height:100%;object-fit:cover;display:block;filter:blur(3px);transform:scale(1.05)"
          />
          <div style="position:absolute;inset:0;background:rgba(0,0,0,0.25)" />
        </v-col>

        <!-- Toast de erro -->
        <v-snackbar v-model="error" location="top right" color="error" :timeout="4000" rounded="lg">
          <v-icon icon="mdi-alert-circle" class="mr-2" />
          {{ errorMsg }}
          <template #actions>
            <v-btn icon="mdi-close" variant="text" size="small" @click="error = false" />
          </template>
        </v-snackbar>

        <!-- Lado direito -->
        <v-col cols="12" md="6" class="d-flex flex-column" style="background:#f5f5f5">
          <div class="pa-4 d-flex justify-end">
            <v-btn :to="{ name: 'Login' }" variant="outlined" prepend-icon="mdi-arrow-left" size="small">
              Voltar ao login
            </v-btn>
          </div>

          <div class="d-flex align-center justify-center flex-grow-1">
            <div style="width:100%;max-width:600px;padding:0 56px 48px">

              <div class="d-flex justify-center mb-4">
                <img
                  src="@/image/emblema.png"
                  alt="Bolão Copa 26"
                  style="height:clamp(80px,15vw,140px);width:auto"
                />
              </div>

              <div class="text-h5 font-weight-bold text-center mb-2">Nova senha</div>
              <div class="text-body-2 text-center text-medium-emphasis mb-6">
                Escolha uma nova senha para sua conta.
              </div>

              <v-form @submit.prevent="handleSubmit" ref="formRef">
                <v-text-field
                  v-model="password"
                  label="Nova senha"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[v => !!v || 'Senha obrigatória', v => v.length >= 6 || 'Mínimo 6 caracteres']"
                  class="mb-2"
                />
                <v-text-field
                  v-model="confirm"
                  label="Confirmar senha"
                  :type="showConfirm ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirm = !showConfirm"
                  :rules="[v => !!v || 'Confirmação obrigatória', v => v === password || 'As senhas não coincidem']"
                  class="mb-4"
                />
                <v-btn
                  type="submit"
                  color="green-darken-3"
                  block
                  size="large"
                  :loading="loading"
                >
                  Redefinir senha
                </v-btn>
              </v-form>

            </div>
          </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toast = useToastStore()

const formRef = ref(null)
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  error.value = false
  try {
    const { error: err } = await supabase.auth.updateUser({ password: password.value })
    if (err) throw err
    toast.notify('Senha redefinida com sucesso! Bem-vindo de volta.')
    router.push({ name: 'Dashboard' })
  } catch {
    errorMsg.value = 'Não foi possível redefinir a senha. O link pode ter expirado.'
    error.value = true
  } finally {
    loading.value = false
  }
}
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
