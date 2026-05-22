<template>
  <v-app>
    <v-navigation-drawer
      v-if="!isPublic && auth.user && display.smAndUp.value"
      permanent
      color="green-darken-4"
      width="220"
    >
      <template #prepend>
        <div class="d-flex flex-column align-center py-4 px-2">
          <router-link :to="{ name: 'Home' }" style="text-decoration:none" class="mt-4">
            <img
              src="@/image/logo.png"
              alt="Bolão Copa 26"
              style="height:48px;width:auto"
            />
          </router-link>
        </div>
      </template>

      <v-divider />

      <v-list density="compact" nav class="mt-1">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          :to="{ name: 'Dashboard' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-soccer"
          title="Jogos"
          :to="{ name: 'Games' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-podium"
          title="Ranking"
          :to="{ name: 'Ranking' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Grupos"
          :to="{ name: 'MeusGrupos' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Meus Grupos"
          :to="{ name: 'CriarGrupo' }"
          rounded="lg"
        />
      </v-list>

      <template v-if="auth.profile?.role === 'admin'">
        <v-divider />
        <p class="text-caption px-4 pt-3 pb-1" style="opacity:.6;letter-spacing:.08em">ADMIN</p>
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-shield-crown"
            title="Painel Admin"
            :to="{ name: 'Admin' }"
            rounded="lg"
          />
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Avatares"
            :to="{ name: 'AdminAvatars' }"
            rounded="lg"
          />
          <v-list-item
            prepend-icon="mdi-seal"
            title="Selos da Copa"
            :to="{ name: 'AdminSeals' }"
            rounded="lg"
          />
        </v-list>
      </template>

    </v-navigation-drawer>

    <v-app-bar
      v-if="!isPublic && auth.user"
      color="white"
      elevation="1"
      height="64"
    >
      <v-spacer />
      <v-btn
        :icon="rightDrawer ? 'mdi-close' : 'mdi-menu'"
        elevation="2"
        style="background-color:#1b5e20;color:#fff;margin-top:4px;margin-bottom:4px;margin-right:16px;"
        @click="rightDrawer = !rightDrawer"
      />
    </v-app-bar>

    <template v-if="!isPublic && auth.user">
      <!-- Desktop: drawer lateral direito -->
      <v-navigation-drawer
        v-if="!display.xs.value"
        v-model="rightDrawer"
        location="right"
        temporary
        color="green-darken-4"
        width="220"
      >
        <div class="d-flex flex-column align-center py-6 px-4">
          <v-avatar
            color="green-darken-1"
            size="64"
            class="mb-3"
            style="cursor:pointer"
            @click="openAvatarPicker"
          >
            <v-img
              v-if="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
              :src="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
              cover
            />
            <span v-else class="text-white font-weight-bold text-h6">
              {{ (auth.profile?.name || 'U')[0].toUpperCase() }}
            </span>
          </v-avatar>
          <span class="text-white font-weight-medium text-body-1 text-center">
            {{ auth.profile?.nome_fantasia || auth.profile?.name || 'Usuário' }}
          </span>
          <span v-if="auth.profile?.username" class="text-caption text-center" style="color:rgba(255,255,255,.6)">
            @{{ auth.profile.username }}
          </span>
          <span v-if="auth.profile?.role === 'admin'" class="text-caption mt-1" style="color:#f5c542">Admin</span>
        </div>

        <v-divider />
        <v-list density="compact" nav class="mt-1">
          <v-list-item
            prepend-icon="mdi-account-cog"
            title="Minha Conta"
            :to="{ name: 'Account' }"
            rounded="lg"
            @click="rightDrawer = false"
          />
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

        <template #append>
          <v-divider />
          <v-list density="compact" nav class="py-2">
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sair"
              rounded="lg"
              base-color="white"
              @click="handleLogout"
            />
          </v-list>
        </template>
      </v-navigation-drawer>

      <!-- Mobile: dialog fullscreen -->
      <v-dialog
        v-if="display.xs.value"
        v-model="rightDrawer"
        fullscreen
        transition="dialog-top-transition"
      >
        <v-card color="green-darken-4" class="d-flex flex-column" style="height:100%">
          <v-toolbar color="green-darken-4" flat>
            <v-spacer />
            <v-btn icon="mdi-close" color="white" @click="rightDrawer = false" />
          </v-toolbar>

          <div class="d-flex flex-column align-center py-6 px-4">
            <v-avatar
              color="green-darken-1"
              size="80"
              class="mb-3"
              style="cursor:pointer"
              @click="openAvatarPicker; rightDrawer = false"
            >
              <v-img
                v-if="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
                :src="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
                cover
              />
              <span v-else class="text-white font-weight-bold text-h5">
                {{ (auth.profile?.name || 'U')[0].toUpperCase() }}
              </span>
            </v-avatar>
            <span class="text-white font-weight-medium text-h6 text-center">
              {{ auth.profile?.nome_fantasia || auth.profile?.name || 'Usuário' }}
            </span>
            <span v-if="auth.profile?.username" class="text-caption text-center" style="color:rgba(255,255,255,.6)">
              @{{ auth.profile.username }}
            </span>
            <span v-if="auth.profile?.role === 'admin'" class="text-caption mt-1" style="color:#f5c542">Admin</span>
          </div>

          <v-divider />
          <v-list density="comfortable" nav class="mt-2 flex-grow-1" bg-color="green-darken-4" base-color="white">
            <v-list-item
              prepend-icon="mdi-account-cog"
              title="Minha Conta"
              :to="{ name: 'Account' }"
              rounded="lg"
              @click="rightDrawer = false"
            />
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

          <v-divider />
          <v-list density="comfortable" nav class="py-2" bg-color="green-darken-4" base-color="white">
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sair"
              rounded="lg"
              @click="handleLogout"
            />
          </v-list>
        </v-card>
      </v-dialog>
    </template>

    <v-bottom-navigation
      v-if="!isPublic && auth.user && display.xs.value"
      bg-color="green-darken-4"
      color="white"
      grow
      style="position:fixed;bottom:0;left:0;right:0;z-index:1000"
    >
      <v-btn :to="{ name: 'Dashboard' }"  icon="mdi-view-dashboard"      />
      <v-btn :to="{ name: 'Games' }"      icon="mdi-soccer"              />
      <v-btn :to="{ name: 'Ranking' }"    icon="mdi-podium"              />
      <v-btn :to="{ name: 'MeusGrupos' }" icon="mdi-account-group"       />
      <v-btn :to="{ name: 'CriarGrupo' }" icon="mdi-account-group-outline" />
      <v-menu
        v-if="auth.profile?.role === 'admin'"
        v-model="adminMenu"
        location="top"
        :close-on-content-click="true"
      >
        <template #activator="{ props }">
          <v-btn icon="mdi-shield-crown" v-bind="props" />
        </template>
        <v-list bg-color="green-darken-4" density="compact" nav>
          <v-list-item
            prepend-icon="mdi-shield-crown"
            title="Painel Admin"
            :to="{ name: 'Admin' }"
            base-color="white"
          />
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Avatares"
            :to="{ name: 'AdminAvatars' }"
            base-color="white"
          />
          <v-list-item
            prepend-icon="mdi-seal"
            title="Selos da Copa"
            :to="{ name: 'AdminSeals' }"
            base-color="white"
          />
        </v-list>
      </v-menu>
    </v-bottom-navigation>

    <v-main :style="display.xs.value && !isPublic && auth.user ? 'padding-bottom:56px' : ''">
      <v-container :fluid="fluid" :class="[fluid ? 'pa-0' : 'py-6', 'main-content']">
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
      location="bottom right"
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
import { ref, inject, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore }    from '@/stores/auth'
import { useToastStore }   from '@/stores/toast'
import { useAvatarsStore } from '@/stores/avatars'
import { useRouter } from 'vue-router'

const { fluid, isPublic } = defineProps({
  fluid: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
})

const display      = useDisplay()
const auth         = useAuthStore()
const avatarsStore = useAvatarsStore()
const toast = useToastStore()
const router = useRouter()

const openAvatarPicker = inject('openAvatarPicker', () => {})

const rightDrawer = ref(false)
const adminMenu   = ref(false)


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

.main-content {
  min-height: 100vh;
}
</style>
