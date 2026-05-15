<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-6">⚙️ Painel Administrativo</div>

    <v-tabs v-model="tab" color="green-darken-3" class="mb-6">
      <v-tab value="gemini">Gerar jogos com Gemini</v-tab>
      <v-tab value="games">Gerenciar jogos</v-tab>
      <v-tab value="results">Inserir resultados</v-tab>
    </v-tabs>

    <!-- ===== TAB: GEMINI ===== -->
    <v-window v-model="tab">
      <v-window-item value="gemini">
        <v-card class="pa-6" elevation="2">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Gere a tabela de jogos da Copa com ajuda do Gemini e revise antes de salvar.
          </div>

          <v-text-field
            v-model="geminiPrompt"
            label="Prompt para o Gemini"
            variant="outlined"
            rows="3"
            auto-grow
            class="mb-4"
          />

          <v-btn
            color="green-darken-3"
            prepend-icon="mdi-robot"
            :loading="geminiLoading"
            @click="callGemini"
            class="mb-6"
          >
            Gerar com Gemini
          </v-btn>

          <v-alert v-if="geminiError" type="error" class="mb-4" closable @click:close="geminiError = ''">
            {{ geminiError }}
          </v-alert>

          <!-- Preview suggested games -->
          <template v-if="suggestedGames.length">
            <div class="text-subtitle-1 font-weight-medium mb-3">
              Jogos sugeridos ({{ suggestedGames.length }}) — revise antes de confirmar:
            </div>

            <v-table class="mb-4">
              <thead>
                <tr>
                  <th>Seleção A</th>
                  <th>Seleção B</th>
                  <th>Data</th>
                  <th>Fase</th>
                  <th>Grupo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(g, idx) in suggestedGames" :key="idx">
                  <td>{{ g.flag_a }} {{ g.team_a }}</td>
                  <td>{{ g.flag_b }} {{ g.team_b }}</td>
                  <td>{{ g.match_date }}</td>
                  <td>{{ g.phase }}</td>
                  <td>{{ g.group_name ?? '-' }}</td>
                  <td>
                    <v-btn icon="mdi-delete" size="small" variant="text" color="red"
                      @click="suggestedGames.splice(idx, 1)" />
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-btn
              color="green-darken-3"
              prepend-icon="mdi-check-all"
              :loading="savingGames"
              @click="confirmGames"
            >
              Confirmar e salvar todos os jogos
            </v-btn>
            <v-alert v-if="gamesSaved" type="success" class="mt-4">
              {{ gamesSavedCount }} jogos salvos com sucesso!
            </v-alert>
          </template>
        </v-card>
      </v-window-item>

      <!-- ===== TAB: MANAGE GAMES ===== -->
      <v-window-item value="games">
        <v-card class="pa-6" elevation="2">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 font-weight-medium">Jogos cadastrados</div>
            <v-btn
              color="green-darken-3"
              prepend-icon="mdi-plus"
              @click="openNewGameDialog"
            >
              Novo jogo
            </v-btn>
          </div>

          <v-progress-linear v-if="gamesStore.loading" indeterminate color="green-darken-3" class="mb-4" />

          <v-table v-if="gamesStore.games.length">
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Data</th>
                <th>Fase</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in gamesStore.games" :key="game.id">
                <td>{{ game.team_a }} x {{ game.team_b }}</td>
                <td>{{ formatDate(game.match_date) }}</td>
                <td>{{ phaseMap[game.phase] ?? game.phase }}</td>
                <td>
                  <v-select
                    :model-value="game.status"
                    :items="statusOptions"
                    density="compact"
                    variant="plain"
                    hide-details
                    @update:model-value="v => updateStatus(game.id, v)"
                  />
                </td>
                <td>
                  <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog(game)" />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-window-item>

      <!-- ===== TAB: RESULTS ===== -->
      <v-window-item value="results">
        <v-card class="pa-6" elevation="2">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Insira os resultados finais. A pontuação será calculada automaticamente.
          </div>

          <v-table v-if="pendingResults.length">
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Data</th>
                <th>Placar A</th>
                <th>Placar B</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in pendingResults" :key="game.id">
                <td>{{ game.team_a }} x {{ game.team_b }}</td>
                <td>{{ formatDate(game.match_date) }}</td>
                <td style="width:80px">
                  <v-text-field
                    v-model.number="resultInputs[game.id].a"
                    type="number" min="0"
                    density="compact" variant="outlined" hide-details
                  />
                </td>
                <td style="width:80px">
                  <v-text-field
                    v-model.number="resultInputs[game.id].b"
                    type="number" min="0"
                    density="compact" variant="outlined" hide-details
                  />
                </td>
                <td>
                  <v-btn
                    color="green-darken-3"
                    size="small"
                    :loading="savingResult[game.id]"
                    @click="saveResult(game)"
                  >
                    Salvar
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-alert v-else type="info" variant="tonal">
            Nenhum jogo aguardando resultado.
          </v-alert>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Edit / Create game dialog -->
    <v-dialog v-model="gameDialog" max-width="600">
      <v-card class="pa-6">
        <div class="text-h6 mb-4">{{ editGame?.id ? 'Editar jogo' : 'Novo jogo' }}</div>

        <v-form @submit.prevent="saveGame" ref="gameFormRef">
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="gameForm.team_a" label="Seleção A" :rules="[v => !!v || 'Obrigatório']" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="gameForm.team_b" label="Seleção B" :rules="[v => !!v || 'Obrigatório']" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="gameForm.flag_a" label="Emoji bandeira A" />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="gameForm.flag_b" label="Emoji bandeira B" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="gameForm.match_date"
                label="Data e hora (YYYY-MM-DDTHH:MM)"
                type="datetime-local"
                :rules="[v => !!v || 'Obrigatório']"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="gameForm.phase"
                label="Fase"
                :items="phaseOptions"
                :rules="[v => !!v || 'Obrigatório']"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="gameForm.group_name" label="Grupo (A-H)" />
            </v-col>
          </v-row>

          <v-btn type="submit" color="green-darken-3" block :loading="savingGame">Salvar</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useGamesStore } from '@/stores/games'
import { generateMatches } from '@/lib/gemini'

const gamesStore = useGamesStore()

const tab = ref('gemini')

// --- Gemini tab ---
const defaultPrompt = `Gere uma lista JSON com os jogos da fase de grupos da Copa do Mundo 2026.
Cada jogo deve ter os campos: team_a, team_b, flag_a (emoji), flag_b (emoji), match_date (ISO 8601), phase ("group"), group_name (letra do grupo).
Retorne apenas o array JSON sem explicações.`

const geminiPrompt  = ref(defaultPrompt)
const geminiLoading = ref(false)
const geminiError   = ref('')
const suggestedGames = ref([])
const savingGames   = ref(false)
const gamesSaved    = ref(false)
const gamesSavedCount = ref(0)

async function callGemini() {
  geminiLoading.value = true
  geminiError.value = ''
  suggestedGames.value = []
  try {
    suggestedGames.value = await generateMatches(geminiPrompt.value)
  } catch (e) {
    geminiError.value = e.message
  } finally {
    geminiLoading.value = false
  }
}

async function confirmGames() {
  savingGames.value = true
  let count = 0
  for (const g of suggestedGames.value) {
    try {
      await gamesStore.createGame(g)
      count++
    } catch (_) { /* skip individual failures */ }
  }
  gamesSavedCount.value = count
  gamesSaved.value = true
  suggestedGames.value = []
  savingGames.value = false
  await gamesStore.fetchGames()
}

// --- Games tab ---
const phaseMap = {
  group: 'Fase de grupos', round_of_16: 'Oitavas', quarter: 'Quartas', semi: 'Semifinal', final: 'Final',
}
const statusOptions = [
  { title: 'Em breve',   value: 'upcoming' },
  { title: 'Aberto',     value: 'open' },
  { title: 'Encerrado',  value: 'closed' },
  { title: 'Ao vivo',    value: 'live' },
  { title: 'Finalizado', value: 'finished' },
]
const phaseOptions = [
  { title: 'Fase de grupos', value: 'group' },
  { title: 'Oitavas',        value: 'round_of_16' },
  { title: 'Quartas',        value: 'quarter' },
  { title: 'Semifinal',      value: 'semi' },
  { title: 'Final',          value: 'final' },
]

async function updateStatus(id, status) {
  await gamesStore.updateGame(id, { status })
}

const gameDialog  = ref(false)
const editGame    = ref(null)
const savingGame  = ref(false)
const gameFormRef = ref(null)
const gameForm    = reactive({
  team_a: '', team_b: '', flag_a: '', flag_b: '',
  match_date: '', phase: 'group', group_name: '',
})

function openNewGameDialog() {
  editGame.value = null
  Object.assign(gameForm, { team_a: '', team_b: '', flag_a: '', flag_b: '', match_date: '', phase: 'group', group_name: '' })
  gameDialog.value = true
}

function openEditDialog(game) {
  editGame.value = game
  Object.assign(gameForm, {
    team_a: game.team_a, team_b: game.team_b,
    flag_a: game.flag_a ?? '', flag_b: game.flag_b ?? '',
    match_date: game.match_date?.slice(0, 16) ?? '',
    phase: game.phase, group_name: game.group_name ?? '',
  })
  gameDialog.value = true
}

async function saveGame() {
  const { valid } = await gameFormRef.value.validate()
  if (!valid) return
  savingGame.value = true
  try {
    if (editGame.value?.id) {
      await gamesStore.updateGame(editGame.value.id, { ...gameForm })
    } else {
      await gamesStore.createGame({ ...gameForm })
    }
    gameDialog.value = false
  } finally {
    savingGame.value = false
  }
}

// --- Results tab ---
const pendingResults = computed(() =>
  gamesStore.games.filter(g => g.status === 'closed' || g.status === 'live')
)

const resultInputs = computed(() => {
  const map = {}
  pendingResults.value.forEach(g => {
    if (!map[g.id]) map[g.id] = reactive({ a: 0, b: 0 })
  })
  return map
})

const savingResult = reactive({})

async function saveResult(game) {
  savingResult[game.id] = true
  try {
    await gamesStore.setResult(game.id, resultInputs.value[game.id].a, resultInputs.value[game.id].b)
  } finally {
    savingResult[game.id] = false
  }
}

function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

onMounted(() => gamesStore.fetchGames())
</script>
