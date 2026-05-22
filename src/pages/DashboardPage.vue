<template>
  <AppLayout>
<!-- Profile card -->
    <v-card class="mb-6 pa-4" rounded="lg" color="green-darken-4" theme="dark">
      <div class="d-flex flex-column flex-sm-row align-sm-center">
        <!-- Linha 1: avatar + nome -->
        <div class="d-flex align-center justify-center justify-sm-start">
          <v-avatar
            color="green-darken-1"
            size="56"
            class="mr-4"
            style="cursor:pointer"
            @click="openAvatarPicker()"
          >
            <v-img
              v-if="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
              :src="auth.profile?.avatar_url || avatarsStore.defaultAvatarUrl"
              cover
            />
            <span v-else class="text-white font-weight-bold text-h6">
              {{ (auth.profile?.name || 'U')[0].toUpperCase() }}
            </span>
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-bold">
              {{ auth.profile?.nome_fantasia || auth.profile?.name }}
            </div>
            <div v-if="auth.profile?.username" class="text-caption" style="opacity:.7">
              @{{ auth.profile.username }}
            </div>
          </div>
        </div>

        <!-- Linha 2 (mobile) / stats à direita (desktop) -->
        <div class="d-flex align-center justify-center justify-sm-end flex-grow-1 mt-2 mt-sm-0">
          <v-divider vertical class="mx-4 d-none d-sm-flex" style="height:40px" />
          <div class="text-center mx-3">
            <div class="text-h6 font-weight-bold text-amber-lighten-2">{{ rankEntry?.total_points ?? 0 }}</div>
            <div class="text-caption" style="opacity:.75">Pontos</div>
          </div>
          <div class="text-center mx-3">
            <div class="text-h6 font-weight-bold text-amber-lighten-2">#{{ userPosition }}</div>
            <div class="text-caption" style="opacity:.75">Ranking</div>
          </div>
          <v-divider vertical class="mx-2" style="height:40px" />
          <div class="text-center mx-3">
            <div class="text-h6 font-weight-bold text-amber-lighten-2 d-flex align-center justify-center">
              <v-icon icon="mdi-seal" size="18" class="mr-1" />
              {{ auth.profile?.total_seals ?? 0 }}
            </div>
            <div class="text-caption" style="opacity:.75">Selos</div>
          </div>
        </div>
      </div>
    </v-card>


    <!-- Estado vazio global: nenhum jogo cadastrado -->
    <div
      v-if="!gamesStore.loading && !gamesStore.games.length"
      class="d-flex flex-column align-center justify-center text-center"
      style="min-height: calc(100vh - 260px);"
    >
      <v-icon icon="mdi-soccer" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
      <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">
        Nenhum jogo disponível ainda
      </p>
      <p class="text-body-2 text-medium-emphasis" style="max-width:360px">
        Os jogos da Copa do Mundo 2026 ainda não foram cadastrados. Volte em breve!
      </p>
    </div>

    <template v-else>
      <!-- Open for betting -->
      <div class="text-h6 font-weight-medium mb-3">Abertos para palpite</div>
      <v-row v-if="openGames.length" class="mb-6">
        <v-col v-for="game in openGames" :key="game.id" cols="12" sm="6" md="4">
          <GameCard :game="game" :bet="betMap[game.id]" />
        </v-col>
      </v-row>
      <div v-else class="d-flex flex-column align-center justify-center text-center py-10 mb-6">
        <v-icon icon="mdi-timer-sand" size="56" color="green-darken-2" style="opacity:.35" class="mb-4" />
        <p class="text-body-1 font-weight-medium text-medium-emphasis mb-1">Nenhum jogo aberto para palpite</p>
        <p class="text-body-2 text-medium-emphasis">Aguarde — os jogos serão liberados em breve.</p>
      </div>

      <!-- Upcoming games -->
      <div class="text-h6 font-weight-medium mb-3">Próximos jogos</div>
      <v-row v-if="upcomingGames.length" class="mb-6">
        <v-col v-for="game in upcomingGames.slice(0,6)" :key="game.id" cols="12" sm="6" md="4">
          <GameCard :game="game" :bet="betMap[game.id]" />
        </v-col>
      </v-row>
      <div v-else class="d-flex flex-column align-center justify-center text-center py-10 mb-6">
        <v-icon icon="mdi-calendar-blank-outline" size="56" color="green-darken-2" style="opacity:.35" class="mb-4" />
        <p class="text-body-1 font-weight-medium text-medium-emphasis mb-1">Nenhum jogo agendado</p>
        <p class="text-body-2 text-medium-emphasis">O calendário ainda não foi publicado.</p>
      </div>

      <!-- Recent results -->
      <div class="text-h6 font-weight-medium mb-3">Últimos resultados</div>
      <v-row v-if="finishedGames.length">
        <v-col v-for="game in finishedGames.slice(0,6)" :key="game.id" cols="12" sm="6" md="4">
          <GameCard :game="game" :bet="betMap[game.id]" />
        </v-col>
      </v-row>
      <div v-else class="d-flex flex-column align-center justify-center text-center py-10">
        <v-icon icon="mdi-flag-checkered" size="56" color="green-darken-2" style="opacity:.35" class="mb-4" />
        <p class="text-body-1 font-weight-medium text-medium-emphasis mb-1">Nenhum resultado registrado</p>
        <p class="text-body-2 text-medium-emphasis">Os resultados aparecerão aqui após os jogos.</p>
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'

import AppLayout from '@/components/AppLayout.vue'
import GameCard from '@/components/GameCard.vue'
import { useAuthStore }    from '@/stores/auth'
import { useAvatarsStore } from '@/stores/avatars'
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'
import { useRankingStore } from '@/stores/ranking'

const openAvatarPicker = inject('openAvatarPicker', () => {})
const triggerDailyChest = inject('triggerDailyChest', () => {})

const auth         = useAuthStore()
const avatarsStore = useAvatarsStore()
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
  triggerDailyChest()
})
</script>
