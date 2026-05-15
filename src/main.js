import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: { defaultTheme: 'light' },
})

async function bootstrap() {
  const app = createApp(App)

  // Pinia instalado primeiro — o beforeEach do router usa stores
  app.use(createPinia())

  // Router importado depois que o Pinia já está ativo
  const { default: router } = await import('./router/index.js')

  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

bootstrap()
