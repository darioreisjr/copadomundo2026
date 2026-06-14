<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-4">Painel Administrativo</div>

    <!-- Select visível apenas no mobile -->
    <v-select
      v-model="tab"
      :items="[
        { title: 'Importar jogos',     value: 'gemini'  },
        { title: 'Gerenciar jogos',    value: 'games'   },
        { title: 'Inserir resultados', value: 'results' },
      ]"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="comfortable"
      color="green-darken-3"
      class="d-flex d-sm-none mb-4"
    />

    <!-- Tabs visíveis apenas em sm+ -->
    <v-tabs v-model="tab" color="green-darken-3" class="d-none d-sm-flex mb-6">
      <v-tab value="gemini">Importar jogos</v-tab>
      <v-tab value="games">Gerenciar jogos</v-tab>
      <v-tab value="results">Inserir resultados</v-tab>
    </v-tabs>

    <!-- ===== TAB: GEMINI ===== -->
    <v-window v-model="tab">
      <v-window-item value="gemini">
        <!-- Estado vazio: nenhuma ação iniciada e sem resultado anterior -->
        <div
          v-if="!geminiLoading && !suggestedGames.length && !syncResult && !geminiError"
          class="d-flex flex-column align-center justify-center text-center"
          style="min-height: calc(100vh - 200px);"
        >
          <v-icon icon="mdi-cloud-download-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
          <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">
            Importar jogos da Copa do Mundo 2026
          </p>
          <p class="text-body-2 text-medium-emphasis mb-6" style="max-width:400px">
            Os jogos são buscados do calendário oficial da FIFA via OpenFootball. O Gemini adiciona traduções e emojis de bandeiras. Revise os dados antes de salvar.
          </p>
          <v-btn
            color="green-darken-3"
            prepend-icon="mdi-soccer"
            size="large"
            rounded="lg"
            @click="callGemini"
          >
            Importar jogos
          </v-btn>
        </div>

        <!-- Loading -->
        <div
          v-else-if="geminiLoading"
          class="d-flex flex-column align-center justify-center text-center"
          style="min-height: calc(100vh - 200px);"
        >
          <v-progress-circular indeterminate color="green-darken-3" size="64" width="5" class="mb-6" />
          <p class="text-h6 font-weight-medium text-medium-emphasis mb-1">
            {{ geminiProgress?.message ?? 'Carregando...' }}
          </p>
          <p class="text-body-2 text-medium-emphasis">Aguarde, isso pode levar alguns segundos.</p>
        </div>

        <!-- Conteúdo: jogos sugeridos ou resultado da sync -->
        <v-card v-else class="pa-6" elevation="2">
          <v-alert v-if="geminiError" type="error" class="mb-4" closable @click:close="geminiError = ''">
            {{ geminiError }}
          </v-alert>

          <!-- Resultado da sincronização -->
          <v-alert
            v-if="syncResult"
            :type="syncResult.errors > 0 ? 'warning' : 'success'"
            class="mb-6"
            variant="tonal"
          >
            <div v-if="syncResult.inserted > 0">{{ syncResult.inserted }} jogo(s) novo(s) inserido(s)</div>
            <div v-if="syncResult.updated > 0">{{ syncResult.updated }} jogo(s) atualizado(s)</div>
            <div v-if="syncResult.unchanged > 0">{{ syncResult.unchanged }} jogo(s) sem alteração</div>
            <div v-if="syncResult.errors > 0">{{ syncResult.errors }} erro(s) ao salvar</div>
            <div v-if="syncResult.inserted === 0 && syncResult.updated === 0 && syncResult.errors === 0">
              Nenhuma alteração — todos os jogos já estão atualizados.
            </div>
          </v-alert>

          <template v-if="suggestedGames.length">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="text-subtitle-1 font-weight-medium">
                Jogos encontrados ({{ suggestedGames.length }}) — revise antes de confirmar:
              </div>
              <div class="d-flex ga-2">
                <v-btn variant="tonal" prepend-icon="mdi-refresh" @click="callGemini">Reimportar</v-btn>
                <v-btn
                  color="green-darken-3"
                  prepend-icon="mdi-check-all"
                  :loading="savingGames"
                  @click="confirmGames"
                >
                  Confirmar e sincronizar
                </v-btn>
              </div>
            </div>

            <v-table>
              <thead>
                <tr>
                  <th>Seleção A</th>
                  <th>Seleção B</th>
                  <th>Data</th>
                  <th>Fase</th>
                  <th>Grupo</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(g, idx) in suggestedGames" :key="idx">
                  <td>{{ g.flag_a }} {{ g.team_a }}</td>
                  <td>{{ g.flag_b }} {{ g.team_b }}</td>
                  <td>{{ formatDate(g.match_date) }}</td>
                  <td>{{ phaseMap[g.phase] ?? g.phase }}</td>
                  <td>{{ g.group_name ?? '-' }}</td>
                  <td>
                    <v-chip :color="gameChipColor(g)" size="x-small" variant="tonal">
                      {{ gameChipLabel(g) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn icon="mdi-delete" size="small" variant="text" color="red"
                      @click="suggestedGames.splice(idx, 1)" />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </template>

          <div v-if="syncResult && !suggestedGames.length" class="d-flex justify-center mt-4">
            <v-btn variant="tonal" prepend-icon="mdi-refresh" @click="callGemini">Importar novamente</v-btn>
          </div>
        </v-card>
      </v-window-item>

      <!-- ===== TAB: MANAGE GAMES ===== -->
      <v-window-item value="games">
        <!-- Loading -->
        <v-progress-linear v-if="gamesStore.loading" indeterminate color="green-darken-3" class="mb-4" />

        <!-- Estado vazio -->
        <div
          v-else-if="!gamesStore.games.length"
          class="d-flex flex-column align-center justify-center text-center"
          style="min-height: calc(100vh - 200px);"
        >
          <v-icon icon="mdi-calendar-blank-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
          <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">
            Nenhum jogo cadastrado
          </p>
          <p class="text-body-2 text-medium-emphasis mb-6" style="max-width:360px">
            Adicione jogos manualmente ou use a aba "Importar jogos" para buscar o calendário oficial da Copa 2026.
          </p>
          <div class="d-flex ga-3">
            <v-btn
              color="green-darken-3"
              prepend-icon="mdi-plus"
              size="large"
              rounded="lg"
              @click="openNewGameDialog"
            >
              Novo jogo
            </v-btn>
            <v-btn
              variant="tonal"
              prepend-icon="mdi-cloud-download-outline"
              size="large"
              rounded="lg"
              @click="tab = 'gemini'"
            >
              Importar jogos
            </v-btn>
          </div>
        </div>

        <!-- Tabela com jogos -->
        <v-card v-else class="pa-6" elevation="2">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 font-weight-medium">Jogos cadastrados ({{ gamesStore.games.length }})</div>
            <v-btn
              color="green-darken-3"
              prepend-icon="mdi-plus"
              @click="openNewGameDialog"
            >
              Novo jogo
            </v-btn>
          </div>

          <v-table>
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
                  <div v-if="!['live', 'finished'].includes(game.status)" class="mb-1">
                    <v-chip :color="statusMap[effectiveStatus(game)]?.color" size="small" label>
                      {{ statusMap[effectiveStatus(game)]?.label ?? effectiveStatus(game) }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis ml-1">(auto)</span>
                  </div>
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
        <!-- Loading -->
        <v-progress-linear v-if="gamesStore.loading" indeterminate color="green-darken-3" class="mb-4" />

        <!-- Estado vazio -->
        <div
          v-else-if="!pendingResults.length"
          class="d-flex flex-column align-center justify-center text-center"
          style="min-height: calc(100vh - 200px);"
        >
          <v-icon icon="mdi-scoreboard-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
          <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">
            Nenhum resultado para inserir
          </p>
          <p class="text-body-2 text-medium-emphasis mb-6" style="max-width:380px">
            Os jogos aparecerão aqui assim que estiverem com status "Ao vivo" ou "Encerrado". Gerencie os status na aba "Gerenciar jogos".
          </p>
          <v-btn
            variant="tonal"
            prepend-icon="mdi-calendar-check-outline"
            size="large"
            rounded="lg"
            @click="tab = 'games'"
          >
            Gerenciar jogos
          </v-btn>
        </div>

        <!-- Tabela de resultados -->
        <v-card v-else class="pa-6" elevation="2">
          <div class="text-subtitle-1 font-weight-medium mb-4">
            Jogos aguardando resultado ({{ pendingResults.length }}) — a pontuação será calculada automaticamente.
          </div>

          <v-table>
            <thead>
              <tr>
                <th>Jogo</th>
                <th>Data</th>
                <th class="text-center" style="width:90px">Placar A</th>
                <th class="text-center" style="width:90px">Placar B</th>
                <th class="text-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in pendingResults" :key="game.id">
                <td>{{ game.team_a }} x {{ game.team_b }}</td>
                <td>{{ formatDate(game.match_date) }}</td>
                <td class="text-center" style="width:90px">
                  <v-text-field
                    v-model.number="resultInputs[game.id].a"
                    type="number" min="0" max="99"
                    placeholder="0"
                    density="compact" variant="outlined" hide-details
                    style="min-width:70px"
                  />
                </td>
                <td class="text-center" style="width:90px">
                  <v-text-field
                    v-model.number="resultInputs[game.id].b"
                    type="number" min="0" max="99"
                    placeholder="0"
                    density="compact" variant="outlined" hide-details
                    style="min-width:70px"
                  />
                </td>
                <td class="text-center">
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
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { getEffectiveStatus } from '@/composables/useBetWindow'
import { useGamesStore } from '@/stores/games'
import { enrichTeams } from '@/lib/gemini'
import { fetchWorldCupMatches } from '@/lib/footballApi'
import { phaseMap } from '@/utils/phaseMap'

const gamesStore = useGamesStore()

const tab = ref('gemini')

// --- Importar jogos tab ---
const geminiLoading   = ref(false)
const geminiError     = ref('')
const geminiProgress  = ref(null)
const suggestedGames  = ref([])
const savingGames     = ref(false)

async function callGemini() {
  geminiLoading.value = true
  geminiError.value = ''
  geminiProgress.value = { step: 'api', message: 'Buscando jogos oficiais da FIFA...' }
  suggestedGames.value = []
  try {
    // Etapa 1: busca da API (~200ms)
    const rawMatches = await fetchWorldCupMatches()

    // Etapa 2: Gemini traduz e adiciona emojis (só 48 nomes, ~3-5s)
    geminiProgress.value = { step: 'gemini', message: 'Adicionando traduções e bandeiras via Gemini...' }
    const uniqueTeams = [...new Set(rawMatches.flatMap(m => [m.team1, m.team2]))]
    const enrichment = await enrichTeams(uniqueTeams)

    // Etapa 3: mescla
    suggestedGames.value = rawMatches.map(m => ({
      team_a: enrichment[m.team1]?.pt ?? m.team1,
      team_b: enrichment[m.team2]?.pt ?? m.team2,
      flag_a: enrichment[m.team1]?.emoji ?? '🏳️',
      flag_b: enrichment[m.team2]?.emoji ?? '🏳️',
      match_date: m.match_date,
      phase: m.phase,
      group_name: m.group_name,
    }))
  } catch (e) {
    geminiError.value = e.message
  } finally {
    geminiLoading.value = false
    geminiProgress.value = null
  }
}

const COMPARABLE_FIELDS = ['flag_a', 'flag_b', 'phase', 'group_name']
const syncResult = ref(null)

function classifyGame(incoming) {
  const existing = gamesStore.games.find(
    g => g.team_a === incoming.team_a && g.team_b === incoming.team_b
  )
  if (!existing) return { status: 'new', existing: null, changed: [] }

  const changed = COMPARABLE_FIELDS.filter(
    f => String(existing[f] ?? '') !== String(incoming[f] ?? '')
  )
  const inDate = new Date(incoming.match_date).toISOString().slice(0, 16)
  const exDate = new Date(existing.match_date).toISOString().slice(0, 16)
  if (inDate !== exDate) changed.push('match_date')

  return changed.length > 0
    ? { status: 'changed', existing, changed }
    : { status: 'unchanged', existing, changed: [] }
}

function gameChipColor(g) {
  const { status } = classifyGame(g)
  return status === 'new' ? 'green' : status === 'changed' ? 'orange' : 'grey'
}

function gameChipLabel(g) {
  const { status } = classifyGame(g)
  return status === 'new' ? 'Novo' : status === 'changed' ? 'Alterado' : 'Igual'
}

async function confirmGames() {
  savingGames.value = true
  syncResult.value = null
  const results = { inserted: 0, updated: 0, unchanged: 0, errors: 0 }

  for (const g of suggestedGames.value) {
    const { status, existing } = classifyGame(g)
    if (status === 'unchanged') {
      results.unchanged++
      continue
    }
    try {
      if (status === 'new') {
        await gamesStore.createGame(g)
        results.inserted++
      } else {
        await gamesStore.updateGame(existing.id, g)
        results.updated++
      }
    } catch (_) {
      results.errors++
    }
  }

  syncResult.value = results
  suggestedGames.value = []
  savingGames.value = false
  await gamesStore.fetchGames()
}

// --- Games tab ---
const statusOptions = [
  { title: 'Em breve',   value: 'upcoming' },
  { title: 'Aberto',     value: 'open' },
  { title: 'Encerrado',  value: 'closed' },
  { title: 'Ao vivo',    value: 'live' },
  { title: 'Finalizado', value: 'finished' },
]
const statusMap = {
  upcoming: { label: 'Em breve',   color: 'grey' },
  open:     { label: 'Aberto',     color: 'green' },
  closed:   { label: 'Encerrado',  color: 'orange' },
  live:     { label: 'Ao vivo',    color: 'red' },
  finished: { label: 'Finalizado', color: 'blue' },
}

const nowTick = ref(Date.now())
let nowTickTimer
onMounted(() => {
  nowTickTimer = setInterval(() => { nowTick.value = Date.now() }, 60000)
})
onUnmounted(() => clearInterval(nowTickTimer))

function effectiveStatus(game) {
  return getEffectiveStatus(game, nowTick.value)
}
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
    if (!map[g.id]) map[g.id] = reactive({ a: null, b: null })
  })
  return map
})

const savingResult = reactive({})

async function saveResult(game) {
  const inp = resultInputs.value[game.id]
  if (inp.a === null || inp.b === null || inp.a < 0 || inp.b < 0) {
    alert('Preencha os dois placares antes de salvar.')
    return
  }
  savingResult[game.id] = true
  try {
    await gamesStore.setResult(game.id, inp.a, inp.b)
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
