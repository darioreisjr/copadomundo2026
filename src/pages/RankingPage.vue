<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-4">Ranking Geral</div>

    <v-progress-linear v-if="rankingStore.loading" indeterminate color="green-darken-3" class="mb-4" />

    <template v-if="rankingStore.entries.length">
      <v-card elevation="2" class="w-100">
        <!-- Tabela desktop (sm e acima) -->
        <v-table class="d-none d-sm-table w-100">
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

        <!-- Tabela mobile (só abaixo de sm) — 3 colunas, toque abre modal -->
        <v-table class="d-sm-none">
          <thead>
            <tr style="border-bottom: 2px solid rgba(0,0,0,0.12)">
              <th class="text-center" style="padding-left:0; padding-right:0">Posição</th>
              <th class="text-left">Nome</th>
              <th class="text-center">Pontos</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, idx) in rankingStore.entries"
              :key="entry.user_id"
              :class="entry.user_id === auth.user?.id ? 'bg-green-lighten-5 font-weight-bold' : ''"
              style="cursor:pointer"
              @click="openModal(entry, idx)"
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
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Modal de detalhes do jogador (mobile) -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card v-if="selectedEntry" rounded="lg">
          <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
            <v-chip
              :color="selectedIdx === 0 ? 'amber' : selectedIdx === 1 ? 'grey-lighten-1' : selectedIdx === 2 ? 'brown-lighten-2' : 'default'"
              :variant="selectedIdx < 3 ? 'elevated' : 'text'"
              size="small"
            >
              {{ selectedIdx + 1 }}
            </v-chip>
            <span class="font-weight-bold ml-2">{{ selectedEntry.profiles?.name ?? '—' }}</span>
            <v-chip v-if="selectedEntry.user_id === auth.user?.id" size="x-small" color="green" class="ml-1">Você</v-chip>
          </v-card-title>

          <v-divider class="mt-2" />

          <v-card-text class="px-4 pt-3 pb-2">
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0">
                <template #title><span class="text-body-2 text-medium-emphasis">Pontos</span></template>
                <template #append><span class="font-weight-bold text-green-darken-3">{{ selectedEntry.total_points }}</span></template>
              </v-list-item>
              <v-divider />
              <v-list-item class="px-0">
                <template #title><span class="text-body-2 text-medium-emphasis">Placares exatos</span></template>
                <template #append><span class="font-weight-medium">{{ selectedEntry.exact_hits }}</span></template>
              </v-list-item>
              <v-divider />
              <v-list-item class="px-0">
                <template #title><span class="text-body-2 text-medium-emphasis">Vencedor</span></template>
                <template #append><span class="font-weight-medium">{{ selectedEntry.winner_hits }}</span></template>
              </v-list-item>
              <v-divider />
              <v-list-item class="px-0">
                <template #title><span class="text-body-2 text-medium-emphasis">Empates</span></template>
                <template #append><span class="font-weight-medium">{{ selectedEntry.draw_hits }}</span></template>
              </v-list-item>
              <v-divider />
              <v-list-item class="px-0">
                <template #title><span class="text-body-2 text-medium-emphasis">Palpites</span></template>
                <template #append><span class="font-weight-medium">{{ selectedEntry.total_bets }}</span></template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-spacer />
            <v-btn color="green-darken-3" variant="tonal" rounded="lg" @click="dialog = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="mt-4 text-caption text-medium-emphasis">
        Critério de desempate: placares exatos → vencedores → palpites feitos
      </div>

      <div class="mt-4 text-caption text-medium-emphasis">
        <div class="font-weight-medium mb-1">Entenda a pontuação</div>
        <div>• <strong>Pontos</strong> — total acumulado de pontos no bolão</div>
        <div>• <strong>Placares exatos</strong> — acertou o placar exato do jogo</div>
        <div>• <strong>Vencedor</strong> — acertou quem venceu, mas não o placar exato</div>
        <div>• <strong>Empates</strong> — acertou que o jogo terminou empatado</div>
        <div>• <strong>Palpites</strong> — total de palpites enviados</div>
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
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useRankingStore } from '@/stores/ranking'
import { useAuthStore } from '@/stores/auth'

const rankingStore = useRankingStore()
const auth = useAuthStore()

const dialog = ref(false)
const selectedEntry = ref(null)
const selectedIdx = ref(null)

function openModal(entry, idx) {
  selectedEntry.value = entry
  selectedIdx.value = idx
  dialog.value = true
}

onMounted(() => rankingStore.fetchRanking())
</script>

