<template>
  <v-footer color="green-darken-4" class="text-white">
    <v-container class="py-10">
      <v-row>
        <v-col cols="12" sm="4" class="mb-6 mb-sm-0 text-center text-sm-start">
          <router-link :to="{ name: 'Home' }" class="d-inline-block mb-3" style="text-decoration:none">
            <img src="@/image/logo.png" alt="Bolão Copa 26" style="height:40px;width:auto" />
          </router-link>
          <p class="text-body-2 mb-1" style="opacity:.75">
            O bolão mais emocionante da Copa do Mundo 2026.
          </p>
          <v-icon icon="mdi-trophy-outline" color="#f5c542" size="small" class="mr-1" />
          <span class="text-caption font-weight-medium" style="color:#f5c542">Copa do Mundo 2026</span>
        </v-col>

        <v-col cols="6" sm="4" class="mb-6 mb-sm-0 text-center">
          <p class="text-body-2 font-weight-bold mb-3 text-uppercase" style="letter-spacing:.08em">
            Links Rápidos
          </p>
          <div class="d-flex flex-column gap-2 align-center">
            <router-link :to="{ name: 'HowTo' }" class="footer-link text-caption">
              <v-icon icon="mdi-help-circle-outline" size="x-small" class="mr-1" />Como Usar
            </router-link>
            <router-link :to="{ name: 'Terms' }" class="footer-link text-caption">
              <v-icon icon="mdi-file-document-outline" size="x-small" class="mr-1" />Termos de Uso
            </router-link>
            <router-link :to="{ name: 'RankingInfo' }" class="footer-link text-caption">
              <v-icon icon="mdi-podium" size="x-small" class="mr-1" />Ranking
            </router-link>
            <router-link :to="{ name: 'Login' }" class="footer-link text-caption">
              <v-icon icon="mdi-soccer" size="x-small" class="mr-1" />Fazer Palpite
            </router-link>
          </div>
        </v-col>

        <v-col cols="6" sm="4" class="text-center text-sm-end">
          <p class="text-body-2 font-weight-bold mb-3 text-uppercase" style="letter-spacing:.08em">
            Suporte
          </p>
          <p class="text-caption mb-1" style="opacity:.75">Dúvidas? Entre em contato</p>
          <a
            href="mailto:dev.darioreis@gmail.com"
            class="footer-link text-caption d-inline-flex align-center"
          >
            <v-icon icon="mdi-email-outline" size="x-small" class="mr-1" />dev.darioreis@gmail.com
          </a>
          <div class="mt-4 d-flex align-center justify-center justify-sm-end">
            <v-icon icon="mdi-brain" size="small" class="mr-1" style="opacity:.6" />
            <span class="text-caption" style="opacity:.6">Powered by Gemini AI</span>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-6" style="border-color:rgba(255,255,255,.2)" />

      <div class="text-center">
        <p class="text-caption" style="opacity:.75">
          &copy; {{ new Date().getFullYear() }} Bolão da Copa 26 &middot; Todos os direitos reservados
        </p>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.footer-link {
  color: rgba(255,255,255,.7);
  text-decoration: none;
  transition: color .2s;
  display: inline-flex;
  align-items: center;
}
.footer-link:hover { color: #fff; }
.gap-2 { gap: 8px; }
</style>
