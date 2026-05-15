<template>
  <AppLayout>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6">
        <v-btn :to="{ name: 'Games' }" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
          Voltar
        </v-btn>

        <v-progress-linear v-if="loading" indeterminate color="green-darken-3" class="mb-4" />

        <template v-if="game">
          <v-card class="pa-6" elevation="4">
            <!-- Teams header -->
            <div class="d-flex justify-space-around align-center mb-6">
              <div class="text-center">
                <div class="text-h4">{{ game.flag_a || '🏳️' }}</div>
                <div class="text-h6 font-weight-bold">{{ game.team_a }}</div>
              </div>
              <div class="text-center">
                <v-chip :color="statusColor" label>{{ statusLabel }}</v-chip>
                <div class="text-caption text-medium-emphasis mt-1">{{ formatDate(game.match_date) }}</div>
              </div>
              <div class="text-center">
                <div class="text-h4">{{ game.flag_b || '🏳️' }}</div>
                <div class="text-h6 font-weight-bold">{{ game.team_b }}</div>
              </div>
            </div>

            <!-- Deadline alert -->
            <v-alert type="info" variant="tonal" class="mb-4" density="compact">
              Palpites encerram em: <strong>{{ formatDate(game.bet_closes_at) }}</strong>
            </v-alert>

            <!-- Closed / Finished message -->
            <template v-if="game.status !== 'open'">
              <v-alert type="warning" variant="tonal" class="mb-4">
                Este jogo não está mais aberto para palpites.
              </v-alert>
              <div v-if="existingBet" class="text-center">
                <div class="text-subtitle-1">Seu palpite: <strong>{{ existingBet.score_a }} x {{ existingBet.score_b }}</strong></div>
                <div v-if="existingBet.hit_type" class="mt-2">
                  <v-chip :color="hitColor(existingBet.hit_type)">
                    {{ hitLabel(existingBet.hit_type) }} · +{{ existingBet.points }} pts
                  </v-chip>
                </div>
              </div>
            </template>

            <!-- Bet form (only when open) -->
            <template v-else>
              <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">{{ error }}</v-alert>
              <v-alert v-if="saved" type="success" class="mb-4">Palpite salvo com sucesso!</v-alert>

              <v-form @submit.prevent="handleSave" ref="formRef">
                <div class="text-subtitle-1 font-weight-medium mb-4 text-center">Qual será o placar?</div>
                <div class="d-flex align-center justify-center ga-4">
                  <div class="text-center" style="width: 120px">
                    <div class="text-body-2 mb-1">{{ game.team_a }}</div>
                    <v-text-field
                      v-model.number="scoreA"
                      type="number"
                      min="0"
                      :rules="[v => v >= 0 || 'Inválido', v => v !== '' || 'Obrigatório']"
                      variant="outlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </div>
                  <div class="text-h5 font-weight-bold">x</div>
                  <div class="text-center" style="width: 120px">
                    <div class="text-body-2 mb-1">{{ game.team_b }}</div>
                    <v-text-field
                      v-model.number="scoreB"
                      type="number"
                      min="0"
                      :rules="[v => v >= 0 || 'Inválido', v => v !== '' || 'Obrigatório']"
                      variant="outlined"
                      density="compact"
                      hide-details="auto"
                    />
                  </div>
                </div>

                <div v-if="existingBet" class="text-caption text-center text-medium-emphasis mt-3">
                  Palpite atual: {{ existingBet.score_a }} x {{ existingBet.score_b }}
                </div>

                <v-btn
                  type="submit"
                  color="green-darken-3"
                  block
                  size="large"
                  class="mt-6"
                  :loading="saving"
                >
                  {{ existingBet ? 'Atualizar palpite' : 'Salvar palpite' }}
                </v-btn>
              </v-form>
            </template>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'

const route      = useRoute()
const gamesStore = useGamesStore()
const betsStore  = useBetsStore()

const game        = ref(null)
const existingBet = ref(null)
const scoreA      = ref(0)
const scoreB      = ref(0)
const loading     = ref(true)
const saving      = ref(false)
const error       = ref('')
const saved       = ref(false)
const formRef     = ref(null)

const statusMap = {
  upcoming: { label: 'Em breve',  color: 'grey' },
  open:     { label: 'Aberto',    color: 'green' },
  closed:   { label: 'Encerrado', color: 'orange' },
  live:     { label: 'Ao vivo',   color: 'red' },
  finished: { label: 'Finalizado',color: 'blue' },
}

const statusLabel = computed(() => statusMap[game.value?.status]?.label ?? '')
const statusColor = computed(() => statusMap[game.value?.status]?.color ?? 'grey')

function hitColor(type) {
  return type === 'exact' ? 'green' : type === 'winner' ? 'blue' : type === 'draw' ? 'orange' : 'grey'
}
function hitLabel(type) {
  return type === 'exact' ? 'Placar exato' : type === 'winner' ? 'Vencedor certo' : type === 'draw' ? 'Empate certo' : 'Errou'
}
function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

async function handleSave() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  error.value = ''
  saved.value = false
  try {
    await betsStore.saveBet(game.value.id, scoreA.value, scoreB.value)
    existingBet.value = await betsStore.getBetForGame(game.value.id)
    saved.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  game.value = await gamesStore.fetchGame(route.params.id)
  existingBet.value = await betsStore.getBetForGame(route.params.id)
  if (existingBet.value) {
    scoreA.value = existingBet.value.score_a
    scoreB.value = existingBet.value.score_b
  }
  loading.value = false
})
</script>
