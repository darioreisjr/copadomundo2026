<template>
  <v-app>
    <v-main style="height:100%">
      <v-row no-gutters style="height:100vh">

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
