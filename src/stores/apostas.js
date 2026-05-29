import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const WAGER_SELECT = `
  *,
  games(id, team_a, team_b, flag_a, flag_b, match_date, status, bet_closes_at),
  creator:creator_id(id, name, username, avatar_url, nome_fantasia),
  winner:winner_id(id, name, username, avatar_url, nome_fantasia),
  target:target_user_id(id, name, username, avatar_url, nome_fantasia),
  wager_participants(user_id, profiles:user_id(id, name, username, avatar_url, nome_fantasia))
`

const ERROR_MESSAGES = {
  invalid_wager_type:       'Tipo de aposta inválido.',
  amount_too_low:           'O valor mínimo é 1 selo.',
  game_not_found:           'Jogo não encontrado.',
  game_not_open:            'Este jogo não está mais aberto para apostas.',
  bet_window_closed:        'A janela de palpites deste jogo está encerrada.',
  no_palpite:               'Você precisa fazer seu palpite antes de criar uma aposta.',
  insufficient_seals:       'Você não tem selos suficientes para esta aposta.',
  target_required_for_direct: 'Informe o @usuário para o duelo direto.',
  target_user_not_found:    'Usuário não encontrado. Verifique o @username.',
  cannot_challenge_self:    'Você não pode se desafiar.',
  invalid_max_participants: 'O grupo deve ter entre 2 e 9 participantes.',
  wager_not_found:          'Aposta não encontrada.',
  wager_not_pending:        'Esta aposta não está mais disponível.',
  cannot_accept_own_wager:  'Você não pode aceitar sua própria aposta.',
  not_the_target:           'Esta aposta é um duelo direto para outro usuário.',
  game_closed:              'O jogo já encerrou, não é possível aceitar apostas.',
  already_participating:    'Você já participa desta aposta.',
  not_the_creator:          'Apenas o criador pode cancelar a aposta.',
  cannot_cancel_active_wager: 'Não é possível cancelar uma aposta que já foi aceita.',
}

function mapError(err) {
  const msg = err?.message ?? ''
  for (const [key, text] of Object.entries(ERROR_MESSAGES)) {
    if (msg.includes(key)) return text
  }
  return 'Ocorreu um erro. Tente novamente.'
}

export const useApostasStore = defineStore('apostas', () => {
  const myWagers        = ref([])
  const openWagers      = ref([])
  const directChallenges = ref([])
  const loading         = ref(false)
  const creating        = ref(false)
  const accepting       = ref(false)

  const activeWagers = computed(() =>
    myWagers.value.filter(w => ['pending', 'active'].includes(w.status))
  )

  const settledWagers = computed(() =>
    myWagers.value.filter(w => ['settled_win', 'settled_tie', 'cancelled'].includes(w.status))
  )

  const totalSealsAtStake = computed(() => {
    const auth = useAuthStore()
    const uid = auth.user?.id
    if (!uid) return 0
    return activeWagers.value.reduce((sum, w) => {
      const isParticipant =
        w.creator_id === uid ||
        (w.wager_participants || []).some(p => p.user_id === uid)
      return isParticipant ? sum + w.amount : sum
    }, 0)
  })

  const wonCount = computed(() =>
    myWagers.value.filter(w => w.status === 'settled_win' && w.winner_id === useAuthStore().user?.id).length
  )

  async function fetchMyWagers() {
    const auth = useAuthStore()
    const uid = auth.user?.id
    if (!uid) return

    loading.value = true
    try {
      const [{ data: created }, { data: participantRows }] = await Promise.all([
        supabase.from('wagers').select(WAGER_SELECT).eq('creator_id', uid).order('created_at', { ascending: false }),
        supabase.from('wager_participants').select('wager_id').eq('user_id', uid),
      ])

      let joined = []
      const joinedIds = (participantRows || []).map(r => r.wager_id)
      if (joinedIds.length > 0) {
        const { data } = await supabase
          .from('wagers')
          .select(WAGER_SELECT)
          .in('id', joinedIds)
          .order('created_at', { ascending: false })
        joined = data || []
      }

      const all = [...(created || []), ...joined]
      const seen = new Set()
      myWagers.value = all.filter(w => {
        if (seen.has(w.id)) return false
        seen.add(w.id)
        return true
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } finally {
      loading.value = false
    }
  }

  async function fetchOpenWagers(gameId = null) {
    const auth = useAuthStore()
    const uid = auth.user?.id
    if (!uid) return

    loading.value = true
    try {
      let query = supabase
        .from('wagers')
        .select(WAGER_SELECT)
        .eq('status', 'pending')
        .in('wager_type', ['open', 'group'])
        .neq('creator_id', uid)
        .order('created_at', { ascending: false })

      if (gameId) query = query.eq('game_id', gameId)

      const { data } = await query
      openWagers.value = data || []
    } finally {
      loading.value = false
    }
  }

  async function fetchDirectChallenges() {
    const auth = useAuthStore()
    const uid = auth.user?.id
    if (!uid) return

    const { data } = await supabase
      .from('wagers')
      .select(WAGER_SELECT)
      .eq('wager_type', 'direct')
      .eq('target_user_id', uid)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    directChallenges.value = data || []
  }

  async function createWager({ gameId, wagerType, amount, maxParticipants = 1, targetUsername = null, message = null }) {
    creating.value = true
    try {
      const { data, error } = await supabase.rpc('create_wager', {
        p_game_id:          gameId,
        p_wager_type:       wagerType,
        p_amount:           amount,
        p_max_participants: maxParticipants,
        p_target_username:  targetUsername,
        p_message:          message,
      })
      if (error) throw new Error(mapError(error))
      const auth = useAuthStore()
      await auth.fetchProfile()
      await fetchMyWagers()
      return { success: true, wager: data }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      creating.value = false
    }
  }

  async function acceptWager(wagerId) {
    accepting.value = true
    try {
      const { error } = await supabase.rpc('accept_wager', { p_wager_id: wagerId })
      if (error) throw new Error(mapError(error))
      const auth = useAuthStore()
      await auth.fetchProfile()
      await Promise.all([fetchMyWagers(), fetchOpenWagers(), fetchDirectChallenges()])
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      accepting.value = false
    }
  }

  async function cancelWager(wagerId) {
    try {
      const { error } = await supabase.rpc('cancel_wager', { p_wager_id: wagerId })
      if (error) throw new Error(mapError(error))
      const auth = useAuthStore()
      await auth.fetchProfile()
      await fetchMyWagers()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    myWagers, openWagers, directChallenges,
    loading, creating, accepting,
    activeWagers, settledWagers, totalSealsAtStake, wonCount,
    fetchMyWagers, fetchOpenWagers, fetchDirectChallenges,
    createWager, acceptWager, cancelWager,
  }
})
