<template>
  <AppLayout>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="pa-6" elevation="4">
          <div class="d-flex justify-center mb-4">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              style="height:clamp(48px,12vw,80px);width:auto"
            />
          </div>
          <div class="text-h5 font-weight-bold text-center mb-6">Entrar</div>

          <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin" ref="formRef">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[v => !!v || 'E-mail obrigatório']"
              class="mb-2"
            />
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              prepend-inner-icon="mdi-lock"
              :rules="[v => !!v || 'Senha obrigatória']"
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="green-darken-3"
              block
              size="large"
              :loading="loading"
            >
              Entrar
            </v-btn>
          </v-form>

          <div class="text-center mt-4 text-caption">
            Não tem conta?
            <router-link :to="{ name: 'Register' }" class="text-green-darken-3 font-weight-bold">
              Criar conta
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const auth = useAuthStore()
const router = useRouter()
const formRef = ref(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  error.value = ''
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push({ name: 'Dashboard' })
  } catch (e) {
    error.value = 'E-mail ou senha inválidos.'
  } finally {
    loading.value = false
  }
}
</script>
