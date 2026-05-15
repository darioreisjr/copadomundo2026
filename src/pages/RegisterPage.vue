<template>
  <AppLayout>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5">
        <v-card class="pa-6" elevation="4">
          <div class="text-h5 font-weight-bold text-center mb-6">Criar conta</div>

          <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">
            {{ error }}
          </v-alert>
          <v-alert v-if="success" type="success" class="mb-4">
            Conta criada! Verifique seu e-mail para confirmar o cadastro.
          </v-alert>

          <v-form @submit.prevent="handleRegister" ref="formRef">
            <v-text-field
              v-model="name"
              label="Nome"
              prepend-inner-icon="mdi-account"
              :rules="[v => !!v || 'Nome obrigatório']"
              class="mb-2"
            />
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              prepend-inner-icon="mdi-email"
              :rules="[v => !!v || 'E-mail obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
              class="mb-2"
            />
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              prepend-inner-icon="mdi-lock"
              :rules="[v => !!v || 'Senha obrigatória', v => v.length >= 6 || 'Mínimo 6 caracteres']"
              class="mb-2"
            />
            <v-text-field
              v-model="confirmPassword"
              label="Confirmar senha"
              type="password"
              prepend-inner-icon="mdi-lock-check"
              :rules="[v => v === password || 'Senhas não coincidem']"
              class="mb-4"
            />
            <v-btn
              type="submit"
              color="green-darken-3"
              block
              size="large"
              :loading="loading"
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
        </v-card>
      </v-col>
    </v-row>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const auth = useAuthStore()
const formRef = ref(null)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  error.value = ''
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    success.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
