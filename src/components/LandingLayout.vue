<template>
  <v-app>
    <LandingNavbar />
    <v-main style="padding-left:0;padding-right:0">
      <slot />
      <LandingFooter />
    </v-main>
    <ScrollToTopButton />
  </v-app>
</template>

<script setup>
import LandingNavbar from '@/components/LandingNavbar.vue'
import LandingFooter from '@/components/LandingFooter.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
</script>
