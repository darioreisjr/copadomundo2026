<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Dialog global: seletor de avatar -->
  <v-dialog v-model="avatarPickerOpen" max-width="480" scrollable>
    <v-card>
      <v-card-title class="pa-4 pb-2 text-body-1 font-weight-bold">
        Escolha seu avatar
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-4">
        <v-progress-linear v-if="avatarsStore.loading" indeterminate color="green-darken-3" class="mb-4" />
        <div
          v-else-if="activeAvatars.length === 0"
          class="text-center text-medium-emphasis py-6"
        >
          Nenhum avatar disponível ainda.
        </div>
        <v-row v-else dense>
          <v-col
            v-for="av in activeAvatars"
            :key="av.id"
            cols="3"
            class="d-flex justify-center"
          >
            <v-avatar
              size="64"
              :style="pickerSelected === av.url
                ? 'cursor:pointer;outline:3px solid #2e7d32;outline-offset:2px'
                : 'cursor:pointer'"
              @click="pickerSelected = av.url"
            >
              <v-img :src="av.url" :alt="av.name" cover />
            </v-avatar>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4 justify-end ga-2">
        <v-btn variant="text" :disabled="savingAvatar" @click="avatarPickerOpen = false">
          Cancelar
        </v-btn>
        <v-btn
          color="green-darken-3"
          :loading="savingAvatar"
          :disabled="!pickerSelected"
          @click="saveAvatarPick"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAvatarsStore } from '@/stores/avatars'
import { useToastStore } from '@/stores/toast'

const auth = useAuthStore()
const avatarsStore = useAvatarsStore()
const toast = useToastStore()

const avatarPickerOpen = ref(false)
const pickerSelected = ref('')
const savingAvatar = ref(false)

const activeAvatars = computed(() => avatarsStore.avatars.filter(a => a.active))

function openAvatarPicker() {
  pickerSelected.value = auth.profile?.avatar_url || ''
  if (!avatarsStore.avatars.length) avatarsStore.fetchAvatars()
  avatarPickerOpen.value = true
}

async function saveAvatarPick() {
  if (!pickerSelected.value) return
  savingAvatar.value = true
  try {
    await auth.updateProfile({ avatar_url: pickerSelected.value })
    toast.notify('Avatar atualizado!')
    avatarPickerOpen.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao salvar avatar.', 'error')
  } finally {
    savingAvatar.value = false
  }
}

provide('openAvatarPicker', openAvatarPicker)

onMounted(() => {
  if (auth.user && !avatarsStore.avatars.length) avatarsStore.fetchAvatars()
})
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
