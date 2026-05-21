import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSealsStore = defineStore('seals', () => {
  const pendingReward = ref(null)
  const modalOpen = ref(false)

  async function claimDailyChest() {
    const { data, error } = await supabase.rpc('claim_daily_seal')
    if (error) throw error
    return data
  }

  function showReward(reward) {
    pendingReward.value = reward
    modalOpen.value = true
  }

  function clearReward() {
    modalOpen.value = false
    pendingReward.value = null
  }

  return { pendingReward, modalOpen, claimDailyChest, showReward, clearReward }
})
