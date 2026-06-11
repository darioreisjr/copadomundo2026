<template>
  <AppLayout>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <v-btn :to="{ name: 'Games' }" variant="text" prepend-icon="mdi-arrow-left">
            Voltar
          </v-btn>
          <v-btn
            v-if="game"
            variant="outlined"
            :color="alreadyPaidExpert ? 'grey' : 'green-darken-3'"
            prepend-icon="mdi-robot-excited"
            :loading="loadingAnalysis"
            :disabled="alreadyPaidExpert"
            @click="callExpert"
          >
            {{ alreadyPaidExpert ? 'Especialista consultado' : 'Chamar Especialista' }}
          </v-btn>
        </div>

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

            <!-- Jogo aberto -->
            <template v-else>
              <!-- MODO VISUALIZAÇÃO: já existe palpite e não está editando -->
              <template v-if="existingBet && !editingMode">
                <div class="text-subtitle-1 font-weight-medium mb-4 text-center">Seu palpite</div>

                <div class="d-flex align-center justify-center ga-4 mb-4">
                  <div class="text-center" style="width: 120px">
                    <div class="text-body-2 mb-1">{{ game.team_a }}</div>
                    <div class="score-display">{{ existingBet.score_a }}</div>
                  </div>
                  <div class="text-h5 font-weight-bold">X</div>
                  <div class="text-center" style="width: 120px">
                    <div class="text-body-2 mb-1">{{ game.team_b }}</div>
                    <div class="score-display">{{ existingBet.score_b }}</div>
                  </div>
                </div>

                <div class="text-caption text-center text-medium-emphasis mb-4">
                  Você tem {{ authStore.profile?.total_seals ?? 0 }} selos
                </div>

                <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">{{ error }}</v-alert>

                <v-btn
                  color="amber-darken-2"
                  block
                  size="large"
                  prepend-icon="mdi-seal"
                  @click="requestUpdate"
                >
                  Atualizar por 30 selos
                </v-btn>

                <v-divider class="my-4" />

                <v-btn
                  color="green-darken-3"
                  block
                  variant="tonal"
                  prepend-icon="mdi-handshake"
                  @click="showWagerDialog = true"
                >
                  Criar Aposta P2P
                </v-btn>
                <div class="text-center mt-2">
                  <router-link
                    :to="{ name: 'Apostas', query: { gameId: game.id } }"
                    class="text-caption text-green-darken-3"
                    style="text-decoration:none"
                  >
                    Ver apostas abertas para este jogo →
                  </router-link>
                </div>
              </template>

              <!-- MODO EDIÇÃO: primeira vez (sem palpite) ou liberado após pagar -->
              <template v-else>
                <v-alert v-if="error" type="error" class="mb-4" closable @click:close="error = ''">{{ error }}</v-alert>

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
                        class="score-input"
                      />
                    </div>
                    <div class="text-h5 font-weight-bold">X</div>
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
                        class="score-input"
                      />
                    </div>
                  </div>

                  <v-btn
                    type="submit"
                    color="green-darken-3"
                    block
                    size="large"
                    class="mt-6"
                    :loading="saving"
                    :disabled="!hasChanged"
                  >
                    {{ existingBet ? 'Salvar novo palpite' : 'Salvar palpite' }}
                  </v-btn>
                </v-form>
              </template>
            </template>
          </v-card>
          <v-expand-transition>
            <v-card v-if="analysis" class="mt-4 pa-5" elevation="2" color="surface" border>
              <div class="d-flex align-center ga-2 mb-4">
                <v-icon color="purple-darken-2">mdi-robot-excited</v-icon>
                <span class="text-subtitle-1 font-weight-bold text-purple-darken-2">Análise do Especialista IA</span>
              </div>

              <div class="text-caption text-medium-emphasis mb-1">Histórico geral</div>
              <v-row dense class="mb-3">
                <v-col cols="4" class="text-center">
                  <div class="text-h6 font-weight-bold text-green-darken-2">{{ analysis.vitorias_a ?? '?' }}</div>
                  <div class="text-caption">Vitórias {{ game.flag_a }} {{ game.team_a }}</div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="text-h6 font-weight-bold">{{ analysis.empates ?? '?' }}</div>
                  <div class="text-caption">Empates</div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="text-h6 font-weight-bold text-blue-darken-2">{{ analysis.vitorias_b ?? '?' }}</div>
                  <div class="text-caption">Vitórias {{ game.flag_b }} {{ game.team_b }}</div>
                </v-col>
              </v-row>

              <div class="text-caption text-center text-medium-emphasis mb-3">
                Total: {{ analysis.total_jogos ?? '?' }} jogos · {{ analysis.gols_a ?? '?' }} gols × {{ analysis.gols_b ?? '?' }} gols
              </div>

              <v-alert density="compact" variant="tonal" color="amber-darken-2" class="mb-4" icon="mdi-trophy">
                <strong>Última Copa do Mundo:</strong> {{ analysis.ultima_copa }}
              </v-alert>

              <div class="text-caption text-medium-emphasis mb-2">Probabilidades para este jogo</div>
              <div class="d-flex align-center ga-2 mb-1">
                <span class="text-caption" style="min-width:70px">{{ game.team_a }}</span>
                <v-progress-linear :model-value="analysis.probabilidade_a" color="green-darken-2" height="14" rounded />
                <span class="text-caption font-weight-bold" style="min-width:34px">{{ analysis.probabilidade_a }}%</span>
              </div>
              <div class="d-flex align-center ga-2 mb-1">
                <span class="text-caption" style="min-width:70px">Empate</span>
                <v-progress-linear :model-value="analysis.probabilidade_empate" color="grey-darken-1" height="14" rounded />
                <span class="text-caption font-weight-bold" style="min-width:34px">{{ analysis.probabilidade_empate }}%</span>
              </div>
              <div class="d-flex align-center ga-2 mb-4">
                <span class="text-caption" style="min-width:70px">{{ game.team_b }}</span>
                <v-progress-linear :model-value="analysis.probabilidade_b" color="blue-darken-2" height="14" rounded />
                <span class="text-caption font-weight-bold" style="min-width:34px">{{ analysis.probabilidade_b }}%</span>
              </div>

              <v-chip color="purple-darken-2" variant="flat" class="mb-4" prepend-icon="mdi-lightbulb">
                Placar sugerido: {{ analysis.placar_sugerido }}
              </v-chip>

              <p class="text-body-2 text-medium-emphasis">{{ analysis.analise }}</p>
            </v-card>
          </v-expand-transition>
        </template>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmação do especialista IA -->
    <v-dialog v-model="showExpertDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Chamar Especialista IA</v-card-title>
        <v-card-text>
          Consultar o especialista custa <strong>20 selos</strong>.<br>
          Você tem <strong>{{ authStore.profile?.total_seals ?? 0 }} selos</strong>.<br><br>
          Deseja continuar?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showExpertDialog = false">Cancelar</v-btn>
          <v-btn color="green-darken-3" variant="flat" :loading="saving" @click="confirmExpert">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de criação de aposta P2P -->
    <CriarApostaDialog
      v-if="game && showWagerDialog"
      v-model="showWagerDialog"
      :game-id="game.id"
      :game-name="`${game.team_a} vs ${game.team_b}`"
    />

    <!-- Diálogo de confirmação de atualização -->
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Atualizar palpite</v-card-title>
        <v-card-text>
          Atualizar seu palpite custa <strong>30 selos</strong>.<br>
          Você tem <strong>{{ authStore.profile?.total_seals ?? 0 }} selos</strong>.<br><br>
          Deseja continuar?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showConfirmDialog = false">Cancelar</v-btn>
          <v-btn color="green-darken-3" variant="flat" :loading="saving" @click="confirmUpdate">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import CriarApostaDialog from '@/components/CriarApostaDialog.vue'
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useMatchAnalysis } from '@/composables/useMatchAnalysis'

const route      = useRoute()
const gamesStore = useGamesStore()
const betsStore  = useBetsStore()
const authStore  = useAuthStore()
const toast      = useToastStore()

const game              = ref(null)
const existingBet       = ref(null)
const scoreA            = ref(0)
const scoreB            = ref(0)
const loading           = ref(true)
const saving            = ref(false)
const error             = ref('')
const formRef           = ref(null)
const showConfirmDialog  = ref(false)
const showExpertDialog   = ref(false)
const showWagerDialog    = ref(false)
const editingMode        = ref(false)
const alreadyPaidExpert  = ref(false)
const { analysis, loadingAnalysis, loadAnalysis } = useMatchAnalysis()

const statusMap = {
  upcoming: { label: 'Em breve',   color: 'grey' },
  open:     { label: 'Aberto',     color: 'green' },
  closed:   { label: 'Encerrado',  color: 'orange' },
  live:     { label: 'Ao vivo',    color: 'red' },
  finished: { label: 'Finalizado', color: 'blue' },
}

const statusLabel = computed(() => statusMap[game.value?.status]?.label ?? '')
const statusColor = computed(() => statusMap[game.value?.status]?.color ?? 'grey')

const hasChanged = computed(() => {
  if (!existingBet.value) return true
  return scoreA.value !== existingBet.value.score_a || scoreB.value !== existingBet.value.score_b
})

function hitColor(type) {
  return type === 'exact' ? 'green' : type === 'winner' ? 'blue' : type === 'draw' ? 'orange' : 'grey'
}
function hitLabel(type) {
  return type === 'exact' ? 'Placar exato' : type === 'winner' ? 'Vencedor certo' : type === 'draw' ? 'Empate certo' : 'Errou'
}
function formatDate(dt) {
  if (!dt) return ''
  const date = new Date(dt)
  date.setHours(date.getHours() + 3)
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function callExpert() {
  if ((authStore.profile?.total_seals ?? 0) < 20) {
    toast.notify('Você precisa de pelo menos 20 selos para chamar o especialista.', 'error')
    return
  }
  showExpertDialog.value = true
}

async function confirmExpert() {
  saving.value = true
  try {
    await betsStore.deductSealsForExpert(game.value.id)
    alreadyPaidExpert.value = true
    showExpertDialog.value = false
    await loadAnalysis(game.value.id, game.value.team_a, game.value.team_b)
    if (!analysis.value) {
      toast.notify('Não foi possível carregar a análise. Tente novamente.', 'error')
    }
  } catch {
    toast.notify('Erro ao debitar selos. Tente novamente.', 'error')
  } finally {
    saving.value = false
  }
}

function requestUpdate() {
  error.value = ''
  if ((authStore.profile?.total_seals ?? 0) < 30) {
    error.value = 'Você precisa de pelo menos 30 selos para atualizar seu palpite.'
    return
  }
  showConfirmDialog.value = true
}

async function confirmUpdate() {
  saving.value = true
  error.value = ''
  try {
    // Debita selos e libera modo edição
    await betsStore.deductSealsForUpdate()
    showConfirmDialog.value = false
    editingMode.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleSave() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  saving.value = true
  error.value = ''
  try {
    await betsStore.saveBet(game.value.id, scoreA.value, scoreB.value)
    existingBet.value = await betsStore.getBetForGame(game.value.id)
    scoreA.value = existingBet.value.score_a
    scoreB.value = existingBet.value.score_b
    const isUpdate = editingMode.value
    editingMode.value = false
    toast.notify(isUpdate ? 'Palpite atualizado com sucesso!' : 'Palpite salvo com sucesso!')
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

  if (game.value) {
    alreadyPaidExpert.value = await betsStore.hasCalledExpert(game.value.id)
    if (alreadyPaidExpert.value) {
      await loadAnalysis(game.value.id, game.value.team_a, game.value.team_b)
    }
  }
})
</script>

<style scoped>
.score-input :deep(input) {
  text-align: center;
}

.score-display {
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  padding: 8px 0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  background: transparent;
}
</style>
