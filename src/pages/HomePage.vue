<template>
  <AppLayout>
    <v-row justify="center" align="center" class="mt-8">
      <v-col cols="12" md="7" class="text-center">
        <div class="text-h3 font-weight-bold text-green-darken-3 mb-4">⚽ Bolão da Copa do Mundo</div>
        <div class="text-h6 text-medium-emphasis mb-8">
          Faça seus palpites, acumule pontos e dispute o ranking com seus amigos!
        </div>

        <v-row justify="center" class="mb-8">
          <v-col cols="12" sm="4">
            <v-card class="pa-4 text-center" variant="tonal" color="green">
              <v-icon size="40" color="green-darken-3">mdi-soccer</v-icon>
              <div class="text-subtitle-1 font-weight-medium mt-2">Palpites nos jogos</div>
              <div class="text-caption text-medium-emphasis">Libera 24h antes de cada partida</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-4 text-center" variant="tonal" color="amber">
              <v-icon size="40" color="amber-darken-3">mdi-trophy</v-icon>
              <div class="text-subtitle-1 font-weight-medium mt-2">Pontuação</div>
              <div class="text-caption text-medium-emphasis">10 pts placar exato · 5 pts vencedor</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-4 text-center" variant="tonal" color="blue">
              <v-icon size="40" color="blue-darken-3">mdi-podium</v-icon>
              <div class="text-subtitle-1 font-weight-medium mt-2">Ranking geral</div>
              <div class="text-caption text-medium-emphasis">Veja sua posição em tempo real</div>
            </v-card>
          </v-col>
        </v-row>

        <v-btn
          :to="{ name: 'Register' }"
          color="green-darken-3"
          size="x-large"
          class="mr-3"
          prepend-icon="mdi-account-plus"
        >
          Criar conta
        </v-btn>
        <v-btn
          :to="{ name: 'Login' }"
          variant="outlined"
          color="green-darken-3"
          size="x-large"
          prepend-icon="mdi-login"
        >
          Entrar
        </v-btn>
      </v-col>
    </v-row>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
</script>
