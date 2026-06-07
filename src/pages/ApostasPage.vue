<template>
  <AppLayout>

    <!-- Cabeçalho -->
    <div class="d-flex align-center gap-3 mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Apostas entre Jogadores</h1>
        <p class="text-caption text-medium-emphasis">Aposte selos contra outros jogadores</p>
      </div>
      <v-spacer />
      <v-btn
        color="green-darken-3"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="showCreateDialog = true"
      >
        Nova Aposta
      </v-btn>
    </div>

    <!-- Tabs -->
    <v-card elevation="2" rounded="lg">
      <v-tabs v-model="tab" color="green-darken-3" grow>
        <v-tab value="minhas">
          <v-icon start icon="mdi-account-check" />
          Minhas Apostas
        </v-tab>
        <v-tab value="disponiveis">
          <v-icon start icon="mdi-earth" />
          Disponíveis
        </v-tab>
        <v-tab value="desafios">
          <v-badge
            :content="apostasStore.directChallenges.length"
            :model-value="apostasStore.directChallenges.length > 0"
            color="red"
          >
            <v-icon icon="mdi-sword-cross" />
          </v-badge>
          <span class="ml-2">Desafios</span>
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-window v-model="tab">

        <!-- Tab: Minhas Apostas -->
        <v-window-item value="minhas">
          <div class="pa-4">
            <!-- Cards de resumo -->
            <v-row dense class="mb-4">
              <v-col cols="6">
                <v-card color="green-lighten-4" variant="flat" rounded="lg" class="pa-3 text-center">
                  <div class="text-h6 font-weight-bold text-green-darken-3">{{ apostasStore.activeWagers.length }}</div>
                  <div class="text-caption text-medium-emphasis">Apostas Ativas</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card color="amber-lighten-4" variant="flat" rounded="lg" class="pa-3 text-center">
                  <div class="d-flex align-center justify-center gap-1">
                    <v-icon icon="mdi-seal" color="amber-darken-3" size="18" />
                    <span class="text-h6 font-weight-bold text-amber-darken-3">{{ apostasStore.totalSealsAtStake }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis">Selos em Jogo</div>
                </v-card>
              </v-col>
            </v-row>

            <v-progress-linear v-if="apostasStore.loading" indeterminate color="green-darken-3" class="mb-3" />

            <!-- Em andamento -->
            <template v-if="apostasStore.activeWagers.length > 0">
              <div class="text-caption font-weight-bold text-medium-emphasis mb-2 text-uppercase" style="letter-spacing:.08em">
                Em andamento
              </div>
              <v-row dense class="mb-4">
                <v-col cols="12" sm="6" v-for="w in apostasStore.activeWagers" :key="w.id">
                  <WagerCard
                    :wager="w"
                    mode="mine"
                    :has-palpite="false"
                    @cancel="handleCancel"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- Histórico -->
            <template v-if="apostasStore.settledWagers.length > 0">
              <div class="text-caption font-weight-bold text-medium-emphasis mb-2 text-uppercase" style="letter-spacing:.08em">
                Histórico
              </div>
              <v-row dense class="mb-3">
                <v-col cols="12">
                  <v-card color="blue-lighten-4" variant="flat" rounded="lg" class="pa-3 text-center">
                    <div class="text-h6 font-weight-bold text-blue-darken-3">{{ apostasStore.wonCount }}</div>
                    <div class="text-caption text-medium-emphasis">Apostas Ganhas</div>
                  </v-card>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" v-for="w in apostasStore.settledWagers" :key="w.id">
                  <WagerCard
                    :wager="w"
                    mode="mine"
                    :has-palpite="false"
                    @cancel="handleCancel"
                  />
                </v-col>
              </v-row>
            </template>

            <!-- Vazio -->
            <div
              v-if="!apostasStore.loading && apostasStore.myWagers.length === 0"
              class="text-center py-10"
            >
              <v-icon icon="mdi-handshake-outline" size="48" color="grey-lighten-1" class="mb-3" />
              <div class="text-body-1 text-medium-emphasis">Você ainda não tem apostas.</div>
              <div class="text-caption text-medium-emphasis mb-4">
                Crie uma aposta ou aceite uma disponível.
              </div>
              <v-btn color="green-darken-3" variant="flat" prepend-icon="mdi-plus" @click="showCreateDialog = true">
                Criar Aposta
              </v-btn>
            </div>
          </div>
        </v-window-item>

        <!-- Tab: Disponíveis -->
        <v-window-item value="disponiveis">
          <div class="pa-4">
            <!-- Filtro por jogo -->
            <v-select
              v-model="filterGameId"
              :items="openGames"
              item-title="label"
              item-value="id"
              label="Filtrar por jogo"
              prepend-inner-icon="mdi-soccer"
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
              @update:model-value="handleGameFilter"
            />

            <v-progress-linear v-if="apostasStore.loading" indeterminate color="green-darken-3" class="mb-3" />

            <v-row dense v-if="apostasStore.openWagers.length > 0">
              <v-col cols="12" sm="6" v-for="w in apostasStore.openWagers" :key="w.id">
                <WagerCard
                  :wager="w"
                  mode="available"
                  :has-palpite="hasPalpiteForGame(w.game_id)"
                  @accept="handleAccept"
                />
              </v-col>
            </v-row>

            <div
              v-if="!apostasStore.loading && apostasStore.openWagers.length === 0"
              class="text-center py-10"
            >
              <v-icon icon="mdi-earth-off" size="48" color="grey-lighten-1" class="mb-3" />
              <div class="text-body-1 text-medium-emphasis">Nenhuma aposta aberta no momento.</div>
            </div>
          </div>
        </v-window-item>

        <!-- Tab: Desafios -->
        <v-window-item value="desafios">
          <div class="pa-4">
            <v-progress-linear v-if="apostasStore.loading" indeterminate color="green-darken-3" class="mb-3" />

            <v-row dense v-if="apostasStore.directChallenges.length > 0">
              <v-col cols="12" sm="6" v-for="w in apostasStore.directChallenges" :key="w.id">
                <WagerCard
                  :wager="w"
                  mode="challenge"
                  :has-palpite="hasPalpiteForGame(w.game_id)"
                  @accept="handleAccept"
                />
              </v-col>
            </v-row>

            <div
              v-if="!apostasStore.loading && apostasStore.directChallenges.length === 0"
              class="text-center py-10"
            >
              <v-icon icon="mdi-sword-cross" size="48" color="grey-lighten-1" class="mb-3" />
              <div class="text-body-1 text-medium-emphasis">Nenhum desafio direto pendente.</div>
            </div>
          </div>
        </v-window-item>

      </v-window>
    </v-card>

    <!-- Diálogo de criação sem jogo específico -->
    <CriarApostaDialog
      v-if="showCreateDialog && selectedGameForCreate"
      v-model="showCreateDialog"
      :game-id="selectedGameForCreate.id"
      :game-name="`${selectedGameForCreate.team_a} vs ${selectedGameForCreate.team_b}`"
      @created="onWagerCreated"
    />

    <!-- Seletor de jogo antes de criar -->
    <v-dialog v-model="showGamePicker" max-width="440">
      <v-card rounded="lg">
        <v-toolbar color="green-darken-4" flat>
          <v-toolbar-title class="text-white">Escolha o Jogo</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" color="white" @click="showGamePicker = false" />
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-list>
            <v-list-item
              v-for="g in openGames"
              :key="g.id"
              :subtitle="formatDate(g.match_date)"
              class="mb-1"
              rounded="lg"
              @click="selectGameAndCreate(g)"
            >
              <template #title>
                <span>{{ g.flag_a }} {{ g.team_a }} vs {{ g.team_b }} {{ g.flag_b }}</span>
              </template>
            </v-list-item>
            <div v-if="openGames.length === 0" class="text-center text-medium-emphasis py-4">
              Nenhum jogo aberto para apostas no momento.
            </div>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar de feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3500" location="bottom">
      {{ snackbar.message }}
    </v-snackbar>

  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import WagerCard from '@/components/WagerCard.vue'
import CriarApostaDialog from '@/components/CriarApostaDialog.vue'
import { useApostasStore } from '@/stores/apostas'
import { useBetsStore } from '@/stores/bets'
import { useGamesStore } from '@/stores/games'

const route        = useRoute()
const apostasStore = useApostasStore()
const betsStore    = useBetsStore()
const gamesStore   = useGamesStore()

const tab              = ref('minhas')
const filterGameId     = ref(null)
const showCreateDialog = ref(false)
const showGamePicker   = ref(false)
const selectedGameForCreate = ref(null)

const snackbar = ref({ show: false, message: '', color: 'green-darken-3' })

const openGames = computed(() => {
  return (gamesStore.games || [])
    .filter(g => g.status === 'open')
    .map(g => ({
      ...g,
      label: `${g.flag_a || '🏳️'} ${g.team_a} vs ${g.team_b} ${g.flag_b || '🏳️'}`,
    }))
})

function hasPalpiteForGame(gameId) {
  return betsStore.bets.some(b => b.game_id === gameId)
}

async function handleGameFilter(gameId) {
  await apostasStore.fetchOpenWagers(gameId || null)
}

async function handleAccept(wagerId) {
  const result = await apostasStore.acceptWager(wagerId)
  if (result.success) {
    showSnackbar('Aposta aceita com sucesso!', 'green-darken-3')
  } else {
    showSnackbar(result.error, 'red-darken-2')
  }
}

async function handleCancel(wagerId) {
  const result = await apostasStore.cancelWager(wagerId)
  if (result.success) {
    showSnackbar('Aposta cancelada. Seus selos foram devolvidos.', 'blue-darken-2')
  } else {
    showSnackbar(result.error, 'red-darken-2')
  }
}

function showSnackbar(message, color = 'green-darken-3') {
  snackbar.value = { show: true, message, color }
}

function onWagerCreated() {
  showSnackbar('Aposta criada com sucesso!', 'green-darken-3')
  tab.value = 'minhas'
}

function selectGameAndCreate(game) {
  selectedGameForCreate.value = game
  showGamePicker.value = false
  showCreateDialog.value = true
}

// Botão "Nova Aposta" no cabeçalho abre o picker de jogos primeiro
watch(showCreateDialog, (val) => {
  if (val && !selectedGameForCreate.value) {
    showCreateDialog.value = false
    if (openGames.value.length === 1) {
      selectGameAndCreate(openGames.value[0])
    } else {
      showGamePicker.value = true
    }
  }
  if (!val) {
    selectedGameForCreate.value = null
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(async () => {
  // Inicializar jogos e palpites para verificar hasPalpite
  if (!gamesStore.games?.length) await gamesStore.fetchGames()
  if (!betsStore.bets?.length) await betsStore.fetchMyBets()

  // Pré-filtro por gameId via query param
  const qGameId = route.query.gameId
  if (qGameId) {
    filterGameId.value = qGameId
    tab.value = 'disponiveis'
  }

  await Promise.all([
    apostasStore.fetchMyWagers(),
    apostasStore.fetchOpenWagers(qGameId || null),
    apostasStore.fetchDirectChallenges(),
  ])
})
</script>
