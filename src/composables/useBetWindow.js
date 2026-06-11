import { ref, computed, onMounted, onUnmounted, unref } from 'vue'

export function useBetWindow(gameRef) {
  const now = ref(Date.now())
  let timer

  onMounted(() => {
    timer = setInterval(() => { now.value = Date.now() }, 30000)
  })
  onUnmounted(() => clearInterval(timer))

  const isOpen = computed(() => {
    const g = unref(gameRef)
    if (!g?.bet_opens_at || !g?.bet_closes_at) return g?.status === 'open'
    if (g.status === 'finished' || g.status === 'live') return false
    const t = now.value
    return t >= new Date(g.bet_opens_at).getTime() && t < new Date(g.bet_closes_at).getTime()
  })

  const isBeforeOpen = computed(() => {
    const g = unref(gameRef)
    if (!g?.bet_opens_at) return false
    return now.value < new Date(g.bet_opens_at).getTime()
  })

  const isAfterClose = computed(() => {
    const g = unref(gameRef)
    if (!g?.bet_closes_at) return false
    return now.value >= new Date(g.bet_closes_at).getTime()
  })

  return { isOpen, isBeforeOpen, isAfterClose, now }
}

export function getEffectiveStatus(game, now = Date.now()) {
  if (['live', 'finished'].includes(game.status)) return game.status
  if (!game.bet_opens_at || !game.bet_closes_at) return game.status
  const opens = new Date(game.bet_opens_at).getTime()
  const closes = new Date(game.bet_closes_at).getTime()
  if (now < opens) return 'upcoming'
  if (now < closes) return 'open'
  return 'closed'
}
