<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-6">
      Olá, {{ auth.profile?.name }} 👋
    </div>

    <!-- Stats cards -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card class="pa-4 text-center" color="green-darken-3" theme="dark">
          <div class="text-h4 font-weight-bold">{{ rankEntry?.total_points ?? 0 }}</div>
          <div class="text-caption">Pontos</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="pa-4 text-center" color="amber-darken-2" theme="dark">
          <div class="text-h4 font-weight-bold">#{{ userPosition }}</div>
          <div class="text-caption">Posição no ranking</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="pa-4 text-center" color="blue-darken-2" theme="dark">
          <div class="text-h4 font-weight-bold">{{ rankEntry?.exact_hits ?? 0 }}</div>
          <div class="text-caption">Placares exatos</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card class="pa-4 text-center" color="purple-darken-2" theme="dark">
          <div class="text-h4 font-weight-bold">{{ rankEntry?.total_bets ?? 0 }}</div>
          <div class="text-caption">Palpites feitos</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Open for betting -->
    <div class="text-h6 font-weight-medium mb-3">🟢 Abertos para palpite</div>
    <v-row v-if="openGames.length" class="mb-6">
      <v-col v-for="game in openGames" :key="game.id" cols="12" sm="6" md="4">
        <GameCard :game="game" :bet="betMap[game.id]" />
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="tonal" class="mb-6">
      Nenhum jogo aberto para palpite no momento.
    </v-alert>

    <!-- Upcoming games -->
    <div class="text-h6 font-weight-medium mb-3">📅 Próximos jogos</div>
    <v-row v-if="upcomingGames.length" class="mb-6">
      <v-col v-for="game in upcomingGames.slice(0,6)" :key="game.id" cols="12" sm="6" md="4">
        <GameCard :game="game" :bet="betMap[game.id]" />
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="tonal" class="mb-6">
      Nenhum próximo jogo cadastrado.
    </v-alert>

    <!-- Recent results -->
    <div class="text-h6 font-weight-medium mb-3">✅ Últimos resultados</div>
    <v-row v-if="finishedGames.length">
      <v-col v-for="game in finishedGames.slice(0,6)" :key="game.id" cols="12" sm="6" md="4">
        <GameCard :game="game" :bet="betMap[game.id]" />
      </v-col>
    </v-row>
    <v-alert v-else type="info" variant="tonal">
      Nenhum resultado registrado ainda.
    </v-alert>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import GameCard from '@/components/GameCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'
import { useRankingStore } from '@/stores/ranking'

const auth = useAuthStore()
const gamesStore = useGamesStore()
const betsStore = useBetsStore()
const rankingStore = useRankingStore()

const openGames     = computed(() => gamesStore.games.filter(g => g.status === 'open'))
const upcomingGames = computed(() => gamesStore.games.filter(g => g.status === 'upcoming'))
const finishedGames = computed(() => [...gamesStore.games].filter(g => g.status === 'finished').reverse())

const betMap = computed(() => {
  const map = {}
  betsStore.bets.forEach(b => { map[b.game_id] = b })
  return map
})

const rankEntry = computed(() =>
  rankingStore.entries.find(e => e.user_id === auth.user?.id)
)

const userPosition = computed(() => {
  const idx = rankingStore.entries.findIndex(e => e.user_id === auth.user?.id)
  return idx === -1 ? '-' : idx + 1
})

onMounted(async () => {
  await Promise.all([
    gamesStore.fetchGames(),
    betsStore.fetchMyBets(),
    rankingStore.fetchRanking(),
  ])
})
</script>
