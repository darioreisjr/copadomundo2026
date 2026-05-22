import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export const useBetsStore = defineStore('bets', () => {
  const bets = ref([])
  const loading = ref(false)

  async function fetchMyBets() {
    const auth = useAuthStore()
    loading.value = true
    const { data, error } = await supabase
      .from('bets')
      .select('*, games(*)')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    bets.value = data
    loading.value = false
  }

  async function getBetForGame(gameId) {
    const auth = useAuthStore()
    const { data } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', auth.user.id)
      .eq('game_id', gameId)
      .maybeSingle()
    return data
  }

  // Debita 30 selos para liberar edição de palpite existente
  async function deductSealsForUpdate() {
    const auth = useAuthStore()
    const { error } = await supabase
      .from('profiles')
      .update({ total_seals: (auth.profile?.total_seals ?? 0) - 30 })
      .eq('id', auth.user.id)
    if (error) throw error
    await auth.fetchProfile()
  }

  async function saveBet(gameId, scoreA, scoreB) {
    const auth = useAuthStore()
    const existing = await getBetForGame(gameId)

    if (existing) {
      const { error } = await supabase
        .from('bets')
        .update({ score_a: scoreA, score_b: scoreB, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('bets')
        .insert({ user_id: auth.user.id, game_id: gameId, score_a: scoreA, score_b: scoreB })
      if (error) throw error
    }

    await fetchMyBets()
  }

  function totalPoints() {
    return bets.value.reduce((sum, b) => sum + (b.points ?? 0), 0)
  }

  return { bets, loading, fetchMyBets, getBetForGame, deductSealsForUpdate, saveBet, totalPoints }
})
