<template>
  <transition name="scroll-top-fade">
    <v-btn
      v-if="visible"
      icon="mdi-chevron-up"
      class="scroll-to-top-btn"
      :class="{ 'scroll-to-top-btn--raised': raised }"
      color="#f5c542"
      size="small"
      elevation="4"
      @click="scrollToTop"
    />
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  raised: { type: Boolean, default: false },
})

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 28px;
  right: 24px;
  z-index: 999;
  transition: bottom .2s ease;
}

.scroll-to-top-btn--raised {
  bottom: 84px;
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
