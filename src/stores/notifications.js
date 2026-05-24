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

    const groupsStore = useGroupsStore()
    if (!groupsStore.myGroups.length) {
      await groupsStore.fetchMyGroups()
    }
    const ownerGroupIds = groupsStore.myGroups
      .filter(g => g.owner_id === userId)
      .map(g => g.id)

    const queries = [
      supabase
        .from('group_members')
        .select('id, group_id, created_at, groups(id, name), profiles:invited_by(name, username, nome_fantasia)')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .not('invited_by', 'is', null),
      supabase
        .from('user_seals')
        .select('id, event_key, seals, awarded_at')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false })
        .limit(30),
      supabase
        .from('notifications')
        .select('id, type, title, description, read, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30),
    ]

    if (ownerGroupIds.length) {
      queries.push(
        supabase
          .from('group_members')
          .select('id, group_id, user_id, created_at, groups(id, name), profiles:user_id(name, username, nome_fantasia)')
          .is('invited_by', null)
          .eq('status', 'pending')
          .in('group_id', ownerGroupIds)
      )
    }

    const results = await Promise.all(queries)
    const invites = results[0].data
    const sealRows = results[1].data
    const persistedNotifs = results[2]?.data ?? []
    const requests = results[3]?.data ?? []

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
          read: false,
          memberId: inv.id,
          sealsAmount: null,
          sealLabel: null,
        }
      }),
      ...(requests || []).map(req => {
        const id = `request-${req.id}`
        const p = req.profiles
        const displayName = p?.nome_fantasia || p?.name || (p?.username ? `@${p.username}` : 'Alguém')
        const displayHandle = p?.username ? `@${p.username}` : displayName
        return {
          id,
          type: 'join_request',
          title: `Solicitação para ${req.groups?.name ?? 'seu grupo'}`,
          description: `${displayHandle} quer entrar no grupo`,
          timestamp: new Date(req.created_at),
          read: false,
          memberId: req.id,
          sealsAmount: null,
          sealLabel: null,
        }
      }),
      ...(persistedNotifs || []).map(n => ({
        id: `persisted-${n.id}`,
        dbId: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        timestamp: new Date(n.created_at),
        read: n.read,
        memberId: null,
        sealsAmount: null,
        sealLabel: null,
      })),
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

  async function markAllAsRead() {
    const readIds = _loadReadIds()
    const dbIds = []
    notifications.value.forEach(n => {
      if (n.type === 'invite') return
      readIds.add(n.id)
      n.read = true
      if (n.dbId) dbIds.push(n.dbId)
    })
    _saveReadIds(readIds)
    if (dbIds.length) {
      await supabase.from('notifications').update({ read: true }).in('id', dbIds)
    }
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

  async function acceptJoinRequest(memberId) {
    const groupsStore = useGroupsStore()
    await groupsStore.acceptJoinRequest(memberId)
    notifications.value = notifications.value.filter(n => n.memberId !== memberId)
    await fetchAll()
  }

  async function rejectJoinRequest(memberId) {
    const groupsStore = useGroupsStore()
    await groupsStore.rejectJoinRequest(memberId)
    notifications.value = notifications.value.filter(n => n.memberId !== memberId)
    await fetchAll()
  }

  return {
    notifications, loading,
    unreadCount, unreadNotifications, readNotifications,
    fetchAll, markAllAsRead, acceptInvite, declineInvite,
    acceptJoinRequest, rejectJoinRequest,
  }
})
