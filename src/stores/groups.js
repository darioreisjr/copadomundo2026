import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useGroupsStore = defineStore('groups', () => {
  const myGroups = ref([])
  const pendingInvites = ref([])
  const groupMembers = ref([])
  const groupRanking = ref([])
  const loading = ref(false)

  async function fetchMyGroups() {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()

    // Grupos que sou dono
    const { data: owned, error: e1 } = await supabase
      .from('groups')
      .select('*, group_members(id, user_id, status, invited_by, profiles:user_id(name, username, avatar_url))')
      .eq('owner_id', user.id)

    if (e1) throw e1

    // Grupos onde sou membro ativo (não dono)
    const { data: memberships, error: e2 } = await supabase
      .from('group_members')
      .select('group_id, groups(*, group_members(id, user_id, status, invited_by, profiles:user_id(name, username, avatar_url)))')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .neq('groups.owner_id', user.id)

    if (e2) throw e2

    const memberGroups = (memberships || [])
      .map(m => m.groups)
      .filter(g => g && g.owner_id !== user.id)

    myGroups.value = [...(owned || []), ...memberGroups]
    loading.value = false
  }

  async function fetchPendingInvites() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('group_members')
      .select('id, group_id, created_at, groups(id, name), profiles:invited_by(name, username)')
      .eq('user_id', user.id)
      .eq('status', 'pending')

    if (error) throw error
    pendingInvites.value = data || []
  }

  async function uploadGroupImage(file) {
    const ext      = file.name.split('.').pop()
    const filename = `${crypto.randomUUID()}.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('group-images')
      .upload(filename, file, { upsert: false })
    if (uploadErr) throw uploadErr
    const { data } = supabase.storage.from('group-images').getPublicUrl(filename)
    return data.publicUrl
  }

  async function createGroup({ name, description, is_public, image_url }) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: group, error } = await supabase
      .from('groups')
      .insert({ name, description: description || null, is_public: !!is_public, image_url: image_url || null, owner_id: user.id })
      .select()
      .single()

    if (error) throw error

    // Insere o dono como membro ativo
    const { error: e2 } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id, status: 'active', invited_by: user.id })

    if (e2) throw e2
    await fetchMyGroups()
    return group
  }

  async function inviteByUsername(groupId, username) {
    // Busca o perfil pelo username (sem o @)
    const clean = username.replace(/^@/, '').toLowerCase()
    const { data: profile, error: e1 } = await supabase
      .from('profiles')
      .select('id, name, username')
      .eq('username', clean)
      .maybeSingle()

    if (e1) throw e1
    if (!profile) {
      const err = new Error('Usuário não encontrado. Verifique o @username.')
      err.code = 'user_not_found'
      throw err
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (profile.id === user.id) {
      const err = new Error('Você não pode convidar a si mesmo.')
      err.code = 'self_invite'
      throw err
    }

    const { error: e2 } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: profile.id, status: 'pending', invited_by: user.id })

    if (e2) {
      if (e2.code === '23505') {
        const err = new Error('Este usuário já é membro ou tem um convite pendente.')
        err.code = 'already_member'
        throw err
      }
      throw e2
    }

    return profile
  }

  async function acceptInvite(memberId) {
    const { error } = await supabase
      .from('group_members')
      .update({ status: 'active' })
      .eq('id', memberId)

    if (error) throw error
    await fetchPendingInvites()
    await fetchMyGroups()
  }

  async function declineInvite(memberId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId)

    if (error) throw error
    await fetchPendingInvites()
  }

  async function removeFromGroup(groupId, userId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId)

    if (error) throw error
    await fetchGroupMembers(groupId)
  }

  async function leaveGroup(groupId) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user?.id)
    if (error) throw error
    await fetchMyGroups()
  }

  async function deleteGroup(groupId) {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId)

    if (error) throw error
    await fetchMyGroups()
  }

  async function fetchGroupMembers(groupId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('id, user_id, status, invited_by, created_at, profiles:user_id(name, username, avatar_url)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })

    if (error) throw error
    groupMembers.value = data || []
  }

  async function fetchGroupRanking(groupId) {
    const { data: members, error: e1 } = await supabase
      .from('group_members')
      .select('user_id, profiles:user_id(name, username, avatar_url)')
      .eq('group_id', groupId)
      .eq('status', 'active')

    if (e1) throw e1

    const userIds = (members || []).map(m => m.user_id)
    if (!userIds.length) {
      groupRanking.value = []
      return
    }

    const { data, error: e2 } = await supabase
      .from('ranking')
      .select('*, profiles(name, username, avatar_url)')
      .in('user_id', userIds)

    if (e2) throw e2

    const rankingMap = Object.fromEntries((data || []).map(r => [r.user_id, r]))

    const merged = members.map(m => rankingMap[m.user_id] ?? {
      user_id: m.user_id,
      profiles: m.profiles,
      total_points: 0,
      exact_hits: 0,
      winner_hits: 0,
      draw_hits: 0,
      total_bets: 0,
    })

    merged.sort((a, b) =>
      b.total_points - a.total_points ||
      b.exact_hits - a.exact_hits ||
      b.winner_hits - a.winner_hits ||
      b.total_bets - a.total_bets
    )

    groupRanking.value = merged
  }

  async function fetchGroup(groupId) {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (error) throw error
    return data
  }

  async function searchPublicGroups(query) {
    const { data, error } = await supabase
      .from('groups')
      .select('*, group_members(id, user_id, status)')
      .eq('is_public', true)
      .ilike('name', `%${query}%`)
      .limit(10)
    if (error) throw error
    return data || []
  }

  async function fetchRandomPublicGroup() {
    const { data, error } = await supabase
      .from('groups')
      .select('id, name, image_url, description, owner_id, is_public, group_members(id, user_id, status)')
      .eq('is_public', true)
      .limit(50)
    if (error) throw error
    if (!data?.length) return null
    return data[Math.floor(Math.random() * data.length)]
  }

  async function joinGroup(groupId) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: user?.id, status: 'active' })
    if (error) throw error
    await fetchMyGroups()
  }

  return {
    myGroups, pendingInvites, groupMembers, groupRanking, loading,
    fetchMyGroups, fetchPendingInvites, createGroup, uploadGroupImage, inviteByUsername,
    acceptInvite, declineInvite, removeFromGroup, deleteGroup,
    fetchGroupMembers, fetchGroupRanking, fetchGroup,
    searchPublicGroups, fetchRandomPublicGroup, joinGroup, leaveGroup,
  }
})
