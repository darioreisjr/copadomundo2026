<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-4">Jogos da Copa</div>

    <!-- Filters -->
    <v-row v-if="gamesStore.games.length" class="mb-4" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Status"
          clearable
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="filterPhase"
          :items="phaseOptions"
          label="Fase"
          clearable
          density="compact"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Buscar seleção"
          prepend-inner-icon="mdi-magnify"
          clearable
          density="compact"
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-progress-linear v-if="gamesStore.loading" indeterminate color="green-darken-3" class="mb-4" />

    <v-row v-if="filtered.length">
      <v-col v-for="game in filtered" :key="game.id" cols="12" sm="6" md="4">
        <GameCard :game="game" :bet="betMap[game.id]" />
      </v-col>
    </v-row>

    <!-- Sem jogos no sistema -->
    <EmptyState
      v-else-if="!gamesStore.loading && !gamesStore.games.length"
      icon="mdi-soccer"
      title="Nenhum jogo disponível ainda"
      description="Os jogos da Copa do Mundo 2026 ainda não foram cadastrados. Volte em breve!"
    />

    <!-- Filtros sem resultado -->
    <EmptyState
      v-else-if="!gamesStore.loading"
      icon="mdi-magnify-remove-outline"
      title="Nenhum jogo encontrado"
      description="Nenhum jogo corresponde aos filtros selecionados. Tente ajustar a busca."
      action-text="Limpar filtros"
      action-icon="mdi-filter-remove-outline"
      action-variant="tonal"
      action-size="default"
      @action="filterStatus = null; filterPhase = null; search = ''"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import GameCard from '@/components/GameCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'

const gamesStore = useGamesStore()
const betsStore  = useBetsStore()

const filterStatus = ref(null)
const filterPhase  = ref(null)
const search       = ref('')

const statusOptions = [
  { title: 'Em breve',  value: 'upcoming' },
  { title: 'Aberto',    value: 'open' },
  { title: 'Encerrado', value: 'closed' },
  { title: 'Ao vivo',   value: 'live' },
  { title: 'Finalizado',value: 'finished' },
]

const phaseOptions = [
  { title: 'Fase de grupos', value: 'group' },
  { title: 'Oitavas',        value: 'round_of_16' },
  { title: 'Quartas',        value: 'quarter' },
  { title: 'Semifinal',      value: 'semi' },
  { title: 'Final',          value: 'final' },
]

const betMap = computed(() => {
  const map = {}
  betsStore.bets.forEach(b => { map[b.game_id] = b })
  return map
})

const filtered = computed(() => {
  let result = gamesStore.games
  if (filterStatus.value) result = result.filter(g => g.status === filterStatus.value)
  if (filterPhase.value)  result = result.filter(g => g.phase === filterPhase.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(g =>
      g.team_a.toLowerCase().includes(q) || g.team_b.toLowerCase().includes(q)
    )
  }
  return result
})

onMounted(async () => {
  await Promise.all([gamesStore.fetchGames(), betsStore.fetchMyBets()])
})
</script>
