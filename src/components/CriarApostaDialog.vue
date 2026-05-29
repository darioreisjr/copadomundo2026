<template>
  <v-dialog :model-value="modelValue" max-width="520" @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="lg">
      <v-toolbar color="green-darken-4" flat>
        <v-toolbar-title class="text-white font-weight-bold">
          <v-icon icon="mdi-handshake" class="mr-2" />
          Criar Aposta P2P
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" color="white" @click="$emit('update:modelValue', false)" />
      </v-toolbar>

      <!-- Stepper de progresso -->
      <div class="d-flex align-center px-6 pt-4 pb-2 gap-2">
        <template v-for="(label, i) in stepLabels" :key="i">
          <div
            class="step-dot"
            :class="{ active: step === i + 1, done: step > i + 1 }"
          >
            <v-icon v-if="step > i + 1" icon="mdi-check" size="14" />
            <span v-else class="text-caption font-weight-bold">{{ i + 1 }}</span>
          </div>
          <div v-if="i < stepLabels.length - 1" class="step-line" :class="{ done: step > i + 1 }" />
        </template>
      </div>
      <div class="text-center text-caption text-medium-emphasis pb-3">
        {{ stepLabels[step - 1] }}
      </div>

      <v-divider />

      <v-card-text class="pt-4" style="min-height:260px">

        <!-- PASSO 1: Tipo de aposta -->
        <template v-if="step === 1">
          <div class="text-body-2 font-weight-medium mb-3">Escolha o tipo de aposta:</div>
          <v-row dense>
            <v-col cols="12" sm="4" v-for="type in wagerTypes" :key="type.value">
              <v-card
                :color="form.wagerType === type.value ? 'green-darken-3' : 'grey-lighten-4'"
                :variant="form.wagerType === type.value ? 'flat' : 'outlined'"
                class="type-card pa-3 text-center"
                style="cursor:pointer"
                @click="form.wagerType = type.value"
              >
                <v-icon :icon="type.icon" size="32" :color="form.wagerType === type.value ? 'white' : 'grey-darken-2'" class="mb-2" />
                <div :class="['text-body-2 font-weight-bold', form.wagerType === type.value ? 'text-white' : '']">
                  {{ type.label }}
                </div>
                <div :class="['text-caption mt-1', form.wagerType === type.value ? 'text-green-lighten-3' : 'text-medium-emphasis']">
                  {{ type.description }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <!-- PASSO 2: Detalhes -->
        <template v-if="step === 2">
          <!-- Valor da aposta -->
          <v-text-field
            v-model.number="form.amount"
            label="Valor da aposta (selos)"
            type="number"
            :min="1"
            :max="auth.profile?.total_seals ?? 0"
            prepend-inner-icon="mdi-seal"
            variant="outlined"
            density="compact"
            class="mb-3"
            :hint="`Saldo atual: ${auth.profile?.total_seals ?? 0} selos. Após criar: ${afterCreate} selos.`"
            persistent-hint
          />

          <!-- Alvo (duelo direto) -->
          <template v-if="form.wagerType === 'direct'">
            <v-text-field
              v-model="form.targetUsername"
              label="@username do adversário"
              prepend-inner-icon="mdi-at"
              variant="outlined"
              density="compact"
              class="mb-3"
              :error-messages="targetError"
              @input="debouncedCheckTarget"
            />
          </template>

          <!-- Participantes máximos (grupo) -->
          <template v-if="form.wagerType === 'group'">
            <div class="text-body-2 mb-1">
              Máximo de participantes (além de você): <strong>{{ form.maxParticipants }}</strong>
            </div>
            <v-slider
              v-model="form.maxParticipants"
              :min="1"
              :max="9"
              :step="1"
              show-ticks="always"
              tick-size="4"
              color="green-darken-3"
              thumb-label
              class="mb-3"
            />
            <div class="text-caption text-medium-emphasis mb-3">
              Grupo de até {{ form.maxParticipants + 1 }} pessoas (você + {{ form.maxParticipants }})
            </div>
          </template>

          <!-- Mensagem opcional -->
          <v-text-field
            v-model="form.message"
            label="Mensagem/provocação (opcional)"
            prepend-inner-icon="mdi-message-outline"
            variant="outlined"
            density="compact"
            maxlength="120"
            counter
          />
        </template>

        <!-- PASSO 3: Confirmação -->
        <template v-if="step === 3">
          <v-card color="grey-lighten-4" variant="flat" rounded="lg" class="pa-4 mb-4">
            <div class="d-flex align-center gap-3 mb-3">
              <v-icon :icon="selectedType?.icon" color="green-darken-3" size="28" />
              <div>
                <div class="text-body-1 font-weight-bold">{{ selectedType?.label }}</div>
                <div class="text-caption text-medium-emphasis">{{ gameName }}</div>
              </div>
            </div>
            <v-divider class="mb-3" />
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-medium-emphasis">Valor apostado</span>
              <v-chip size="small" color="amber-darken-2" prepend-icon="mdi-seal">
                {{ form.amount }} selos
              </v-chip>
            </div>
            <template v-if="form.wagerType === 'direct'">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2 text-medium-emphasis">Adversário</span>
                <span class="text-body-2 font-weight-medium">@{{ form.targetUsername }}</span>
              </div>
            </template>
            <template v-if="form.wagerType === 'group'">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2 text-medium-emphasis">Vagas</span>
                <span class="text-body-2 font-weight-medium">{{ form.maxParticipants }} participantes + você</span>
              </div>
            </template>
            <template v-if="form.message">
              <div class="d-flex justify-space-between">
                <span class="text-body-2 text-medium-emphasis">Mensagem</span>
                <span class="text-body-2 font-weight-medium font-italic">{{ form.message }}</span>
              </div>
            </template>
            <v-divider class="mt-3 mb-2" />
            <div class="d-flex justify-space-between">
              <span class="text-body-2 text-medium-emphasis">Saldo após criar</span>
              <span class="text-body-2 font-weight-bold" :class="afterCreate < 0 ? 'text-red' : 'text-green-darken-3'">
                {{ afterCreate }} selos
              </span>
            </div>
          </v-card>

          <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-3">
            {{ errorMsg }}
          </v-alert>
        </template>

      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 gap-2">
        <v-btn
          v-if="step > 1"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="step--"
        >
          Voltar
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="step < 3"
          color="green-darken-3"
          variant="flat"
          append-icon="mdi-arrow-right"
          :disabled="!canProceed"
          @click="step++"
        >
          Continuar
        </v-btn>
        <v-btn
          v-if="step === 3"
          color="green-darken-3"
          variant="flat"
          prepend-icon="mdi-check"
          :loading="apostasStore.creating"
          :disabled="afterCreate < 0"
          @click="handleCreate"
        >
          Confirmar e Apostar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useApostasStore } from '@/stores/apostas'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  gameId:     { type: String, required: true },
  gameName:   { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'created'])

const apostasStore = useApostasStore()
const auth         = useAuthStore()

const step = ref(1)
const errorMsg = ref('')
const targetError = ref('')
let targetCheckTimer = null

const form = ref({
  wagerType:       'open',
  amount:          10,
  targetUsername:  '',
  maxParticipants: 2,
  message:         '',
})

const stepLabels = ['Tipo', 'Detalhes', 'Confirmação']

const wagerTypes = [
  {
    value:       'direct',
    label:       'Duelo Direto',
    icon:        'mdi-sword-cross',
    description: 'Desafie um usuário específico',
  },
  {
    value:       'open',
    label:       'Aberta',
    icon:        'mdi-earth',
    description: 'Qualquer um pode aceitar',
  },
  {
    value:       'group',
    label:       'Grupo',
    icon:        'mdi-account-group',
    description: 'Múltiplos jogadores',
  },
]

const selectedType = computed(() => wagerTypes.find(t => t.value === form.value.wagerType))

const afterCreate = computed(() => {
  const balance = auth.profile?.total_seals ?? 0
  return balance - (form.value.amount || 0)
})

const canProceed = computed(() => {
  if (step.value === 1) return !!form.value.wagerType
  if (step.value === 2) {
    if (!form.value.amount || form.value.amount < 1) return false
    if (form.value.amount > (auth.profile?.total_seals ?? 0)) return false
    if (form.value.wagerType === 'direct' && !form.value.targetUsername.trim()) return false
    if (targetError.value) return false
    return true
  }
  return true
})

// Resetar ao fechar
watch(() => props.modelValue, (val) => {
  if (!val) {
    step.value = 1
    errorMsg.value = ''
    targetError.value = ''
    form.value = { wagerType: 'open', amount: 10, targetUsername: '', maxParticipants: 2, message: '' }
  }
})

function debouncedCheckTarget() {
  targetError.value = ''
  clearTimeout(targetCheckTimer)
  const username = form.value.targetUsername.replace('@', '').trim()
  if (!username) return
  targetCheckTimer = setTimeout(async () => {
    if (username === (auth.profile?.username || '')) {
      targetError.value = 'Você não pode se desafiar.'
    }
  }, 400)
}

async function handleCreate() {
  errorMsg.value = ''
  const result = await apostasStore.createWager({
    gameId:          props.gameId,
    wagerType:       form.value.wagerType,
    amount:          form.value.amount,
    maxParticipants: form.value.wagerType === 'group' ? form.value.maxParticipants : 1,
    targetUsername:  form.value.wagerType === 'direct' ? form.value.targetUsername.replace('@', '').trim() : null,
    message:         form.value.message || null,
  })
  if (result.success) {
    emit('created', result.wager)
    emit('update:modelValue', false)
  } else {
    errorMsg.value = result.error
  }
}
</script>

<style scoped>
.type-card {
  transition: transform .15s ease, box-shadow .15s ease;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.type-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.12) !important; }

.step-dot {
  width: 26px; height: 26px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #e0e0e0; color: #757575; font-size: 12px;
  flex-shrink: 0;
  transition: background .2s;
}
.step-dot.active { background: #2e7d32; color: #fff; }
.step-dot.done   { background: #43a047; color: #fff; }

.step-line {
  flex-grow: 1; height: 2px;
  background: #e0e0e0;
  transition: background .2s;
}
.step-line.done { background: #43a047; }
</style>
