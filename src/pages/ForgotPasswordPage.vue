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

              <!-- Estado: formulário -->
              <template v-if="!sent">
                <div class="text-h5 font-weight-bold text-center mb-2">Recuperar senha</div>
                <div class="text-body-2 text-center text-medium-emphasis mb-6">
                  Digite seu e-mail e enviaremos um link para redefinir sua senha.
                </div>

                <v-form @submit.prevent="handleSubmit" ref="formRef">
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    type="email"
                    autocomplete="email"
                    prepend-inner-icon="mdi-email"
                    :rules="[v => !!v || 'E-mail obrigatório']"
                    class="mb-4"
                  />
                  <v-btn
                    type="submit"
                    color="green-darken-3"
                    block
                    size="large"
                    :loading="loading"
                  >
                    Enviar link
                  </v-btn>
                </v-form>
              </template>

              <!-- Estado: email enviado -->
              <template v-else>
                <div class="d-flex justify-center mb-6">
                  <v-icon icon="mdi-email-check-outline" size="64" color="green-darken-3" />
                </div>
                <div class="text-h5 font-weight-bold text-center mb-2">Verifique seu e-mail</div>
                <div class="text-body-2 text-center text-medium-emphasis mb-6">
                  Enviamos um link de redefinição para <strong>{{ email }}</strong>.<br>
                  Pode levar alguns minutos para chegar.
                </div>
                <v-btn :to="{ name: 'Login' }" color="green-darken-3" block size="large" variant="outlined">
                  Voltar ao login
                </v-btn>
              </template>

            </div>
          </div>
        </v-col>

      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const formRef = ref(null)
const email = ref('')
const loading = ref(false)
const sent = ref(false)
const error = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  error.value = false
  try {
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) throw err
    sent.value = true
  } catch {
    errorMsg.value = 'Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.'
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
