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
  </v-app>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps({
  fluid: { type: Boolean, default: false },
})

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'Home' })
}
</script>
