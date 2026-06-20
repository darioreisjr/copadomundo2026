export const HIT_TYPES = {
  exact:  { color: 'green',  label: 'Placar exato' },
  winner: { color: 'blue',   label: 'Vencedor certo' },
  draw:   { color: 'orange', label: 'Empate certo' },
}

export function hitColor(type) {
  return HIT_TYPES[type]?.color ?? 'grey'
}

export function hitLabel(type) {
  return HIT_TYPES[type]?.label ?? 'Errou'
}

export function useHitType() {
  return { hitColor, hitLabel, HIT_TYPES }
}
