<template>
  <v-app>
    <v-app-bar color="green-darken-3" elevation="2">
      <v-app-bar-title>
        <router-link :to="{ name: 'Home' }" class="d-flex align-center" style="text-decoration:none">
          <img
            src="@/image/logo.png"
            alt="Bolão Copa 26"
            style="height:38px;width:auto;display:block"
          />
        </router-link>
      </v-app-bar-title>

      <v-btn :to="{ name: 'HowTo' }" variant="text">Como usar</v-btn>
      <v-btn :to="{ name: 'Terms' }" variant="text">Termos</v-btn>

      <template v-if="auth.user">
        <v-btn :to="{ name: 'Dashboard' }" variant="text">Dashboard</v-btn>
        <v-btn :to="{ name: 'Games' }" variant="text">Jogos</v-btn>
        <v-btn :to="{ name: 'Ranking' }" variant="text">Ranking</v-btn>
        <v-btn v-if="auth.profile?.role === 'admin'" :to="{ name: 'Admin' }" variant="text">Admin</v-btn>
        <v-btn @click="handleLogout" variant="text" prepend-icon="mdi-logout">Sair</v-btn>
      </template>
      <template v-else>
        <v-btn :to="{ name: 'Login' }" variant="text">Entrar</v-btn>
        <v-btn :to="{ name: 'Register' }" variant="outlined" color="white">Criar conta</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container :fluid="fluid" :class="fluid ? 'pa-0' : 'py-6'">
        <slot />
      </v-container>
    </v-main>

    <v-footer color="green-darken-4" class="text-center text-caption text-white py-3">
      Bolão da Copa &copy; {{ new Date().getFullYear() }}
    </v-footer>

    <v-snackbar
      v-model="toast.show"
      location="top right"
      :color="toast.color"
      :timeout="4000"
      rounded="lg"
    >
      <v-icon :icon="toast.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2" />
      {{ toast.message }}
      <template #actions>
        <v-btn icon="mdi-close" variant="text" size="small" @click="toast.show = false" />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

defineProps({
  fluid: { type: Boolean, default: false },
})

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'Home' })
}
</script>
