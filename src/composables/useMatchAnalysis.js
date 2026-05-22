import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { analyzeMatch } from '@/lib/gemini'

export function useMatchAnalysis() {
  const analysis = ref(null)
  const loadingAnalysis = ref(false)

  async function loadAnalysis(gameId, teamA, teamB) {
    if (loadingAnalysis.value) return
    loadingAnalysis.value = true
    try {
      const { data } = await supabase
        .from('match_analyses')
        .select('*')
        .eq('game_id', gameId)
        .single()

      if (data) {
        analysis.value = data
        return
      }

      const result = await analyzeMatch(teamA, teamB)

      await supabase
        .from('match_analyses')
        .insert({ game_id: gameId, ...result })
        .then(({ error }) => { if (error && error.code !== '23505') throw error })

      analysis.value = result
    } finally {
      loadingAnalysis.value = false
    }
  }

  return { analysis, loadingAnalysis, loadAnalysis }
}
