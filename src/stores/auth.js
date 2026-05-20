import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const initialized = ref(false)
  const intentionalLogout = ref(false)
  const passwordUpdateInProgress = ref(false)

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    if (user.value) await fetchProfile()
    initialized.value = true

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (passwordUpdateInProgress.value) return
      if (!session && !intentionalLogout.value) {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          user.value = data.session.user
          await fetchProfile()
        }
        return
      }
      intentionalLogout.value = false
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
      if (!data.user?.email_confirmed_at) {
        const err = new Error('Este e-mail foi cadastrado mas ainda não foi confirmado.')
        err.code = 'email_not_confirmed'
        throw err
      }
      const err = new Error('Este e-mail já possui uma conta cadastrada.')
      err.code = 'email_already_exists'
      throw err
    }
  }

  async function resendConfirmation(email) {
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) throw error
  }

  async function login({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message === 'Email not confirmed') {
        const err = new Error('E-mail cadastrado mas ainda não confirmado.')
        err.code = 'email_not_confirmed'
        throw err
      }
      throw error
    }
  }

  async function logout() {
    intentionalLogout.value = true
    await supabase.auth.signOut()
  }

  async function updateProfile(updates) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
    if (error) throw error
    await fetchProfile()
  }

  async function updatePassword(newPassword) {
    passwordUpdateInProgress.value = true
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
    } finally {
      passwordUpdateInProgress.value = false
    }
  }

  async function deleteAccount() {
    const { error } = await supabase.rpc('delete_user')
    if (error) throw error
    await logout()
  }

  return { user, profile, initialized, intentionalLogout, init, register, login, logout, fetchProfile, resendConfirmation, updateProfile, updatePassword, deleteAccount }
})
