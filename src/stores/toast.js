import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const message = ref('')
  const color = ref('success')

  function notify(msg, clr = 'success') {
    message.value = msg
    color.value = clr
    show.value = true
  }

  return { show, message, color, notify }
})
