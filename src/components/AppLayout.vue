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
