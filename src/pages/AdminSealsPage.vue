<template>
  <AppLayout>
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row justify-sm-space-between align-sm-center mb-6" style="gap:12px">
      <div>
        <div class="text-h5 font-weight-bold d-flex align-center" style="gap:8px">
          <v-icon icon="mdi-seal" color="amber-darken-2" size="28" />
          Selos da Copa
        </div>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Configure quantos selos cada ação concede aos jogadores
        </p>
      </div>
      <v-btn
        color="green-darken-3"
        prepend-icon="mdi-plus"
        rounded="lg"
        class="align-self-start align-self-sm-center"
        @click="openNewDialog"
      >
        Novo Evento
      </v-btn>
    </div>

    <!-- Loading -->
    <v-progress-linear
      v-if="store.loading"
      indeterminate
      color="amber-darken-2"
      class="mb-4"
    />

    <!-- Cards de resumo -->
    <v-row v-if="!store.loading && store.rewards.length" class="mb-6">
      <v-col cols="12" sm="4">
        <v-card elevation="1" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-center justify-sm-start" style="gap:12px">
            <v-avatar color="amber-lighten-4" size="44">
              <v-icon icon="mdi-format-list-bulleted" color="amber-darken-3" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ store.rewards.length }}</div>
              <div class="text-caption text-medium-emphasis">Tipos de evento</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card elevation="1" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-center justify-sm-start" style="gap:12px">
            <v-avatar color="green-lighten-4" size="44">
              <v-icon icon="mdi-treasure-chest" color="green-darken-3" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">
                {{ dailySeals }}
                <v-icon icon="mdi-seal" color="amber-darken-2" size="18" />
              </div>
              <div class="text-caption text-medium-emphasis">Selos por login diário</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card elevation="1" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-center justify-sm-start" style="gap:12px">
            <v-avatar color="blue-lighten-4" size="44">
              <v-icon icon="mdi-bullseye-arrow" color="blue-darken-3" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">
                {{ perfectGameSeals }}
                <v-icon icon="mdi-seal" color="amber-darken-2" size="18" />
              </div>
              <div class="text-caption text-medium-emphasis">Selos num jogo perfeito</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado vazio -->
    <EmptyState
      v-if="!store.loading && !store.rewards.length"
      icon="mdi-seal"
      icon-color="amber-darken-2"
      title="Nenhum evento cadastrado"
      description="Cadastre os eventos e defina quantos selos cada ação concede aos jogadores."
      action-text="Novo Evento"
      action-icon="mdi-plus"
      min-height="calc(100vh - 280px)"
      @action="openNewDialog"
    />

    <!-- Tabela -->
    <v-card v-if="!store.loading && store.rewards.length" elevation="2" class="pa-4">
      <p class="text-caption text-medium-emphasis mb-4">
        {{ activeCount }} ativo{{ activeCount !== 1 ? 's' : '' }} de {{ store.rewards.length }} evento{{ store.rewards.length !== 1 ? 's' : '' }}
      </p>

      <!-- Tabela: visível apenas em sm+ -->
      <v-table class="d-none d-sm-block">
        <thead>
          <tr>
            <th style="width:56px"></th>
            <th>Evento</th>
            <th class="d-none d-sm-table-cell">Chave</th>
            <th>Selos</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reward in store.rewards" :key="reward.id">
            <td>
              <v-avatar size="38" :color="reward.active ? 'amber-lighten-4' : 'grey-lighten-3'" rounded="md">
                <v-icon :icon="reward.icon || 'mdi-seal'" :color="reward.active ? 'amber-darken-3' : 'grey'" size="22" />
              </v-avatar>
            </td>
            <td>
              <div class="font-weight-medium">{{ reward.label }}</div>
              <div v-if="reward.description" class="text-caption text-medium-emphasis">{{ reward.description }}</div>
            </td>
            <td class="d-none d-sm-table-cell">
              <v-chip size="x-small" variant="outlined" color="blue-grey">{{ reward.event_key }}</v-chip>
            </td>
            <td>
              <div class="d-flex align-center" style="gap:4px">
                <span class="text-h6 font-weight-bold" :style="reward.active ? 'color:#f57f17' : 'color:#9e9e9e'">
                  {{ reward.seals }}
                </span>
                <v-icon icon="mdi-seal" :color="reward.active ? 'amber-darken-2' : 'grey-lighten-1'" size="16" />
              </div>
            </td>
            <td>
              <v-chip
                :color="reward.active ? 'green' : 'grey'"
                size="x-small"
                variant="tonal"
              >
                {{ reward.active ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </td>
            <td>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                title="Editar"
                @click="openEditDialog(reward)"
              />
              <v-btn
                :icon="reward.active ? 'mdi-eye-off' : 'mdi-eye'"
                size="small"
                variant="text"
                :color="reward.active ? 'orange' : 'green'"
                :title="reward.active ? 'Desativar' : 'Reativar'"
                @click="handleToggleActive(reward)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="red"
                title="Excluir"
                @click="openDeleteDialog(reward)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Cards: visíveis apenas no mobile -->
      <div class="d-flex d-sm-none flex-column" style="gap:12px">
        <v-card
          v-for="reward in store.rewards"
          :key="reward.id"
          variant="outlined"
          class="pa-3"
        >
          <!-- Linha 1: ícone + nome -->
          <div class="d-flex align-center mb-1" style="gap:10px">
            <v-avatar size="38" :color="reward.active ? 'amber-lighten-4' : 'grey-lighten-3'" rounded="md">
              <v-icon :icon="reward.icon || 'mdi-seal'" :color="reward.active ? 'amber-darken-3' : 'grey'" size="22" />
            </v-avatar>
            <span class="font-weight-medium">{{ reward.label }}</span>
          </div>

          <!-- Linha 2: descrição -->
          <div v-if="reward.description" class="text-caption text-medium-emphasis mb-2 pl-1">
            {{ reward.description }}
          </div>

          <!-- Linha 3: selos + status -->
          <div class="d-flex align-center mb-2" style="gap:12px">
            <div class="d-flex align-center" style="gap:4px">
              <span class="text-h6 font-weight-bold" :style="reward.active ? 'color:#f57f17' : 'color:#9e9e9e'">
                {{ reward.seals }}
              </span>
              <v-icon icon="mdi-seal" :color="reward.active ? 'amber-darken-2' : 'grey-lighten-1'" size="16" />
            </div>
            <v-chip :color="reward.active ? 'green' : 'grey'" size="x-small" variant="tonal">
              {{ reward.active ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </div>

          <!-- Linha 4: ações -->
          <div class="d-flex" style="gap:8px">
            <v-btn
              prepend-icon="mdi-pencil"
              size="small"
              variant="tonal"
              class="flex-1-1"
              @click="openEditDialog(reward)"
            >
              Editar
            </v-btn>
            <v-btn
              :prepend-icon="reward.active ? 'mdi-eye-off' : 'mdi-eye'"
              size="small"
              variant="tonal"
              :color="reward.active ? 'orange' : 'green'"
              class="flex-1-1"
              @click="handleToggleActive(reward)"
            >
              {{ reward.active ? 'Desativar' : 'Reativar' }}
            </v-btn>
            <v-btn
              prepend-icon="mdi-delete"
              size="small"
              variant="tonal"
              color="red"
              class="flex-1-1"
              @click="openDeleteDialog(reward)"
            >
              Excluir
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-card>

    <!-- Dialog Criar / Editar -->
    <v-dialog v-model="rewardDialog" max-width="520" persistent>
      <v-card class="pa-6">
        <div class="d-flex align-center mb-5" style="gap:10px">
          <v-avatar color="amber-lighten-4" size="40">
            <v-icon :icon="rewardForm.icon || 'mdi-seal'" color="amber-darken-3" size="22" />
          </v-avatar>
          <div class="text-h6">
            {{ editReward?.id ? 'Editar Evento' : 'Novo Evento' }}
          </div>
        </div>

        <v-form @submit.prevent="saveReward" ref="rewardFormRef">
          <v-text-field
            v-model="rewardForm.label"
            label="Nome do evento"
            prepend-inner-icon="mdi-tag-outline"
            :rules="[v => !!v || 'Nome obrigatório']"
            class="mb-2"
          />

          <v-text-field
            v-model="rewardForm.event_key"
            label="Chave do evento (slug)"
            prepend-inner-icon="mdi-key-outline"
            :rules="[v => !!v || 'Chave obrigatória', v => /^[a-z0-9_]+$/.test(v) || 'Use apenas letras minúsculas, números e _']"
            :disabled="!!editReward?.id"
            hint="Ex: daily_chest, exact_score. Não pode ser alterada depois."
            persistent-hint
            class="mb-2"
          />

          <v-textarea
            v-model="rewardForm.description"
            label="Descrição (opcional)"
            prepend-inner-icon="mdi-text-outline"
            rows="2"
            auto-grow
            class="mb-2"
          />

          <div class="d-flex align-center mb-2" style="gap:12px">
            <v-text-field
              v-model.number="rewardForm.seals"
              label="Quantidade de selos"
              prepend-inner-icon="mdi-seal"
              type="number"
              min="0"
              :rules="[v => v >= 0 || 'Valor deve ser 0 ou maior']"
              style="flex:1"
            />
            <div class="d-flex flex-column align-center pb-4" style="min-width:64px">
              <span class="text-h4 font-weight-bold" style="color:#f57f17;line-height:1">
                {{ rewardForm.seals || 0 }}
              </span>
              <v-icon icon="mdi-seal" color="amber-darken-2" size="20" />
            </div>
          </div>

          <div class="d-flex align-center mb-4" style="gap:12px">
            <v-text-field
              v-model="rewardForm.icon"
              label="Ícone MDI (ex: mdi-trophy)"
              prepend-inner-icon="mdi-image-outline"
              hint="Visite materialdesignicons.com para nomes"
              persistent-hint
              style="flex:1"
            />
            <v-avatar color="amber-lighten-4" size="44" rounded="md" class="mb-4">
              <v-icon :icon="rewardForm.icon || 'mdi-seal'" color="amber-darken-3" size="24" />
            </v-avatar>
          </div>

          <v-switch
            v-model="rewardForm.active"
            label="Evento ativo"
            color="green-darken-3"
            hide-details
            class="mb-4"
          />

          <v-alert
            v-if="dialogError"
            type="error"
            variant="tonal"
            density="compact"
            closable
            class="mt-2 mb-2"
            @click:close="dialogError = ''"
          >
            {{ dialogError }}
          </v-alert>

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="text" :disabled="saving" @click="closeDialog">
              Cancelar
            </v-btn>
            <v-btn type="submit" color="green-darken-3" :loading="saving">
              Salvar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="pa-6">
        <div class="d-flex align-center mb-4" style="gap:12px">
          <v-icon icon="mdi-delete-outline" color="error" size="28" />
          <span class="text-body-1 font-weight-bold">Remover Evento</span>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Deseja remover o evento "<strong>{{ targetDelete?.label }}</strong>"?
          Esta ação é permanente e não pode ser desfeita.
        </p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" :disabled="deleting" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" :loading="deleting" @click="confirmDelete">
            Excluir
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useSealRewardsStore } from '@/stores/sealRewards'
import { useToastStore } from '@/stores/toast'

const store = useSealRewardsStore()
const toast = useToastStore()

onMounted(() => store.fetchRewards())

const activeCount = computed(() => store.rewards.filter(r => r.active).length)

const dailySeals = computed(() => {
  const r = store.rewards.find(r => r.event_key === 'daily_chest' && r.active)
  return r?.seals ?? 0
})

const perfectGameSeals = computed(() => {
  const keys = ['exact_score', 'bet_sent', 'knockout_bonus']
  return store.rewards
    .filter(r => keys.includes(r.event_key) && r.active)
    .reduce((sum, r) => sum + r.seals, 0)
})

// --- Dialog criar/editar ---
const rewardDialog  = ref(false)
const editReward    = ref(null)
const saving        = ref(false)
const rewardFormRef = ref(null)
const dialogError   = ref('')

const rewardForm = reactive({
  label:       '',
  event_key:   '',
  description: '',
  seals:       0,
  icon:        'mdi-seal',
  active:      true,
})

function openNewDialog() {
  editReward.value = null
  Object.assign(rewardForm, { label: '', event_key: '', description: '', seals: 0, icon: 'mdi-seal', active: true })
  dialogError.value  = ''
  rewardDialog.value = true
}

function openEditDialog(reward) {
  editReward.value = reward
  Object.assign(rewardForm, {
    label:       reward.label,
    event_key:   reward.event_key,
    description: reward.description ?? '',
    seals:       reward.seals,
    icon:        reward.icon || 'mdi-seal',
    active:      reward.active,
  })
  dialogError.value  = ''
  rewardDialog.value = true
}

function closeDialog() {
  rewardDialog.value = false
}

async function saveReward() {
  const { valid } = await rewardFormRef.value.validate()
  if (!valid) return
  saving.value      = true
  dialogError.value = ''
  try {
    const payload = {
      label:       rewardForm.label,
      event_key:   rewardForm.event_key,
      description: rewardForm.description || null,
      seals:       Number(rewardForm.seals),
      icon:        rewardForm.icon || 'mdi-seal',
      active:      rewardForm.active,
    }
    if (editReward.value?.id) {
      delete payload.event_key
      await store.updateReward(editReward.value.id, payload)
      toast.notify('Evento atualizado!')
    } else {
      await store.addReward(payload)
      toast.notify('Evento criado!')
    }
    closeDialog()
  } catch (e) {
    dialogError.value = e.message || 'Erro ao salvar evento.'
  } finally {
    saving.value = false
  }
}

async function handleToggleActive(reward) {
  try {
    await store.toggleActive(reward.id, !reward.active)
    toast.notify(reward.active ? 'Evento desativado.' : 'Evento reativado!')
  } catch (e) {
    toast.notify(e.message || 'Erro ao alterar status.', 'error')
  }
}

// --- Dialog exclusão ---
const deleteDialog = ref(false)
const targetDelete = ref(null)
const deleting     = ref(false)

function openDeleteDialog(reward) {
  targetDelete.value = reward
  deleteDialog.value = true
}

async function confirmDelete() {
  deleting.value = true
  try {
    await store.deleteReward(targetDelete.value.id)
    toast.notify('Evento removido.')
    deleteDialog.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao excluir.', 'error')
  } finally {
    deleting.value = false
  }
}
</script>
