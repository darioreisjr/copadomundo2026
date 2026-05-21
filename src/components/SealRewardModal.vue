<template>
  <v-dialog :model-value="modelValue" max-width="400" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card rounded="xl" class="text-center overflow-hidden">
      <!-- Cabeçalho dourado -->
      <div class="seal-header pa-6 pb-4">
        <div class="seal-icon-wrapper mx-auto mb-3">
          <v-icon
            :icon="reward?.icon || 'mdi-seal'"
            size="72"
            color="amber-lighten-2"
            class="seal-icon"
          />
        </div>
        <div class="text-overline text-amber-lighten-3" style="letter-spacing:2px">
          Você ganhou!
        </div>
      </div>

      <v-card-text class="pa-6 pt-4">
        <div class="text-h5 font-weight-bold mb-2">{{ reward?.label }}</div>
        <div class="text-body-2 text-medium-emphasis mb-5">{{ reward?.description }}</div>

        <!-- Quantidade de selos -->
        <div class="seals-badge mx-auto mb-2">
          <v-icon icon="mdi-seal" size="22" color="green-darken-3" class="mr-1" />
          <span class="text-h6 font-weight-bold text-green-darken-3">+{{ reward?.seals }}</span>
          <span class="text-body-2 text-medium-emphasis ml-1">selos</span>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0 justify-center">
        <v-btn
          color="green-darken-3"
          variant="flat"
          rounded="lg"
          size="large"
          min-width="160"
          @click="$emit('update:modelValue', false)"
        >
          Ótimo!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  reward: Object,
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.seal-header {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%);
}

.seal-icon-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-icon {
  animation: seal-pulse 1.6s ease-in-out infinite;
}

@keyframes seal-pulse {
  0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 0px #ffd740); }
  50%       { transform: scale(1.12); filter: drop-shadow(0 0 14px #ffd740); }
}

.seals-badge {
  display: inline-flex;
  align-items: center;
  background: #e8f5e9;
  border: 1.5px solid #a5d6a7;
  border-radius: 24px;
  padding: 6px 18px;
}
</style>
