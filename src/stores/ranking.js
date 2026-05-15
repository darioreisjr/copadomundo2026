import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useRankingStore = defineStore('ranking', () => {
  const entries = ref([])
  const loading = ref(false)

  async function fetchRanking() {
    loading.value = true
    const { data, error } = await supabase
      .from('ranking')
      .select('*, profiles(name)')
      .order('total_points', { ascending: false })
      .order('exact_hits', { ascending: false })
      .order('winner_hits', { ascending: false })
      .order('total_bets', { ascending: false })
    if (error) throw error
    entries.value = data
    loading.value = false
  }

  return { entries, loading, fetchRanking }
})
