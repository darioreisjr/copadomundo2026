import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const initialized = ref(false)

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value) await fetchProfile()
    initialized.value = true

    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (user.value) await fetchProfile()
      else profile.value = null
    })
  }

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    profile.value = data
  }

  async function register({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    if (!data.user?.identities?.length) {
      const err = new Error('Este e-mail já possui uma conta cadastrada.')
      err.code = 'email_already_exists'
      throw err
    }
  }

  async function login({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return { user, profile, initialized, init, register, login, logout, fetchProfile }
})
