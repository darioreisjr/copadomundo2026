<template>
  <AppLayout>
    <div class="text-h5 font-weight-bold mb-6">Minha Conta</div>

    <v-tabs v-model="tab" color="green-darken-3" class="mb-6">
      <v-tab value="profile">
        <v-icon icon="mdi-account-circle-outline" class="mr-2" />Dados Pessoais
      </v-tab>
      <v-tab value="security">
        <v-icon icon="mdi-lock-outline" class="mr-2" />Segurança
      </v-tab>
      <v-tab value="preferences">
        <v-icon icon="mdi-bell-outline" class="mr-2" />Preferências
      </v-tab>
      <v-tab value="danger">
        <v-icon icon="mdi-account-remove-outline" class="mr-2" color="error" />
        <span class="text-error">Excluir Conta</span>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">

      <!-- ABA 1: DADOS PESSOAIS -->
      <v-window-item value="profile">
        <v-card class="pa-6" rounded="lg" elevation="1">
          <div class="d-flex align-center mb-6" style="gap:20px">
            <div style="position:relative">
              <v-avatar
                color="green-darken-1"
                size="72"
                style="cursor:pointer"
                @click="openAvatarPicker()"
              >
                <v-img v-if="auth.profile?.avatar_url" :src="auth.profile.avatar_url" cover />
                <span v-else class="text-white font-weight-bold text-h5">
                  {{ (profileForm.name || 'U')[0].toUpperCase() }}
                </span>
              </v-avatar>
              <v-btn
                icon="mdi-camera"
                size="x-small"
                color="green-darken-3"
                style="position:absolute;bottom:0;right:0"
                elevation="2"
                @click="openAvatarPicker()"
              />
            </div>
            <div>
              <div class="text-body-1 font-weight-medium">{{ auth.profile?.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ auth.user?.email }}</div>
              <div class="text-caption text-medium-emphasis mt-1" style="cursor:pointer;color:#2e7d32" @click="openAvatarPicker()">
                Alterar avatar
              </div>
              <v-chip
                v-if="auth.profile?.role === 'admin'"
                size="x-small"
                color="amber-darken-2"
                class="mt-1"
              >Admin</v-chip>
            </div>
          </div>

          <v-form @submit.prevent="saveProfile" ref="profileFormRef">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="profileForm.name"
                  label="Nome completo"
                  prepend-inner-icon="mdi-account"
                  :rules="[v => !!v || 'Nome obrigatório']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  :model-value="auth.user?.email"
                  label="E-mail"
                  prepend-inner-icon="mdi-email"
                  readonly
                  disabled
                  hint="O e-mail não pode ser alterado"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="profileForm.birth_date"
                  label="Data de nascimento (opcional)"
                  type="date"
                  prepend-inner-icon="mdi-calendar"
                  :rules="[birthDateRule]"
                  hint="Você deve ter pelo menos 18 anos"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="profileForm.phone"
                  label="Telefone (opcional)"
                  prepend-inner-icon="mdi-phone"
                  placeholder="(11) 99999-9999"
                  :rules="[phoneRule]"
                />
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              color="green-darken-3"
              :loading="profileLoading"
              :disabled="!profileDirty"
              prepend-icon="mdi-content-save"
              class="mt-2"
            >
              Salvar alterações
            </v-btn>
          </v-form>
        </v-card>
      </v-window-item>

      <!-- ABA 2: SEGURANÇA -->
      <v-window-item value="security">
        <v-card class="pa-6" rounded="lg" elevation="1">
          <div class="text-body-1 font-weight-medium mb-1">Alterar senha</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Sua nova senha deve ser diferente das utilizadas anteriormente.
          </div>

          <v-form @submit.prevent="savePassword" ref="passwordFormRef">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="passwordForm.current"
                  label="Senha atual"
                  :type="showCurrent ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showCurrent = !showCurrent"
                  :rules="[v => !!v || 'Senha atual obrigatória']"
                  autocomplete="current-password"
                />
              </v-col>
              <v-col cols="12" sm="6" class="d-none d-sm-block" />
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="passwordForm.password"
                  label="Nova senha"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="[
                    v => !!v || 'Senha obrigatória',
                    v => v.length >= 8 || 'Mínimo 8 dígitos',
                    v => /[A-Z]/.test(v) || 'Necessário uma letra maiúscula',
                    v => /[a-z]/.test(v) || 'Necessário uma letra minúscula',
                    v => /[0-9]/.test(v) || 'Necessário um número',
                  ]"
                />
              </v-col>
              <v-col cols="12" sm="6" class="d-none d-sm-block" />
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="passwordForm.confirm"
                  label="Confirmar nova senha"
                  :type="showConfirm ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showConfirm = !showConfirm"
                  :rules="[
                    v => !!v || 'Confirmação obrigatória',
                    v => v === passwordForm.password || 'Senhas não coincidem',
                  ]"
                />
              </v-col>
            </v-row>

            <div class="mb-4 px-1">
              <div
                v-for="req in passwordRules"
                :key="req.label"
                class="d-flex align-center mb-1"
                style="gap:6px"
              >
                <v-icon
                  :icon="req.test(passwordForm.password) ? 'mdi-check-circle' : 'mdi-circle-outline'"
                  :color="req.test(passwordForm.password) ? 'green-darken-3' : 'grey'"
                  size="16"
                />
                <span
                  class="text-caption"
                  :class="req.test(passwordForm.password) ? 'text-green-darken-3' : 'text-grey'"
                >{{ req.label }}</span>
              </div>
            </div>

            <v-btn
              type="submit"
              color="green-darken-3"
              :loading="passwordLoading"
              :disabled="!passwordReady"
              prepend-icon="mdi-lock-reset"
            >
              Alterar senha
            </v-btn>
          </v-form>
        </v-card>
      </v-window-item>

      <!-- ABA 3: PREFERÊNCIAS -->
      <v-window-item value="preferences">
        <v-card class="pa-6" rounded="lg" elevation="1">
          <div class="text-body-1 font-weight-medium mb-1">Notificações</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Escolha quais notificações deseja receber.
          </div>

          <v-list lines="two">
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon icon="mdi-email-outline" color="green-darken-3" class="mr-4" />
              </template>
              <v-list-item-title>Notificações por e-mail</v-list-item-title>
              <v-list-item-subtitle>Receba atualizações sobre jogos e palpites</v-list-item-subtitle>
              <template #append>
                <v-switch
                  v-model="prefsForm.notifications_email"
                  color="green-darken-3"
                  hide-details
                  :loading="prefsLoading"
                  @update:model-value="savePrefs"
                />
              </template>
            </v-list-item>

            <v-divider />

            <v-list-item class="px-0">
              <template #prepend>
                <v-icon icon="mdi-podium" color="green-darken-3" class="mr-4" />
              </template>
              <v-list-item-title>Notificações de ranking</v-list-item-title>
              <v-list-item-subtitle>Seja avisado sobre mudanças na sua posição</v-list-item-subtitle>
              <template #append>
                <v-switch
                  v-model="prefsForm.notifications_ranking"
                  color="green-darken-3"
                  hide-details
                  :loading="prefsLoading"
                  @update:model-value="savePrefs"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>

      <!-- ABA 4: EXCLUIR CONTA -->
      <v-window-item value="danger">
        <v-card class="pa-6" rounded="lg" elevation="1">
          <v-alert
            type="error"
            variant="tonal"
            rounded="lg"
            icon="mdi-alert-circle"
            class="mb-6"
          >
            <div class="font-weight-medium mb-1">Zona de perigo</div>
            <div class="text-body-2">
              A exclusão da conta é permanente e irreversível. Todos os seus palpites, pontuação e dados
              pessoais serão apagados imediatamente e não poderão ser recuperados.
            </div>
          </v-alert>

          <v-checkbox
            v-model="deleteConfirmed"
            color="error"
            density="compact"
            class="mb-4"
          >
            <template #label>
              <span class="text-body-2">
                Entendo que minha conta e todos os dados serão excluídos permanentemente
              </span>
            </template>
          </v-checkbox>

          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-account-remove"
            :disabled="!deleteConfirmed"
            @click="deleteDialog = true"
          >
            Excluir minha conta
          </v-btn>
        </v-card>
      </v-window-item>

    </v-window>

    <!-- Dialog de confirmação de exclusão -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="pa-6" rounded="lg">
        <div class="d-flex align-center mb-4" style="gap:12px">
          <v-icon icon="mdi-account-remove" color="error" size="28" />
          <span class="text-body-1 font-weight-bold">Confirmar exclusão</span>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Tem certeza de que deseja excluir sua conta? Esta ação
          <strong>não pode ser desfeita</strong>.
        </p>
        <div class="d-flex justify-end" style="gap:12px">
          <v-btn variant="text" @click="deleteDialog = false" :disabled="deleteLoading">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="deleteLoading"
            @click="handleDeleteAccount"
          >
            Sim, excluir conta
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { supabase } from '@/lib/supabase'

const openAvatarPicker = inject('openAvatarPicker', () => {})

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const tab = ref('profile')

// --- Aba Dados Pessoais ---
const profileFormRef = ref(null)
const profileLoading = ref(false)
const profileForm = reactive({
  name: '',
  birth_date: '',
  phone: '',
})

const profileSnapshot = reactive({ name: '', birth_date: '', phone: '' })

const profileDirty = computed(() =>
  profileForm.name       !== profileSnapshot.name       ||
  profileForm.birth_date !== profileSnapshot.birth_date ||
  (profileForm.phone || '') !== (profileSnapshot.phone || '')
)

function birthDateRule(v) {
  if (!v) return true
  const birth = new Date(v)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age >= 18 || 'Você precisa ter pelo menos 18 anos'
}

function phoneRule(v) {
  if (!v) return true
  return /^[\d\s()\-+]{8,20}$/.test(v) || 'Telefone inválido'
}

async function saveProfile() {
  const { valid } = await profileFormRef.value.validate()
  if (!valid) return
  profileLoading.value = true
  try {
    await auth.updateProfile({
      name: profileForm.name,
      birth_date: profileForm.birth_date || null,
      phone: profileForm.phone || null,
    })
    toast.notify('Dados atualizados com sucesso!')
    profileSnapshot.name       = profileForm.name
    profileSnapshot.birth_date = profileForm.birth_date
    profileSnapshot.phone      = profileForm.phone || ''
  } catch (e) {
    toast.notify(e.message || 'Erro ao salvar dados.', 'error')
  } finally {
    profileLoading.value = false
  }
}

// --- Aba Segurança ---
const passwordFormRef = ref(null)
const passwordLoading = ref(false)
const showCurrent = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const passwordForm = reactive({ current: '', password: '', confirm: '' })

const passwordRules = [
  { label: 'No mínimo 8 dígitos',          test: v => v.length >= 8 },
  { label: 'No mínimo uma letra maiúscula', test: v => /[A-Z]/.test(v) },
  { label: 'No mínimo uma letra minúscula', test: v => /[a-z]/.test(v) },
  { label: 'No mínimo um número',           test: v => /[0-9]/.test(v) },
]

const passwordReady = computed(() =>
  passwordForm.current.length > 0 &&
  passwordForm.password.length >= 8 &&
  /[A-Z]/.test(passwordForm.password) &&
  /[a-z]/.test(passwordForm.password) &&
  /[0-9]/.test(passwordForm.password) &&
  passwordForm.confirm === passwordForm.password &&
  passwordForm.confirm.length > 0
)

async function savePassword() {
  const { valid } = await passwordFormRef.value.validate()
  if (!valid) return
  passwordLoading.value = true
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: auth.user.email,
      password: passwordForm.current,
    })
    if (authError) {
      toast.notify('Senha atual incorreta', 'error')
    } else {
      await auth.updatePassword(passwordForm.password)
      toast.notify('Senha alterada com sucesso!')
      router.push({ name: 'Dashboard' })
    }
  } catch (e) {
    toast.notify(e.message || 'Erro ao alterar senha.', 'error')
  } finally {
    passwordLoading.value = false
  }
}

// --- Aba Preferências ---
const prefsLoading = ref(false)
const prefsForm = reactive({
  notifications_email: true,
  notifications_ranking: true,
})

async function savePrefs() {
  prefsLoading.value = true
  try {
    await auth.updateProfile({
      notifications_email: prefsForm.notifications_email,
      notifications_ranking: prefsForm.notifications_ranking,
    })
    toast.notify('Preferências salvas!')
  } catch (e) {
    console.error('savePrefs error:', e)
    toast.notify(e.message || 'Erro ao salvar preferências.', 'error')
  } finally {
    prefsLoading.value = false
  }
}

// --- Aba Excluir Conta ---
const deleteConfirmed = ref(false)
const deleteDialog = ref(false)
const deleteLoading = ref(false)

async function handleDeleteAccount() {
  deleteLoading.value = true
  try {
    await auth.deleteAccount()
    router.push({ name: 'Home' })
  } catch (e) {
    toast.notify(e.message || 'Erro ao excluir conta.', 'error')
    deleteDialog.value = false
  } finally {
    deleteLoading.value = false
  }
}

// Preenche formulário e snapshot com dados atuais do perfil
onMounted(() => {
  profileForm.name       = auth.profile?.name       ?? ''
  profileForm.birth_date = auth.profile?.birth_date ?? ''
  profileForm.phone      = auth.profile?.phone      ?? ''
  profileSnapshot.name       = profileForm.name
  profileSnapshot.birth_date = profileForm.birth_date
  profileSnapshot.phone      = profileForm.phone
  prefsForm.notifications_email   = auth.profile?.notifications_email   ?? true
  prefsForm.notifications_ranking = auth.profile?.notifications_ranking ?? true
})
</script>
