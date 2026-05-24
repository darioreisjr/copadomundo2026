import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useGroupsStore } from '@/stores/groups'
import { useSealRewardsStore } from '@/stores/sealRewards'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const loading = ref(false)

  function _storageKey() {
    const auth = useAuthStore()
    return `notif_read_ids_${auth.user?.id ?? 'anon'}`
  }

  function _loadReadIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem(_storageKey()) || '[]'))
    } catch {
      return new Set()
    }
  }

  function _saveReadIds(set) {
    localStorage.setItem(_storageKey(), JSON.stringify([...set]))
  }

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.read))
  const readNotifications = computed(() => notifications.value.filter(n => n.read))

  async function fetchAll() {
    loading.value = true
    const auth = useAuthStore()
    const userId = auth.user?.id
    if (!userId) { loading.value = false; return }

    const sealRewardsStore = useSealRewardsStore()
    if (!sealRewardsStore.rewards.length) {
      await sealRewardsStore.fetchRewards()
    }
    const rewardMap = Object.fromEntries(
      sealRewardsStore.rewards.map(r => [r.event_key, r.label])
    )

    const [{ data: invites }, { data: sealRows }] = await Promise.all([
      supabase
        .from('group_members')
        .select('id, group_id, created_at, groups(id, name), profiles:invited_by(name, username, nome_fantasia)')
        .eq('user_id', userId)
        .eq('status', 'pending'),
      supabase
        .from('user_seals')
        .select('id, event_key, seals, awarded_at')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })
        .limit(30),
    ])

    const readIds = _loadReadIds()

    const mapped = [
      ...(invites || []).map(inv => {
        const id = `invite-${inv.id}`
        const p = inv.profiles
        const inviterName = p?.nome_fantasia || p?.name || (p?.username ? `@${p.username}` : 'alguém')
        const inviterDisplay = p?.username ? `@${p.username}` : inviterName
        return {
          id,
          type: 'invite',
          title: `Convite para ${inv.groups?.name ?? 'um grupo'}`,
          description: `Convidado por ${inviterDisplay}`,
          timestamp: new Date(inv.created_at),
          read: false, // convite pendente nunca é lido até aceitar/recusar
          memberId: inv.id,
          sealsAmount: null,
          sealLabel: null,
        }
      }),
      ...(sealRows || []).map(s => {
        const id = `seal-${s.id}`
        const label = rewardMap[s.event_key] ?? s.event_key
        return {
          id,
          type: 'seal',
          title: label,
          description: `+${s.seals} selos`,
          timestamp: new Date(s.awarded_at),
          read: readIds.has(id),
          memberId: null,
          sealsAmount: s.seals,
          sealLabel: label,
        }
      }),
    ]

    mapped.sort((a, b) => b.timestamp - a.timestamp)
    notifications.value = mapped
    loading.value = false
  }

  function markAllAsRead() {
    const readIds = _loadReadIds()
    notifications.value.forEach(n => {
      // Convites pendentes só são marcados como lidos após aceitar ou recusar
      if (n.type === 'invite') return
      readIds.add(n.id)
      n.read = true
    })
    _saveReadIds(readIds)
  }

  function _markInviteRead(memberId) {
    const readIds = _loadReadIds()
    const notif = notifications.value.find(n => n.memberId === memberId)
    if (notif) {
      readIds.add(notif.id)
      notif.read = true
    }
    _saveReadIds(readIds)
  }

  async function acceptInvite(memberId) {
    const groupsStore = useGroupsStore()
    await groupsStore.acceptInvite(memberId)
    _markInviteRead(memberId)
    notifications.value = notifications.value.filter(n => n.memberId !== memberId)
    await fetchAll()
  }

  async function declineInvite(memberId) {
    const groupsStore = useGroupsStore()
    await groupsStore.declineInvite(memberId)
    _markInviteRead(memberId)
    notifications.value = notifications.value.filter(n => n.memberId !== memberId)
    await fetchAll()
  }

  return {
    notifications, loading,
    unreadCount, unreadNotifications, readNotifications,
    fetchAll, markAllAsRead, acceptInvite, declineInvite,
  }
})
