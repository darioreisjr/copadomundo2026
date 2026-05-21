<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Dialog global: recompensa de selos -->
  <SealRewardModal
    v-model="sealsStore.modalOpen"
    :reward="sealsStore.pendingReward"
  />

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
            <div style="position:relative;cursor:pointer" @click="handleAvatarClick(av)">
              <v-avatar
                size="64"
                :style="[
                  pickerSelected === av.url ? 'outline:3px solid #2e7d32;outline-offset:2px' : '',
                  !isUnlocked(av) ? 'opacity:0.4;filter:grayscale(1)' : '',
                ].filter(Boolean).join(';')"
              >
                <v-img :src="av.url" :alt="av.name" cover />
              </v-avatar>
              <div
                v-if="!isUnlocked(av)"
                style="position:absolute;inset:0;display:flex;flex-direction:column;
                       align-items:center;justify-content:center;pointer-events:none;gap:2px"
              >
                <v-icon icon="mdi-lock" color="white" size="18" />
                <span style="font-size:10px;font-weight:700;color:#fff;line-height:1;
                             text-shadow:0 1px 2px rgba(0,0,0,.7)">
                  {{ av.seal_cost }}
                  <v-icon icon="mdi-seal" size="10" color="white" />
                </span>
              </div>
            </div>
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

  <!-- Dialog: confirmação de desbloqueio de avatar -->
  <v-dialog v-model="unlockDialogOpen" max-width="360">
    <v-card class="pa-6 text-center">
      <v-avatar size="80" class="mb-4 mx-auto" rounded="lg">
        <v-img :src="unlockTarget?.url" :alt="unlockTarget?.name" cover />
      </v-avatar>
      <div class="text-h6 mb-1">{{ unlockTarget?.name }}</div>
      <div class="text-body-2 text-medium-emphasis mb-3">
        Desbloquear este avatar por
        <strong>{{ unlockTarget?.seal_cost }} selos</strong>?
      </div>
      <div class="text-caption mb-4">
        Você tem <strong>{{ auth.profile?.total_seals ?? 0 }}</strong> selos.
      </div>
      <v-alert
        v-if="(auth.profile?.total_seals ?? 0) < (unlockTarget?.seal_cost ?? 0)"
        type="warning"
        density="compact"
        variant="tonal"
        class="mb-4 text-left"
      >
        Selos insuficientes para desbloquear este avatar.
      </v-alert>
      <div class="d-flex justify-end ga-2">
        <v-btn variant="text" :disabled="unlocking" @click="unlockDialogOpen = false">
          Cancelar
        </v-btn>
        <v-btn
          color="green-darken-3"
          :loading="unlocking"
          :disabled="(auth.profile?.total_seals ?? 0) < (unlockTarget?.seal_cost ?? 0)"
          @click="confirmUnlock"
        >
          Desbloquear
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAvatarsStore } from '@/stores/avatars'
import { useToastStore } from '@/stores/toast'
import { useSealsStore } from '@/stores/seals'
import SealRewardModal from '@/components/SealRewardModal.vue'

const auth = useAuthStore()
const avatarsStore = useAvatarsStore()
const toast = useToastStore()
const sealsStore = useSealsStore()

let dailyChestTimer = null

function triggerDailyChest() {
  if (dailyChestTimer) return
  dailyChestTimer = setTimeout(async () => {
    dailyChestTimer = null
    if (!auth.user) return
    try {
      const result = await sealsStore.claimDailyChest()
      if (result?.granted) {
        if (auth.profile) auth.profile.total_seals = (auth.profile.total_seals ?? 0) + result.seals
        sealsStore.showReward(result)
      }
    } catch {
      // silencia erro de rede sem incomodar o usuário
    }
  }, 20000)
}

provide('triggerDailyChest', triggerDailyChest)

const avatarPickerOpen  = ref(false)
const pickerSelected    = ref('')
const savingAvatar      = ref(false)
const unlockDialogOpen  = ref(false)
const unlockTarget      = ref(null)
const unlocking         = ref(false)

const activeAvatars = computed(() => avatarsStore.avatars.filter(a => a.active))

function isUnlocked(av) {
  return av.seal_cost === 0 || avatarsStore.unlockedAvatarIds.has(av.id)
}

function handleAvatarClick(av) {
  if (isUnlocked(av)) {
    pickerSelected.value = av.url
  } else {
    unlockTarget.value    = av
    unlockDialogOpen.value = true
  }
}

async function confirmUnlock() {
  if (!unlockTarget.value) return
  unlocking.value = true
  try {
    const result = await avatarsStore.unlockAvatar(unlockTarget.value.id)
    if (auth.profile) {
      auth.profile.total_seals = (auth.profile.total_seals ?? 0) - result.seals_spent
    }
    toast.notify(`Avatar "${unlockTarget.value.name}" desbloqueado!`)
    pickerSelected.value   = unlockTarget.value.url
    unlockDialogOpen.value = false
  } catch (e) {
    const msgs = {
      insufficient_seals: 'Selos insuficientes.',
      already_unlocked:   'Avatar já desbloqueado.',
      avatar_is_free:     'Este avatar é gratuito.',
      avatar_not_found:   'Avatar não encontrado.',
    }
    toast.notify(msgs[e.message] || e.message || 'Erro ao desbloquear avatar.', 'error')
  } finally {
    unlocking.value = false
  }
}

function openAvatarPicker() {
  pickerSelected.value = auth.profile?.avatar_url
    || avatarsStore.avatars.find(a => a.is_default)?.url
    || ''
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
  if (auth.user) {
    if (!avatarsStore.avatars.length) avatarsStore.fetchAvatars()
    avatarsStore.fetchUnlockedAvatars()
  }
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
