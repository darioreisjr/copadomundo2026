<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-4">🏆 Ranking Geral</div>

    <v-progress-linear v-if="rankingStore.loading" indeterminate color="green-darken-3" class="mb-4" />

    <v-card v-if="rankingStore.entries.length" elevation="2">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Nome</th>
            <th class="text-right">Pontos</th>
            <th class="text-right">Placares exatos</th>
            <th class="text-right">Vencedor</th>
            <th class="text-right">Empates</th>
            <th class="text-right">Palpites</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, idx) in rankingStore.entries"
            :key="entry.user_id"
            :class="entry.user_id === auth.user?.id ? 'bg-green-lighten-5 font-weight-bold' : ''"
          >
            <td>
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
            <td class="text-right font-weight-bold text-green-darken-3">{{ entry.total_points }}</td>
            <td class="text-right">{{ entry.exact_hits }}</td>
            <td class="text-right">{{ entry.winner_hits }}</td>
            <td class="text-right">{{ entry.draw_hits }}</td>
            <td class="text-right">{{ entry.total_bets }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-alert v-else type="info" variant="tonal">
      Nenhum palpite pontuado ainda. O ranking aparecerá após os primeiros resultados.
    </v-alert>

    <div class="mt-4 text-caption text-medium-emphasis">
      Critério de desempate: placares exatos → vencedores → palpites feitos
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
