<template>
  <div
    class="d-flex flex-column align-center justify-center text-center"
    :style="{ minHeight: minHeight }"
  >
    <v-icon :icon="icon" :size="iconSize" :color="iconColor" style="opacity:.35" :class="iconSize === 80 ? 'mb-6' : 'mb-4'" />
    <p :class="[titleClass, 'font-weight-medium text-medium-emphasis mb-2']">{{ title }}</p>
    <p v-if="description" class="text-body-2 text-medium-emphasis mb-6" style="max-width:380px">
      {{ description }}
    </p>
    <v-btn
      v-if="actionText"
      :color="actionColor"
      :variant="actionVariant"
      :size="actionSize"
      :prepend-icon="actionIcon"
      rounded="lg"
      @click="$emit('action')"
    >
      {{ actionText }}
    </v-btn>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon:          { type: String, required: true },
  iconColor:     { type: String, default: 'green-darken-2' },
  iconSize:      { type: [String, Number], default: 80 },
  titleClass:    { type: String, default: 'text-h6' },
  title:         { type: String, required: true },
  description:   { type: String, default: '' },
  actionText:    { type: String, default: '' },
  actionIcon:    { type: String, default: '' },
  actionColor:   { type: String, default: 'green-darken-3' },
  actionVariant: { type: String, default: 'elevated' },
  actionSize:    { type: String, default: 'large' },
  minHeight:     { type: String, default: 'calc(100vh - 200px)' },
})
defineEmits(['action'])
</script>
