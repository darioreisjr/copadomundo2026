<template>
  <router-link
    :to="{ name: 'Dashboard' }"
    class="selos-corner-badge"
    :class="{ 'selos-corner-badge--mobile-nav': display.xs.value }"
    aria-label="Ver meus selos"
  >
    <v-icon icon="mdi-seal" color="#1b5e20" size="16" />
    <span class="selos-corner-badge__value">{{ auth.profile?.total_seals ?? 0 }}</span>
  </router-link>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

const display = useDisplay()
const auth = useAuthStore()
</script>

<style scoped>
.selos-corner-badge {
  position: fixed;
  right: 24px;
  bottom: 76px;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 58px;
  height: 26px;
  padding: 0 8px;
  background: #ffca28;
  color: #1b5e20;
  border: 1px solid rgba(27, 94, 32, .22);
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, .18);
}

.selos-corner-badge--mobile-nav {
  bottom: 132px;
  right: 18px;
}

.selos-corner-badge__value {
  font-size: .8rem;
  line-height: 1;
  font-weight: 800;
  color: #1b5e20;
}
</style>
