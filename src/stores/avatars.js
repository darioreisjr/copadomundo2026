import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export const useAvatarsStore = defineStore('avatars', () => {
  const avatars           = ref([])
  const loading           = ref(false)
  const error             = ref(null)
  const unlockedAvatarIds = ref(new Set())

  const defaultAvatarUrl = computed(() =>
    avatars.value.find(a => a.is_default)?.url ?? null
  )

  async function fetchAvatars() {
    loading.value = true
    error.value   = null
    const { data, error: err } = await supabase
      .from('avatars')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) { error.value = err.message; loading.value = false; throw err }
    avatars.value = data
    loading.value = false
  }

  async function addAvatar(avatarData) {
    const auth = useAuthStore()
    const { data, error: err } = await supabase
      .from('avatars')
      .insert({ ...avatarData, created_by: auth.user.id })
      .select()
      .single()
    if (err) throw err
    avatars.value.unshift(data)
    return data
  }

  async function updateAvatar(id, updates) {
    const { data, error: err } = await supabase
      .from('avatars')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    const idx = avatars.value.findIndex(a => a.id === id)
    if (idx !== -1) avatars.value[idx] = data
    return data
  }

  async function deactivateAvatar(id) {
    return updateAvatar(id, { active: false })
  }

  async function activateAvatar(id) {
    return updateAvatar(id, { active: true })
  }

  async function deleteAvatar(id) {
    const { error: err } = await supabase.from('avatars').delete().eq('id', id)
    if (err) throw err
    avatars.value = avatars.value.filter(a => a.id !== id)
  }

  async function fetchUnlockedAvatars() {
    const { data, error: err } = await supabase
      .from('user_avatar_unlocks')
      .select('avatar_id')
    if (err) throw err
    unlockedAvatarIds.value = new Set(data.map(r => r.avatar_id))
  }

  async function unlockAvatar(avatarId) {
    const { data, error: err } = await supabase.rpc('unlock_avatar', { p_avatar_id: avatarId })
    if (err) throw err
    if (!data.success) throw new Error(data.reason)
    unlockedAvatarIds.value = new Set([...unlockedAvatarIds.value, avatarId])
    return data
  }

  async function setDefaultAvatar(avatarId) {
    const { error: err } = await supabase.rpc('set_default_avatar', { p_avatar_id: avatarId })
    if (err) throw err
    avatars.value = avatars.value.map(a => ({ ...a, is_default: a.id === avatarId }))
  }

  async function uploadAvatarImage(file) {
    const ext      = file.name.split('.').pop()
    const filename = `${crypto.randomUUID()}.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(filename, file, { upsert: false })
    if (uploadErr) throw uploadErr
    const { data } = supabase.storage.from('avatars').getPublicUrl(filename)
    return data.publicUrl
  }

  return {
    avatars, loading, error,
    unlockedAvatarIds, defaultAvatarUrl,
    fetchAvatars, addAvatar, updateAvatar,
    deactivateAvatar, activateAvatar, deleteAvatar, uploadAvatarImage,
    fetchUnlockedAvatars, unlockAvatar, setDefaultAvatar,
  }
})
