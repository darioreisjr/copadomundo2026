import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useSealRewardsStore = defineStore('sealRewards', {
  state: () => ({
    rewards: [],
    loading: false,
  }),

  actions: {
    async fetchRewards() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('seal_rewards')
          .select('*')
          .order('created_at', { ascending: true })
        if (error) throw error
        this.rewards = data
      } finally {
        this.loading = false
      }
    },

    async addReward(payload) {
      const { data, error } = await supabase
        .from('seal_rewards')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      this.rewards.push(data)
    },

    async updateReward(id, updates) {
      const { data, error } = await supabase
        .from('seal_rewards')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      const idx = this.rewards.findIndex(r => r.id === id)
      if (idx !== -1) this.rewards[idx] = data
    },

    async toggleActive(id, active) {
      await this.updateReward(id, { active })
    },

    async deleteReward(id) {
      const { error } = await supabase
        .from('seal_rewards')
        .delete()
        .eq('id', id)
      if (error) throw error
      this.rewards = this.rewards.filter(r => r.id !== id)
    },
  },
})
