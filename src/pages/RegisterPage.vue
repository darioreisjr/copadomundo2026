<template>
  <v-app>
    <v-main style="height:100%">
      <v-row no-gutters style="height:100vh">

        <!-- Toast de erro no topo direito -->
        <v-snackbar
          v-model="hasError"
          location="top right"
          color="error"
          :timeout="4000"
          rounded="lg"
        >
          <v-icon icon="mdi-alert-circle" class="mr-2" />
          {{ errorMsg }}
          <template #actions>
            <v-btn icon="mdi-close" variant="text" size="small" @click="hasError = false" />
          </template>
        </v-snackbar>

        <!-- Lado esquerdo: formulário -->
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
            <div style="width:100%;max-width:600px;padding:0 56px 48px">
              <div class="d-flex justify-center mb-4">
                <img
                  src="@/image/emblema.png"
                  alt="Bolão Copa 26"
                  style="height:clamp(80px,15vw,140px);width:auto"
                />
              </div>
              <div class="text-h5 font-weight-bold text-center mb-6">Criar conta</div>

              <v-form @submit.prevent="handleRegister" ref="formRef">
                <v-text-field
                  v-model="name"
                  label="Nome"
                  autocomplete="name"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || 'Nome obrigatório']"
                  class="mb-2"
                />
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  type="email"
                  autocomplete="email"
                  prepend-inner-icon="mdi-email"
                  :append-inner-icon="emailStatusIcon"
                  :error-messages="emailError"
                  :loading="emailChecking"
                  @blur="validateEmail"
                  :rules="[v => !!v || 'E-mail obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
                  class="mb-2"
                />
                <v-alert
                  v-if="emailNotConfirmed"
                  type="warning"
                  variant="tonal"
                  rounded="lg"
                  class="mb-3"
                  icon="mdi-email-alert"
                >
                  <div class="font-weight-medium mb-1">E-mail ainda não confirmado</div>
                  <div class="text-body-2 mb-2">
                    O e-mail <strong>{{ blockedEmail }}</strong> foi cadastrado mas ainda não confirmado.
                    Clique no botão abaixo para receber um novo link de confirmação.
                  </div>
                  <v-btn
                    v-if="!resendSuccess"
                    size="small"
                    variant="outlined"
                    color="warning"
                    :loading="resendLoading"
                    @click="handleResend"
                  >
                    Enviar link de confirmação
                  </v-btn>
                  <span v-else class="text-caption text-green-darken-3">
                    <v-icon icon="mdi-check" size="14" /> Link enviado! Verifique sua caixa de entrada (e o spam).
                  </span>
                </v-alert>

                <v-text-field
                  v-model="password"
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[
                    v => !!v || 'Senha obrigatória',
                    v => v.length >= 8 || 'Mínimo 8 dígitos',
                    v => /[A-Z]/.test(v) || 'Necessário uma letra maiúscula',
                    v => /[a-z]/.test(v) || 'Necessário uma letra minúscula',
                    v => /[0-9]/.test(v) || 'Necessário um número',
                  ]"
                  class="mb-2"
                />

                <v-text-field
                  v-model="confirmPassword"
                  label="Confirmar senha"
                  :type="showConfirm ? 'text' : 'password'"
                  autocomplete="new-password"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirm = !showConfirm"
                  :rules="[v => !!v || 'Confirmação obrigatória', v => v === password || 'Senhas não coincidem']"
                  class="mb-1"
                />

                <!-- Indicador de requisitos da senha -->
                <div class="mb-3 px-1">
                  <div
                    v-for="req in passwordRules"
                    :key="req.label"
                    class="d-flex align-center mb-1"
                    style="gap:6px"
                  >
                    <v-icon
                      :icon="req.test(password) ? 'mdi-check-circle' : 'mdi-circle-outline'"
                      :color="req.test(password) ? 'green-darken-3' : 'grey'"
                      size="16"
                    />
                    <span
                      class="text-caption"
                      :class="req.test(password) ? 'text-green-darken-3' : 'text-grey'"
                    >
                      {{ req.label }}
                    </span>
                  </div>
                </div>

                <v-checkbox
                  v-model="agreeTerms"
                  color="green-darken-3"
                  density="compact"
                  class="mb-3"
                  hide-details
                >
                  <template #label>
                    <span class="text-caption">
                      Concordo com os
                      <router-link
                        :to="{ name: 'Terms' }"
                        target="_blank"
                        class="text-green-darken-3 font-weight-bold"
                        style="text-decoration:none"
                      >Termos de Uso e Privacidade</router-link>
                    </span>
                  </template>
                </v-checkbox>

                <v-btn
                  type="submit"
                  color="green-darken-3"
                  block
                  size="large"
                  :loading="loading"
                  :disabled="!formReady"
                >
                  Criar conta
                </v-btn>
              </v-form>

              <div class="text-center mt-4 text-caption">
                Já tem conta?
                <router-link :to="{ name: 'Login' }" class="text-green-darken-3 font-weight-bold">
                  Entrar
                </router-link>
              </div>
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MailChecker from 'mailchecker'

const router = useRouter()
const auth = useAuthStore()
const formRef = ref(null)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const hasError = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const agreeTerms = ref(false)
const emailBlocked = ref(false)
const blockedEmail = ref('')
const emailNotConfirmed = ref(false)
const emailError = ref('')
const emailChecking = ref(false)
const emailValid = ref(false)
const resendLoading = ref(false)
const resendSuccess = ref(false)

watch(email, (val) => {
  emailValid.value = false
  emailError.value = ''
  if (emailBlocked.value && val !== blockedEmail.value) {
    emailBlocked.value = false
    blockedEmail.value = ''
    emailNotConfirmed.value = false
    resendSuccess.value = false
  }
})

const emailStatusIcon = computed(() => {
  if (emailChecking.value) return undefined
  if (emailValid.value) return 'mdi-check-circle'
  if (emailError.value) return 'mdi-alert-circle'
  return undefined
})

const formReady = computed(() =>
  emailValid.value &&
  !emailBlocked.value &&
  password.value.length >= 8 &&
  /[A-Z]/.test(password.value) &&
  /[a-z]/.test(password.value) &&
  /[0-9]/.test(password.value) &&
  agreeTerms.value
)

async function validateEmail() {
  const val = email.value
  if (!val || !/.+@.+\..+/.test(val)) return

  if (!MailChecker.isValid(val)) {
    emailError.value = 'E-mails temporários ou descartáveis não são permitidos.'
    emailValid.value = false
    return
  }

  emailChecking.value = true
  emailError.value = ''
  try {
    const res = await fetch(`${import.meta.env.VITE_EVA_API_URL}?email=${encodeURIComponent(val)}`)
    const json = await res.json()
    if (!json.data?.valid_domain) {
      emailError.value = 'Este domínio de e-mail não parece válido.'
      emailValid.value = false
    } else {
      emailValid.value = true
    }
  } catch {
    emailValid.value = true
  } finally {
    emailChecking.value = false
  }
}

const passwordRules = [
  { label: 'No mínimo 8 dígitos',          test: v => v.length >= 8 },
  { label: 'No mínimo uma letra maiúscula', test: v => /[A-Z]/.test(v) },
  { label: 'No mínimo uma letra minúscula', test: v => /[a-z]/.test(v) },
  { label: 'No mínimo um número',           test: v => /[0-9]/.test(v) },
]

async function handleResend() {
  resendLoading.value = true
  resendSuccess.value = false
  try {
    await auth.resendConfirmation(email.value)
    resendSuccess.value = true
  } catch {
    errorMsg.value = 'Erro ao reenviar o link. Tente novamente.'
    hasError.value = true
  } finally {
    resendLoading.value = false
  }
}

async function handleRegister() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (!agreeTerms.value) {
    errorMsg.value = 'Você precisa aceitar os Termos de Uso e Privacidade.'
    hasError.value = true
    return
  }
  loading.value = true
  hasError.value = false
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    agreeTerms.value = false
    emailValid.value = false
    formRef.value.reset()
    router.push({ name: 'AccountCreated' })
  } catch (e) {
    if (e.code === 'email_not_confirmed') {
      emailNotConfirmed.value = true
      emailBlocked.value = true
      blockedEmail.value = email.value
    } else if (e.code === 'email_already_exists') {
      emailBlocked.value = true
      blockedEmail.value = email.value
      errorMsg.value = e.message
      hasError.value = true
    } else {
      errorMsg.value = e.message || 'Erro ao criar conta. Tente novamente.'
      hasError.value = true
    }
  } finally {
    loading.value = false
  }
}
</script>
