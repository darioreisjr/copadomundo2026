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
        </template>
      </v-col>
    </v-row>

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
import { useGamesStore } from '@/stores/games'
import { useBetsStore } from '@/stores/bets'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

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
const showConfirmDialog = ref(false)
const editingMode       = ref(false)

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
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
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
