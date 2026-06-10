<template>
  <v-card elevation="2" rounded="lg" class="wager-card d-flex flex-column">
    <!-- Cabeçalho: jogo -->
    <v-card-item class="pb-1">
      <div class="d-flex align-center justify-space-between gap-2">
        <div class="d-flex align-center ga-1 flex-grow-1 min-width-0">
          <span class="text-h6">{{ wager.games?.flag_a || '🏳️' }}</span>
          <span class="text-body-2 font-weight-medium text-truncate">
            {{ wager.games?.team_a }} vs {{ wager.games?.team_b }}
          </span>
          <span class="text-h6">{{ wager.games?.flag_b || '🏳️' }}</span>
        </div>
        <v-chip :color="statusColor" size="x-small" label>{{ statusLabel }}</v-chip>
      </div>
      <div class="text-caption text-medium-emphasis mt-1">
        {{ formatDate(wager.games?.match_date) }}
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text class="pt-3 pb-2 flex-grow-1">
      <!-- Criador -->
      <div class="d-flex align-center gap-2 mb-2">
        <v-avatar size="28" color="green-darken-2" class="mr-2">
          <v-img v-if="wager.creator?.avatar_url" :src="wager.creator.avatar_url" cover />
          <span v-else class="text-caption text-white font-weight-bold">
            {{ (wager.creator?.name || 'U')[0].toUpperCase() }}
          </span>
        </v-avatar>
        <span class="text-body-2">
          <template v-if="wager.wager_type === 'group'">
            <span v-if="isOwnWager" class="font-weight-medium">Você</span>
            <span v-else class="font-weight-medium">{{ creatorDisplay }}</span>
            <span class="text-medium-emphasis"> criou esta aposta em grupo</span>
          </template>
          <template v-else-if="wager.wager_type === 'open'">
            <template v-if="isOwnWager">
              <span class="font-weight-medium">Você</span>
              <span class="text-medium-emphasis"> criou esta aposta e ainda continua aberta</span>
            </template>
            <template v-else>
              <span class="font-weight-medium">{{ creatorDisplay }}</span>
              <span class="text-medium-emphasis"> criou e ainda permanece aberta</span>
            </template>
          </template>
          <template v-else>
            <span class="font-weight-medium">{{ creatorDisplay }}</span>
            <span class="text-medium-emphasis"> criou</span>
          </template>
        </span>
        <v-spacer />
        <v-chip size="small" color="green-darken-2" variant="tonal" prepend-icon="mdi-seal">
          {{ wager.amount }} selos
        </v-chip>
      </div>

      <!-- Tipo de aposta -->
      <div v-if="wager.wager_type === 'direct' && wager.target" class="text-caption text-medium-emphasis mb-2">
        Você tem um duelo direto com <span class="font-weight-bold">{{ targetDisplay }}</span>
      </div>

      <!-- Progresso do grupo -->
      <template v-if="wager.wager_type === 'group'">
        <div class="d-flex align-center gap-2 mb-2">
          <v-progress-linear
            :model-value="participantsProgress"
            color="green-darken-2"
            bg-color="green-lighten-4"
            rounded
            height="6"
            class="flex-grow-1"
          />
          <span class="text-caption text-medium-emphasis text-no-wrap">
            {{ participantCount }}/{{ wager.max_participants + 1 }} participantes
          </span>
        </div>
      </template>

      <!-- Mensagem/provocação -->
      <template v-if="wager.message">
        <div class="mb-2">
          <div class="text-caption font-weight-bold text-high-emphasis">Descrição da aposta</div>
          <div class="text-caption text-high-emphasis">{{ wager.message }}</div>
        </div>
      </template>

      <!-- Resultado (settled) -->
      <template v-if="wager.status === 'settled_win' && wager.winner">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-trophy" color="amber-darken-2" size="16" />
          <span class="text-caption">
            Vencedor: <strong>{{ winnerDisplay }}</strong>
            ({{ wager.amount * participantCount }} selos)
          </span>
        </div>
      </template>
    </v-card-text>

    <!-- Ações -->
    <v-card-actions v-if="showActions" class="pt-0 px-4 pb-3 gap-2">
      <!-- Cancelar (criador, pendente) -->
      <v-btn
        v-if="mode === 'mine' && canCancel"
        variant="outlined"
        color="red-darken-2"
        size="small"
        prepend-icon="mdi-cancel"
        :loading="cancelling"
        @click="handleCancel"
      >
        Cancelar
      </v-btn>

      <!-- Aceitar (disponíveis / desafio) -->
      <v-tooltip
        v-if="mode === 'available' || mode === 'challenge'"
        :text="!hasPalpite ? 'Faça seu palpite neste jogo primeiro' : ''"
        :disabled="hasPalpite"
      >
        <template #activator="{ props }">
          <span v-bind="props" class="flex-grow-1">
            <v-btn
              variant="flat"
              color="green-darken-3"
              size="small"
              block
              prepend-icon="mdi-handshake"
              :disabled="!hasPalpite"
              :loading="accepting"
              @click="handleAccept"
            >
              Aceitar Aposta
            </v-btn>
          </span>
        </template>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  wager:      { type: Object, required: true },
  mode:       { type: String, default: 'mine' }, // 'mine' | 'available' | 'challenge'
  hasPalpite: { type: Boolean, default: false },
})

const emit = defineEmits(['accept', 'cancel'])

const auth     = useAuthStore()
const cancelling = ref(false)
const accepting  = ref(false)

const participantCount = computed(() => {
  const accepted = (props.wager.wager_participants || []).length
  return accepted + 1 // +1 para o criador
})

const participantsProgress = computed(() => {
  const total = props.wager.max_participants + 1
  return (participantCount.value / total) * 100
})

const isOwnWager = computed(() => props.wager.creator_id === auth.user?.id)

const canCancel = computed(() =>
  props.wager.creator_id === auth.user?.id && props.wager.status === 'pending'
)

const showActions = computed(() => {
  if (props.mode === 'mine') return canCancel.value
  return props.wager.status === 'pending'
})

const statusColor = computed(() => ({
  pending:     'green-darken-2',
  active:      'green-darken-3',
  cancelled:   'grey',
  settled_win: 'green-darken-2',
  settled_tie: 'purple',
}[props.wager.status] || 'grey'))

const statusLabel = computed(() => ({
  pending:     'Aguardando',
  active:      'Em andamento',
  cancelled:   'Cancelada',
  settled_win: 'Encerrada',
  settled_tie: 'Empatada',
}[props.wager.status] || props.wager.status))

const creatorDisplay = computed(() => {
  const c = props.wager.creator
  return c?.nome_fantasia || c?.name || (c?.username ? `@${c.username}` : 'Usuário')
})

const winnerDisplay = computed(() => {
  const w = props.wager.winner
  return w?.nome_fantasia || w?.name || (w?.username ? `@${w.username}` : 'Usuário')
})

const targetDisplay = computed(() => {
  const t = props.wager.target
  return t?.nome_fantasia || t?.name || (t?.username ? `@${t.username}` : 'Usuário')
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

async function handleAccept() {
  accepting.value = true
  try {
    emit('accept', props.wager.id)
  } finally {
    accepting.value = false
  }
}

async function handleCancel() {
  cancelling.value = true
  try {
    emit('cancel', props.wager.id)
  } finally {
    cancelling.value = false
  }
}
</script>

<style scoped>
.wager-card { height: 100%; transition: box-shadow .15s ease; }
.wager-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.12) !important; }
.min-width-0 { min-width: 0; }
</style>
