<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-4">Ranking Geral</div>

    <v-progress-linear v-if="rankingStore.loading" indeterminate color="green-darken-3" class="mb-4" />

    <template v-if="rankingStore.entries.length">
      <v-card elevation="2">
        <v-table>
          <thead>
            <tr style="border-bottom: 2px solid rgba(0,0,0,0.12)">
              <th class="text-center" style="padding-left:0; padding-right:0">Posição</th>
              <th class="text-left">Nome</th>
              <th class="text-center">Pontos</th>
              <th class="text-center">Placares exatos</th>
              <th class="text-center">Vencedor</th>
              <th class="text-center">Empates</th>
              <th class="text-center">Palpites</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, idx) in rankingStore.entries"
              :key="entry.user_id"
              :class="entry.user_id === auth.user?.id ? 'bg-green-lighten-5 font-weight-bold' : ''"
            >
              <td class="text-center" style="padding-left:0; padding-right:0">
                <v-chip
                  :color="idx === 0 ? 'amber' : idx === 1 ? 'grey-lighten-1' : idx === 2 ? 'brown-lighten-2' : 'default'"
                  :variant="idx < 3 ? 'elevated' : 'text'"
                  size="small"
                >
                  {{ idx + 1 }}
                </v-chip>
              </td>
              <td>
                {{ entry.profiles?.name ?? '—' }}
                <v-chip v-if="entry.user_id === auth.user?.id" size="x-small" color="green" class="ml-1">Você</v-chip>
              </td>
              <td class="text-center font-weight-bold text-green-darken-3">{{ entry.total_points }}</td>
              <td class="text-center">{{ entry.exact_hits }}</td>
              <td class="text-center">{{ entry.winner_hits }}</td>
              <td class="text-center">{{ entry.draw_hits }}</td>
              <td class="text-center">{{ entry.total_bets }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <div class="mt-4 text-caption text-medium-emphasis">
        Critério de desempate: placares exatos → vencedores → palpites feitos
      </div>
    </template>

    <div
      v-else-if="!rankingStore.loading"
      class="empty-state d-flex flex-column align-center justify-center text-center"
      style="min-height: calc(100vh - 120px);"
    >
      <v-icon icon="mdi-podium-silver" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
      <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">
        Ranking ainda não iniciado
      </p>
      <p class="text-body-2 text-medium-emphasis" style="max-width:360px">
        O ranking aparecerá aqui assim que os primeiros resultados forem apurados. Faça seus palpites e aguarde!
      </p>
      <v-btn
        color="green-darken-3"
        variant="tonal"
        prepend-icon="mdi-soccer"
        :to="{ name: 'Games' }"
        class="mt-6"
        rounded="lg"
      >
        Fazer palpites
      </v-btn>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useRankingStore } from '@/stores/ranking'
import { useAuthStore } from '@/stores/auth'

const rankingStore = useRankingStore()
const auth = useAuthStore()

onMounted(() => rankingStore.fetchRanking())
</script>

