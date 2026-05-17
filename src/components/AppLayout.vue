<template>
  <v-app>
    <v-navigation-drawer
      v-if="!isPublic && auth.user"
      v-model:rail="isRail"
      permanent
      color="green-darken-4"
      width="220"
    >
      <template #prepend>
        <div style="position:relative;" class="d-flex flex-column align-center py-4 px-2">
          <v-btn
            :icon="isRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            size="x-small"
            color="white"
            style="position:absolute;top:4px;right:4px;"
            @click="toggleRail"
          />
          <router-link :to="{ name: 'Home' }" style="text-decoration:none" class="mt-4">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              :style="isRail ? 'height:28px;width:auto' : 'height:48px;width:auto'"
            />
          </router-link>
        </div>
      </template>

      <v-divider />

      <v-list density="compact" nav class="mt-1">
        <v-tooltip :text="isRail ? 'Dashboard' : ''" location="end">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-view-dashboard"
              title="Dashboard"
              :to="{ name: 'Dashboard' }"
              rounded="lg"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="isRail ? 'Jogos' : ''" location="end">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-soccer"
              title="Jogos"
              :to="{ name: 'Games' }"
              rounded="lg"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="isRail ? 'Ranking' : ''" location="end">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-podium"
              title="Ranking"
              :to="{ name: 'Ranking' }"
              rounded="lg"
            />
          </template>
        </v-tooltip>
      </v-list>

      <template v-if="auth.profile?.role === 'admin'">
        <v-divider />
        <p v-if="!isRail" class="text-caption px-4 pt-3 pb-1" style="opacity:.6;letter-spacing:.08em">ADMIN</p>
        <v-list density="compact" nav>
          <v-tooltip :text="isRail ? 'Painel Admin' : ''" location="end">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-shield-crown"
                title="Painel Admin"
                :to="{ name: 'Admin' }"
                rounded="lg"
              />
            </template>
          </v-tooltip>
        </v-list>
      </template>

      <template #append>
        <v-divider />
        <v-list density="compact" nav class="py-2">
          <v-tooltip :text="isRail ? 'Sair' : ''" location="end">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-logout"
                title="Sair"
                rounded="lg"
                base-color="white"
                @click="handleLogout"
              />
            </template>
          </v-tooltip>
        </v-list>
      </template>
    </v-navigation-drawer>

    <template v-if="!isPublic && auth.user">
      <v-btn
        :icon="rightDrawer ? 'mdi-close' : 'mdi-menu'"
        color="green-darken-4"
        style="position:fixed;top:12px;right:12px;z-index:1100;"
        elevation="2"
        @click="rightDrawer = !rightDrawer"
      />

      <v-navigation-drawer
        v-model="rightDrawer"
        location="right"
        temporary
        color="green-darken-4"
        width="220"
      >
        <div class="d-flex flex-column align-center py-6 px-4">
          <v-avatar color="green-darken-1" size="64" class="mb-3">
            <span class="text-white font-weight-bold text-h6">
              {{ (auth.profile?.name || 'U')[0].toUpperCase() }}
            </span>
          </v-avatar>
          <span class="text-white font-weight-medium text-body-1 text-center">
            {{ auth.profile?.name || 'Usuário' }}
          </span>
          <span v-if="auth.profile?.role === 'admin'" class="text-caption mt-1" style="color:#f5c542">Admin</span>
        </div>

        <v-divider />
        <v-list density="compact" nav class="mt-1">
          <v-list-item
            prepend-icon="mdi-help-circle-outline"
            title="Como Usar"
            :to="{ name: 'HowTo' }"
            rounded="lg"
            @click="rightDrawer = false"
          />
          <v-list-item
            prepend-icon="mdi-file-document-outline"
            title="Termos"
            :to="{ name: 'Terms' }"
            rounded="lg"
            @click="rightDrawer = false"
          />
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container :fluid="fluid" :class="fluid ? 'pa-0' : 'py-6'">
        <slot />
      </v-container>

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
    </v-main>

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
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useRouter } from 'vue-router'

const { fluid, isPublic } = defineProps({
  fluid: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
})

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const rightDrawer = ref(false)

const RAIL_KEY = 'drawer-rail'
const isRail = ref(localStorage.getItem(RAIL_KEY) === 'true')

function toggleRail() {
  isRail.value = !isRail.value
}

watch(isRail, (val) => {
  localStorage.setItem(RAIL_KEY, String(val))
})

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
