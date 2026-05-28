<template>
  <v-app-bar elevation="2" height="64" color="#1b5e20">
    <!-- Logo -->
    <router-link to="/" class="nav-logo ml-2">
      <img src="@/image/logo.png" alt="Bolão Copa 26" />
    </router-link>

    <v-spacer />

    <!-- Links desktop -->
    <nav class="d-none d-md-flex nav-links">
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        class="nav-link"
        active-class="nav-link--active"
        :exact="link.name === 'Home'"
      >
        {{ link.label }}
      </router-link>
    </nav>

    <v-spacer />

    <!-- Botões de ação desktop -->
    <div class="d-none d-md-flex nav-actions mr-2">
      <v-btn
        :to="{ name: 'Login' }"
        variant="outlined"
        size="small"
        class="font-weight-bold"
        style="border-color:rgba(255,255,255,.6);color:#fff"
        rounded="lg"
      >
        Entrar
      </v-btn>
      <v-btn
        :to="{ name: 'Register' }"
        variant="flat"
        color="#f5c542"
        size="small"
        class="font-weight-bold text-black"
        elevation="0"
        rounded="lg"
      >
        Criar conta
      </v-btn>
    </div>

    <!-- Hamburger mobile -->
    <v-menu v-model="mobileOpen" location="bottom end" :close-on-content-click="true">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          class="d-md-none mr-1"
          color="white"
          size="small"
        >
          <v-icon>{{ mobileOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-btn>
      </template>
      <v-list min-width="220" bg-color="green-darken-4" class="pa-2">
        <v-list-item
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          :title="link.label"
          class="mobile-nav-item rounded-lg mb-1"
        />
        <v-divider class="my-2" style="border-color:rgba(255,255,255,.15)" />
        <v-list-item
          :to="{ name: 'Login' }"
          title="Entrar"
          class="mobile-nav-item rounded-lg mb-1"
        />
        <v-list-item
          :to="{ name: 'Register' }"
          title="Criar conta"
          class="mobile-nav-item mobile-nav-item--cta rounded-lg"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'

const mobileOpen = ref(false)

const navLinks = [
  { label: 'Início',        name: 'Home',         to: { name: 'Home' } },
  { label: 'Como funciona', name: 'ComoFunciona', to: { name: 'ComoFunciona' } },
  { label: 'Pontuação',     name: 'Pontuacao',    to: { name: 'Pontuacao' } },
  { label: 'Disputa',       name: 'Disputa',      to: { name: 'Disputa' } },
  { label: 'Selos',         name: 'SelosInfo',    to: { name: 'SelosInfo' } },
  { label: 'Tecnologias',   name: 'Tecnologias',  to: { name: 'Tecnologias' } },
  { label: 'Ranking',       name: 'RankingInfo',  to: { name: 'RankingInfo' } },
]
</script>

<style scoped>
.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}
.nav-logo img {
  height: 38px;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-actions {
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: rgba(255,255,255,.8);
  font-size: .87rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  transition: color .2s, background .2s;
  white-space: nowrap;
}
.nav-link:hover,
.nav-link--active {
  color: #fff;
  background: rgba(255,255,255,.12);
}

.mobile-nav-item { color: rgba(255,255,255,.85) !important; }
.mobile-nav-item--cta { color: #f5c542 !important; font-weight: 700; }
</style>
