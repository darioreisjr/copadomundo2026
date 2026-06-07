<template>
  <router-link
    :to="{ name: 'Dashboard' }"
    class="selos-footer-bar"
    :class="{ 'selos-footer-bar--mobile-nav': display.xs.value }"
  >
    <v-icon icon="mdi-seal" color="#1b5e20" size="20" class="mr-2" />
    <span class="selos-footer-bar__label">Seus selos</span>
    <span class="selos-footer-bar__value">{{ auth.profile?.total_seals ?? 0 }}</span>
  </router-link>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

const display = useDisplay()
const auth = useAuthStore()
</script>

<style scoped>
.selos-footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2400;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: linear-gradient(90deg, #ffd54f 0%, #ffb300 100%);
  color: #1b5e20;
  text-decoration: none;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, .22);
  border-top: 1px solid rgba(27, 94, 32, .25);
}

.selos-footer-bar--mobile-nav {
  bottom: 56px;
}

.selos-footer-bar__label {
  font-size: .75rem;
  letter-spacing: .04em;
  opacity: .75;
  margin-right: 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.selos-footer-bar__value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1b5e20;
}
</style>
