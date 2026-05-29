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
              :invite-cost="inviteCost"
              :invite-has-enough-seals="inviteHasEnoughSeals"
              @open="openDetail"
              @accept="handleAccept"
              @decline="handleDecline"
              @accept-request="handleAcceptRequest"
              @reject-request="handleRejectRequest"
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
              :invite-cost="inviteCost"
              :invite-has-enough-seals="inviteHasEnoughSeals"
              @open="openDetail"
              @accept="handleAccept"
              @decline="handleDecline"
              @accept-request="handleAcceptRequest"
              @reject-request="handleRejectRequest"
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
          :icon="detailIcon(selectedNotif.type)"
          size="80"
          color="white"
        />
      </div>

      <!-- Corpo -->
      <div style="padding:24px 28px 28px">

        <!-- Categoria + tempo -->
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:14px">
          <v-icon
            :icon="detailIcon(selectedNotif.type)"
            size="13"
            style="color:rgba(255,255,255,0.5)"
          />
          <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">
            {{ detailCategory(selectedNotif.type) }}
          </span>
          <span style="color:rgba(255,255,255,0.4);font-size:11px">· {{ relativeTime(selectedNotif.timestamp) }} atrás</span>
        </div>

        <!-- Título -->
        <div style="color:#fff;font-size:20px;font-weight:700;line-height:1.3;margin-bottom:10px">
          {{ selectedNotif.title }}
        </div>

        <!-- Descrição por tipo -->
        <template v-if="selectedNotif.type === 'invite'">
          <div style="color:rgba(255,255,255,0.65);font-size:14px;margin-bottom:16px">
            {{ selectedNotif.description }}
          </div>

          <!-- Aviso de custo ao aceitar convite quando já atingiu o limite gratuito -->
          <div
            v-if="!selectedNotif.read && inviteCost > 0"
            style="background:rgba(255,193,7,0.15);border:1px solid rgba(255,193,7,0.4);border-radius:8px;padding:12px;margin-bottom:16px"
          >
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <v-icon icon="mdi-seal" size="16" color="#ffd54f" />
              <span style="color:#ffd54f;font-size:12px;font-weight:700">Entrada com custo</span>
            </div>
            <div style="color:rgba(255,255,255,0.8);font-size:13px">
              Você já está em <strong style="color:#fff">{{ inviteMembershipCount }}</strong> grupo{{ inviteMembershipCount !== 1 ? 's' : '' }} como membro.
              Aceitar este convite custará <strong style="color:#ffd54f">{{ groups.GROUP_JOIN_COST }} selos</strong>.
            </div>
            <div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:4px">
              Saldo atual: {{ auth.profile?.total_seals ?? 0 }} selos
            </div>
          </div>

          <!-- Selos insuficientes -->
          <div
            v-if="!selectedNotif.read && inviteCost > 0 && !inviteHasEnoughSeals"
            style="background:rgba(244,67,54,0.15);border:1px solid rgba(244,67,54,0.4);border-radius:8px;padding:10px;margin-bottom:16px"
          >
            <div style="color:#ef9a9a;font-size:13px">
              Selos insuficientes para aceitar. Você precisa de <strong>{{ groups.GROUP_JOIN_COST }} selos</strong> mas tem apenas <strong>{{ auth.profile?.total_seals ?? 0 }}</strong>.
            </div>
          </div>

          <div v-if="!selectedNotif.read" style="display:flex;gap:12px">
            <v-btn
              color="green-lighten-1"
              variant="tonal"
              rounded="lg"
              :disabled="inviteCost > 0 && !inviteHasEnoughSeals"
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

        <template v-else-if="selectedNotif.type === 'join_request'">
          <div style="color:rgba(255,255,255,0.65);font-size:14px;margin-bottom:16px">
            {{ selectedNotif.description }}
          </div>

          <!-- Badge: solicitante reservou selos -->
          <div
            v-if="selectedNotif.sealsLocked > 0"
            style="background:rgba(165,214,167,0.15);border:1px solid rgba(165,214,167,0.35);border-radius:8px;padding:10px;margin-bottom:16px"
          >
            <div style="display:flex;align-items:center;gap:6px">
              <v-icon icon="mdi-seal" size="15" color="#a5d6a7" />
              <span style="color:#a5d6a7;font-size:12px;font-weight:700">{{ selectedNotif.sealsLocked }} selos reservados</span>
            </div>
            <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:2px">
              Se aceito, os selos são descontados. Se rejeitado, são devolvidos ao solicitante.
            </div>
          </div>

          <div style="display:flex;gap:12px">
            <v-btn
              color="green-lighten-1"
              variant="tonal"
              rounded="lg"
              :loading="accepting === selectedNotif.memberId"
              @click="handleAcceptRequest(selectedNotif.memberId)"
            >
              Aceitar
            </v-btn>
            <v-btn
              color="red-lighten-2"
              variant="text"
              rounded="lg"
              :loading="declining === selectedNotif.memberId"
              @click="handleRejectRequest(selectedNotif.memberId)"
            >
              Rejeitar
            </v-btn>
          </div>
        </template>

        <template v-else-if="selectedNotif.type === 'group_created'">
          <div style="color:rgba(255,255,255,0.65);font-size:14px;margin-bottom:8px">
            {{ selectedNotif.description }}
          </div>
        </template>

        <template v-else-if="selectedNotif.type?.startsWith('wager_')">
          <div style="color:rgba(255,255,255,0.75);font-size:14px;margin-bottom:8px">
            {{ selectedNotif.description }}
          </div>
          <v-btn
            v-if="selectedNotif.wagerId"
            color="green-lighten-1"
            variant="tonal"
            rounded="lg"
            size="small"
            prepend-icon="mdi-handshake"
            :to="{ name: 'Apostas' }"
            @click="detailOpen = false"
          >
            Ver Apostas
          </v-btn>
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

  <!-- Dialog de confirmação: aceitar convite com custo -->
  <v-dialog v-model="inviteConfirmOpen" max-width="380" persistent>
    <v-card rounded="lg">
      <v-card-title class="pt-4 px-4 font-weight-bold d-flex align-center gap-2">
        <v-icon icon="mdi-seal" color="amber-darken-2" />
        Aceitar convite com custo
      </v-card-title>
      <v-card-text class="px-4">
        <p class="mb-3">
          Você já está em <strong>{{ inviteMembershipCount }}</strong> grupo{{ inviteMembershipCount !== 1 ? 's' : '' }} como membro.
          Para aceitar este convite serão descontados <strong>{{ groups.GROUP_JOIN_COST }} selos</strong>.
        </p>
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
          rounded="lg"
          icon="mdi-seal"
        >
          Saldo atual: <strong>{{ auth.profile?.total_seals ?? 0 }} selos</strong>.
          Após aceitar: <strong>{{ (auth.profile?.total_seals ?? 0) - groups.GROUP_JOIN_COST }} selos</strong>.
        </v-alert>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" rounded="lg" @click="inviteConfirmOpen = false">Cancelar</v-btn>
        <v-btn
          color="green-darken-2"
          variant="tonal"
          rounded="lg"
          :loading="accepting === pendingInviteMemberId"
          @click="confirmAcceptInvite"
        >
          Confirmar e aceitar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineComponent, h, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useNotificationsStore } from '@/stores/notifications'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const display = useDisplay()
const notifStore = useNotificationsStore()
const groups = useGroupsStore()
const auth = useAuthStore()
const toast = useToastStore()

const open = ref(false)
const activeTab = ref('unread')
const accepting = ref(null)
const declining = ref(null)
const selectedNotif = ref(null)
const detailOpen = ref(false)

// Dialog de confirmação para aceitar convite com custo
const inviteConfirmOpen = ref(false)
const pendingInviteMemberId = ref(null)

// Contagem de memberships do usuário logado (não donos) — para validar custo no convite
const inviteMembershipCount = computed(() => {
  const uid = auth.user?.id
  return groups.myGroups.filter(g => g.owner_id !== uid).length
})
const inviteCost = computed(() =>
  inviteMembershipCount.value >= groups.FREE_MEMBERSHIPS ? groups.GROUP_JOIN_COST : 0
)
const inviteHasEnoughSeals = computed(() =>
  (auth.profile?.total_seals ?? 0) >= groups.GROUP_JOIN_COST
)

function detailIcon(type) {
  if (type === 'invite') return 'mdi-email-outline'
  if (type === 'join_request') return 'mdi-account-plus'
  if (type === 'group_created') return 'mdi-account-group'
  if (type === 'wager_challenge') return 'mdi-sword-cross'
  if (type === 'wager_accepted') return 'mdi-handshake'
  if (type === 'wager_won') return 'mdi-trophy'
  if (type === 'wager_lost') return 'mdi-emoticon-sad-outline'
  if (type === 'wager_tied' || type === 'wager_cancelled') return 'mdi-handshake-outline'
  return 'mdi-seal'
}

function detailCategory(type) {
  if (type === 'invite') return 'CONVITES'
  if (type === 'join_request') return 'SOLICITAÇÕES'
  if (type === 'group_created' || type === 'request_result') return 'GRUPOS'
  if (type?.startsWith('wager_')) return 'APOSTAS'
  return 'SELOS'
}

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
  // Se há custo, abre dialog de confirmação em vez de aceitar direto
  if (inviteCost.value > 0) {
    if (!inviteHasEnoughSeals.value) {
      toast.notify(
        `Selos insuficientes. Você precisa de ${groups.GROUP_JOIN_COST} selos para entrar em mais grupos.`,
        'error'
      )
      return
    }
    pendingInviteMemberId.value = memberId
    inviteConfirmOpen.value = true
    return
  }
  await _doAcceptInvite(memberId)
}

async function confirmAcceptInvite() {
  await _doAcceptInvite(pendingInviteMemberId.value)
  inviteConfirmOpen.value = false
  pendingInviteMemberId.value = null
}

async function _doAcceptInvite(memberId) {
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

async function handleAcceptRequest(memberId) {
  accepting.value = memberId
  try {
    await notifStore.acceptJoinRequest(memberId)
    toast.notify('Solicitação aceita! O usuário agora é membro do grupo.', 'success')
    detailOpen.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao aceitar solicitação.', 'error')
  } finally {
    accepting.value = null
  }
}

async function handleRejectRequest(memberId) {
  declining.value = memberId
  try {
    await notifStore.rejectJoinRequest(memberId)
    toast.notify('Solicitação rejeitada.', 'info')
    detailOpen.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao rejeitar solicitação.', 'error')
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
    inviteCost: { type: Number, default: 0 },
    inviteHasEnoughSeals: { type: Boolean, default: true },
  },
  emits: ['open', 'accept', 'decline', 'accept-request', 'reject-request'],
  setup(props, { emit }) {
    return () => {
      const n = props.notif
      const isInvite = n.type === 'invite'
      const isRequest = n.type === 'join_request'
      const isRequestResult = n.type === 'request_result'
      const diff = Date.now() - n.timestamp.getTime()
      const mins = Math.floor(diff / 60000)
      let timeStr = 'agora'
      if (mins >= 1 && mins < 60) timeStr = `${mins}m`
      else if (mins >= 60 && mins < 1440) timeStr = `${Math.floor(mins / 60)}h`
      else if (mins >= 1440) timeStr = `${Math.floor(mins / 1440)}d`

      const isGroupCreated = n.type === 'group_created'
      const isWagerChallenge = n.type === 'wager_challenge'
      const isWagerAccepted  = n.type === 'wager_accepted'
      const isWagerWon       = n.type === 'wager_won'
      const isWagerLost      = n.type === 'wager_lost'
      const isWagerTied      = n.type === 'wager_tied'
      const isWagerCancelled = n.type === 'wager_cancelled'
      const isWager = isWagerChallenge || isWagerAccepted || isWagerWon || isWagerLost || isWagerTied || isWagerCancelled

      const wagerIcon = isWagerChallenge ? 'mdi-sword-cross'
        : isWagerAccepted ? 'mdi-handshake'
        : isWagerWon ? 'mdi-trophy'
        : isWagerLost ? 'mdi-emoticon-sad-outline'
        : 'mdi-handshake-outline'

      const iconName = isInvite ? 'mdi-email-outline'
        : isRequest ? 'mdi-account-plus'
        : isRequestResult ? (n.title.includes('aceita') ? 'mdi-account-check' : 'mdi-account-remove')
        : isGroupCreated ? 'mdi-account-group'
        : isWager ? wagerIcon
        : 'mdi-seal'

      const categoryLabel = isInvite ? 'CONVITES'
        : isRequest ? 'SOLICITAÇÕES'
        : (isRequestResult || isGroupCreated) ? 'GRUPOS'
        : isWager ? 'APOSTAS'
        : 'SELOS'

      const wagerDescColor = isWagerWon ? '#a5d6a7' : isWagerLost ? '#ef9a9a' : 'rgba(255,255,255,0.6)'
      const descLine = (isInvite || isRequest || isRequestResult || isGroupCreated)
        ? h('div', { style: 'color:rgba(255,255,255,0.6);font-size:12px' }, n.description)
        : isWager
        ? h('div', { style: `color:${wagerDescColor};font-size:12px` }, n.description)
        : h('div', { style: 'display:flex;align-items:center;gap:4px' }, [
            h('v-icon', { icon: 'mdi-seal', size: 13, color: '#a5d6a7' }),
            h('span', { style: 'color:#a5d6a7;font-size:12px;font-weight:600' }, n.description),
          ])

      // Badge de selos reservados (solicitação de entrada com custo)
      const sealBadge = (isRequest && (n.sealsLocked ?? 0) > 0)
        ? h('div', { style: 'display:flex;align-items:center;gap:4px;margin-top:3px' }, [
            h('v-icon', { icon: 'mdi-seal', size: 11, color: '#a5d6a7' }),
            h('span', { style: 'color:#a5d6a7;font-size:11px;font-weight:600' }, `${n.sealsLocked} selos reservados`),
          ])
        : null

      // Badge de custo para convites (quando usuário já atingiu o limite gratuito)
      const inviteCostBadge = (isInvite && props.inviteCost > 0)
        ? h('div', { style: 'display:flex;align-items:center;gap:4px;margin-top:3px' }, [
            h('v-icon', { icon: 'mdi-seal', size: 11, color: '#ffd54f' }),
            h('span', { style: 'color:#ffd54f;font-size:11px;font-weight:600' },
              props.inviteHasEnoughSeals ? `Custa ${props.inviteCost} selos` : `Sem selos (${props.inviteCost} necessários)`
            ),
          ])
        : null

      const children = [
        h('div', { style: 'display:flex;align-items:flex-start;gap:10px' }, [
          h('div', { style: 'margin-top:2px;flex-shrink:0' }, [
            h('v-icon', { icon: iconName, color: '#ffffff', size: 20 }),
          ]),
          h('div', { style: 'flex:1;min-width:0' }, [
            h('div', { style: 'display:flex;align-items:center;gap:4px;margin-bottom:4px' }, [
              h('span', {
                style: 'color:#fff;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase',
              }, categoryLabel),
              h('span', { style: 'color:rgba(255,255,255,0.45);font-size:10px' }, `· ${timeStr} atrás`),
            ]),
            h('div', {
              style: 'color:#fff;font-size:13px;font-weight:500;line-height:1.3;margin-bottom:2px',
            }, n.title),
            descLine,
            sealBadge,
            inviteCostBadge,
          ]),
        ]),
      ]

      // Botões inline para solicitações de entrada
      if (isRequest) {
        children.push(
          h('div', { style: 'display:flex;gap:8px;margin-top:8px;padding-left:30px' }, [
            h('v-btn', {
              size: 'x-small',
              color: 'green-lighten-1',
              variant: 'tonal',
              rounded: 'lg',
              loading: props.accepting === n.memberId,
              onClick: (e) => { e.stopPropagation(); emit('accept-request', n.memberId) },
            }, () => 'Aceitar'),
            h('v-btn', {
              size: 'x-small',
              color: 'red-lighten-2',
              variant: 'text',
              rounded: 'lg',
              loading: props.declining === n.memberId,
              onClick: (e) => { e.stopPropagation(); emit('reject-request', n.memberId) },
            }, () => 'Rejeitar'),
          ])
        )
      }

      return h('div', {
        style: 'border-bottom:1px solid rgba(255,255,255,0.08);padding:12px 16px;cursor:pointer',
        onClick: () => emit('open', n),
      }, children)
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
