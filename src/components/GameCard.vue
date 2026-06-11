<template>
  <v-card class="pa-4" :class="cardColor" elevation="2">
    <div class="d-flex justify-space-between align-center mb-2">
      <v-chip :color="statusColor" size="small" label>{{ statusLabel }}</v-chip>
      <span class="text-caption text-medium-emphasis">{{ phaseLabel }}</span>
    </div>

    <div class="d-flex justify-space-around align-center my-3">
      <div class="text-center">
        <div class="text-h6 font-weight-bold">{{ game.flag_a || '🏳️' }}</div>
        <div class="text-body-2 font-weight-medium">{{ game.team_a }}</div>
      </div>

      <div class="text-center">
        <div v-if="game.status === 'finished'" class="text-h5 font-weight-bold">
          {{ game.score_a }} x {{ game.score_b }}
        </div>
        <div v-else class="text-body-1 text-medium-emphasis">vs</div>
        <div v-if="bet" class="text-caption mt-1">
          <v-chip size="x-small" :color="betChipColor" label>
            Palpite: {{ bet.score_a }} x {{ bet.score_b }}
          </v-chip>
        </div>
      </div>

      <div class="text-center">
        <div class="text-h6 font-weight-bold">{{ game.flag_b || '🏳️' }}</div>
        <div class="text-body-2 font-weight-medium">{{ game.team_b }}</div>
      </div>
    </div>

    <div class="text-caption text-center text-medium-emphasis mb-3">
      {{ formatDate(game.match_date) }}
    </div>

    <v-btn
      v-if="canBet"
      :to="{ name: 'Bet', params: { id: game.id } }"
      color="green-darken-3"
      block
      size="small"
      :variant="bet ? 'outlined' : 'elevated'"
    >
      {{ bet ? 'Editar palpite' : 'Fazer palpite' }}
    </v-btn>

    <div v-if="bet?.hit_type && game.status === 'finished'" class="text-center mt-2">
      <v-chip :color="hitColor(bet.hit_type)" size="small">
        {{ hitLabel(bet.hit_type) }} · +{{ bet.points }} pts
      </v-chip>
    </div>
  </v-card>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { useBetWindow } from '@/composables/useBetWindow'

const props = defineProps({
  game: { type: Object, required: true },
  bet:  { type: Object, default: null },
})

const { isOpen, isBeforeOpen } = useBetWindow(toRef(props, 'game'))

const statusMap = {
  upcoming: { label: 'Em breve',         color: 'grey' },
  open:     { label: 'Aberto',           color: 'green' },
  closed:   { label: 'Encerrado',        color: 'orange' },
  live:     { label: 'Ao vivo',          color: 'red' },
  finished: { label: 'Finalizado',       color: 'blue' },
}

const phaseMap = {
  group:        'Fase de grupos',
  round_of_16:  'Oitavas',
  quarter:      'Quartas',
  semi:         'Semifinal',
  final:        'Final',
}

const canBet = computed(() => isOpen.value)

const statusLabel = computed(() => {
  if (['live', 'finished'].includes(props.game.status)) {
    return statusMap[props.game.status]?.label ?? props.game.status
  }
  if (isOpen.value) return statusMap.open.label
  if (isBeforeOpen.value) return statusMap.upcoming.label
  return statusMap.closed.label
})

const statusColor = computed(() => {
  if (['live', 'finished'].includes(props.game.status)) {
    return statusMap[props.game.status]?.color ?? 'grey'
  }
  if (isOpen.value) return statusMap.open.color
  if (isBeforeOpen.value) return statusMap.upcoming.color
  return statusMap.closed.color
})

const phaseLabel  = computed(() => phaseMap[props.game.phase] ?? props.game.phase)
const cardColor   = computed(() => isOpen.value ? 'bg-green-lighten-5' : '')

const betChipColor = computed(() => {
  if (!props.bet?.hit_type) return 'grey'
  return hitColor(props.bet.hit_type)
})

function hitColor(type) {
  return type === 'exact' ? 'green' : type === 'winner' ? 'blue' : type === 'draw' ? 'orange' : 'grey'
}

function hitLabel(type) {
  return type === 'exact' ? 'Placar exato' : type === 'winner' ? 'Vencedor' : type === 'draw' ? 'Empate' : 'Errou'
}

function formatDate(dt) {
  if (!dt) return ''
  const date = new Date(dt)
  date.setHours(date.getHours() + 3)
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
</script>
