<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    location="bottom end"
    offset="8"
    :width="display.xs.value ? '96vw' : 380"
    @update:model-value="onMenuToggle"
  >
    <template #activator="{ props: menuProps }">
      <div style="position:relative;display:inline-flex;margin-top:4px;margin-bottom:4px;margin-right:16px">
        <v-btn
          :icon="notifStore.unreadCount > 0 ? 'mdi-bell-badge' : 'mdi-bell-outline'"
          v-bind="menuProps"
          variant="outlined"
          elevation="0"
          rounded="lg"
          size="small"
          style="color:#1b5e20;border-color:#1b5e20;background:transparent"
        />
        <span
          v-if="notifStore.unreadCount > 0"
          style="position:absolute;top:-6px;right:-6px;background:#1b5e20;color:#fff;font-size:10px;font-weight:700;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 4px;pointer-events:none;border:1.5px solid #fff;z-index:1"
        >
          {{ notifStore.unreadCount }}
        </span>
      </div>
    </template>

    <v-card color="green-darken-4" rounded="lg" elevation="8" style="overflow:hidden">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between px-4 pt-3 pb-2">
        <span class="text-white font-weight-bold text-body-1">Notificações</span>
        <v-btn
          v-if="notifStore.unreadCount > 0"
          variant="text"
          size="x-small"
          density="comfortable"
          style="color:#fff;font-size:11px"
          prepend-icon="mdi-check-all"
          @click="notifStore.markAllAsRead()"
        >
          Marcar todas como lidas
        </v-btn>
      </div>

      <!-- Tabs -->
      <v-tabs
        v-model="activeTab"
        density="compact"
        color="#ffffff"
        bg-color="transparent"
        slider-color="#ffffff"
      >
        <v-tab value="unread" class="text-white text-caption">
          Não lidas
          <v-chip
            v-if="notifStore.unreadCount > 0"
            size="x-small"
            color="#ffffff"
            text-color="#1b5e20"
            class="ml-1"
            style="font-size:10px;height:16px;min-width:16px"
          >
            {{ notifStore.unreadCount }}
          </v-chip>
        </v-tab>
        <v-tab value="read" class="text-white text-caption">Lidas</v-tab>
      </v-tabs>

      <v-divider style="border-color:rgba(255,255,255,0.15)" />

      <v-progress-linear v-if="notifStore.loading" indeterminate color="#ffffff" height="2" />

      <v-window v-model="activeTab" class="notif-scroll" style="max-height:420px;overflow-y:auto">

        <!-- Não lidas -->
        <v-window-item value="unread">
          <div v-if="!notifStore.loading && !notifStore.unreadNotifications.length" class="text-center py-10 px-4">
            <v-icon icon="mdi-bell-check-outline" size="48" style="opacity:.3;color:#fff" class="mb-3" />
            <p class="text-caption" style="color:rgba(255,255,255,.55)">Tudo em dia! Nenhuma notificação não lida.</p>
          </div>
          <div v-else>
            <NotifRow
              v-for="notif in notifStore.unreadNotifications"
              :key="notif.id"
              :notif="notif"
              :accepting="accepting"
              :declining="declining"
              @open="openDetail"
              @accept="handleAccept"
              @decline="handleDecline"
            />
          </div>
        </v-window-item>

        <!-- Lidas -->
        <v-window-item value="read">
          <div v-if="!notifStore.loading && !notifStore.readNotifications.length" class="text-center py-10 px-4">
            <v-icon icon="mdi-bell-outline" size="48" style="opacity:.3;color:#fff" class="mb-3" />
            <p class="text-caption" style="color:rgba(255,255,255,.55)">Nenhuma notificação lida ainda.</p>
          </div>
          <div v-else>
            <NotifRow
              v-for="notif in notifStore.readNotifications"
              :key="notif.id"
              :notif="notif"
              :read="true"
              :accepting="accepting"
              :declining="declining"
              @open="openDetail"
              @accept="handleAccept"
              @decline="handleDecline"
            />
          </div>
        </v-window-item>

      </v-window>
    </v-card>
  </v-menu>

  <!-- Popup de detalhe da notificação -->
  <v-dialog v-model="detailOpen" max-width="420" @click:outside="detailOpen = false">
    <v-card v-if="selectedNotif" color="green-darken-4" rounded="xl" elevation="12" style="overflow:hidden;position:relative">

      <!-- Botão fechar -->
      <v-btn
        icon="mdi-close"
        variant="text"
        color="white"
        size="small"
        style="position:absolute;top:12px;right:12px;z-index:2"
        @click="detailOpen = false"
      />

      <!-- Área do ícone grande -->
      <div style="background:rgba(0,0,0,0.25);padding:52px 24px 36px;text-align:center">
        <v-icon
          :icon="selectedNotif.type === 'invite' ? 'mdi-email-outline' : 'mdi-seal'"
          size="80"
          color="white"
        />
      </div>

      <!-- Corpo -->
      <div style="padding:24px 28px 28px">

        <!-- Categoria + tempo -->
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px">
          <v-icon
            :icon="selectedNotif.type === 'invite' ? 'mdi-email-outline' : 'mdi-seal'"
            size="13"
            style="color:rgba(255,255,255,0.5)"
          />
          <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">
            {{ selectedNotif.type === 'invite' ? 'CONVITES' : 'SELOS' }}
          </span>
          <span style="color:rgba(255,255,255,0.4);font-size:11px">· {{ relativeTime(selectedNotif.timestamp) }} atrás</span>
        </div>

        <!-- Título -->
        <div style="color:#fff;font-size:20px;font-weight:700;line-height:1.3;margin-bottom:10px">
          {{ selectedNotif.title }}
        </div>

        <!-- Descrição por tipo -->
        <template v-if="selectedNotif.type === 'invite'">
          <div style="color:rgba(255,255,255,0.65);font-size:14px;margin-bottom:24px">
            {{ selectedNotif.description }}
          </div>
          <div v-if="!selectedNotif.read" style="display:flex;gap:12px">
            <v-btn
              color="green-lighten-1"
              variant="tonal"
              rounded="lg"
              :loading="accepting === selectedNotif.memberId"
              @click="handleAccept(selectedNotif.memberId)"
            >
              Aceitar convite
            </v-btn>
            <v-btn
              color="red-lighten-2"
              variant="text"
              rounded="lg"
              :loading="declining === selectedNotif.memberId"
              @click="handleDecline(selectedNotif.memberId)"
            >
              Recusar
            </v-btn>
          </div>
          <div v-else style="color:rgba(255,255,255,0.4);font-size:12px">
            Este convite já foi processado.
          </div>
        </template>

        <template v-else>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <v-icon icon="mdi-seal" size="20" color="#a5d6a7" />
            <span style="color:#a5d6a7;font-size:18px;font-weight:700">{{ selectedNotif.description }}</span>
          </div>
          <div style="color:rgba(255,255,255,0.55);font-size:13px;margin-top:8px">
            Seus selos foram adicionados ao seu perfil automaticamente.
          </div>
        </template>

      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineComponent, h, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useNotificationsStore } from '@/stores/notifications'
import { useToastStore } from '@/stores/toast'

const display = useDisplay()
const notifStore = useNotificationsStore()
const toast = useToastStore()

const open = ref(false)
const activeTab = ref('unread')
const accepting = ref(null)
const declining = ref(null)
const selectedNotif = ref(null)
const detailOpen = ref(false)

function relativeTime(date) {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

function onMenuToggle(val) {
  if (val) {
    notifStore.fetchAll()
  } else {
    notifStore.markAllAsRead()
  }
}

function openDetail(notif) {
  selectedNotif.value = notif
  detailOpen.value = true
}

async function handleAccept(memberId) {
  accepting.value = memberId
  try {
    await notifStore.acceptInvite(memberId)
    toast.notify('Você entrou no grupo!', 'success')
    detailOpen.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao aceitar convite.', 'error')
  } finally {
    accepting.value = null
  }
}

async function handleDecline(memberId) {
  declining.value = memberId
  try {
    await notifStore.declineInvite(memberId)
    toast.notify('Convite recusado.', 'success')
    detailOpen.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao recusar convite.', 'error')
  } finally {
    declining.value = null
  }
}

onMounted(() => {
  notifStore.fetchAll()
})

const NotifRow = defineComponent({
  props: {
    notif: Object,
    read: { type: Boolean, default: false },
    accepting: { type: String, default: null },
    declining: { type: String, default: null },
  },
  emits: ['open', 'accept', 'decline'],
  setup(props, { emit }) {
    return () => {
      const n = props.notif
      const isInvite = n.type === 'invite'
      const diff = Date.now() - n.timestamp.getTime()
      const mins = Math.floor(diff / 60000)
      let timeStr = 'agora'
      if (mins >= 1 && mins < 60) timeStr = `${mins}m`
      else if (mins >= 60 && mins < 1440) timeStr = `${Math.floor(mins / 60)}h`
      else if (mins >= 1440) timeStr = `${Math.floor(mins / 1440)}d`

      return h('div', {
        style: 'border-bottom:1px solid rgba(255,255,255,0.08);padding:12px 16px;cursor:pointer',
        onClick: () => emit('open', n),
      }, [
        h('div', { style: 'display:flex;align-items:flex-start;gap:10px' }, [
          h('div', { style: 'margin-top:2px;flex-shrink:0' }, [
            h('v-icon', {
              icon: isInvite ? 'mdi-email-outline' : 'mdi-seal',
              color: '#ffffff',
              size: 20,
            }),
          ]),
          h('div', { style: 'flex:1;min-width:0' }, [
            h('div', { style: 'display:flex;align-items:center;gap:4px;margin-bottom:4px' }, [
              h('span', {
                style: 'color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase',
              }, isInvite ? 'CONVITES' : 'SELOS'),
              h('span', { style: 'color:rgba(255,255,255,0.45);font-size:10px' }, `· ${timeStr} atrás`),
            ]),
            h('div', {
              style: 'color:#fff;font-size:13px;font-weight:500;line-height:1.3;margin-bottom:2px',
            }, n.title),
            isInvite
              ? h('div', { style: 'color:rgba(255,255,255,0.6);font-size:12px' }, n.description)
              : h('div', {
                  style: 'display:flex;align-items:center;gap:4px',
                }, [
                  h('v-icon', { icon: 'mdi-seal', size: 13, color: '#a5d6a7' }),
                  h('span', { style: 'color:#a5d6a7;font-size:12px;font-weight:600' }, n.description),
                ]),
          ]),
        ]),
      ])
    }
  },
})
</script>

<style>
.notif-scroll::-webkit-scrollbar {
  width: 4px;
}
.notif-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.notif-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 4px;
}
.notif-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.6);
}
</style>
