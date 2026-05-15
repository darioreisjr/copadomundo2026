import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useGamesStore = defineStore('games', () => {
  const games = ref([])
  const loading = ref(false)

  async function fetchGames() {
    loading.value = true
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('match_date', { ascending: true })
    if (error) throw error
    games.value = data
    loading.value = false
  }

  async function fetchGame(id) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async function createGame(gameData) {
    const { data, error } = await supabase
      .from('games')
      .insert(gameData)
      .select()
      .single()
    if (error) throw error
    games.value.push(data)
    return data
  }

  async function updateGame(id, updates) {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const idx = games.value.findIndex(g => g.id === id)
    if (idx !== -1) games.value[idx] = data
    return data
  }

  async function setResult(id, scoreA, scoreB) {
    const { error: updateError } = await supabase
      .from('games')
      .update({ score_a: scoreA, score_b: scoreB, status: 'finished' })
      .eq('id', id)
    if (updateError) throw updateError

    const { error: calcError } = await supabase.rpc('recalculate_game_bets', { p_game_id: id })
    if (calcError) throw calcError

    await fetchGames()
  }

  return { games, loading, fetchGames, fetchGame, createGame, updateGame, setResult }
})
