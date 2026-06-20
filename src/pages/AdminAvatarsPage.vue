<template>
  <AppLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="text-h5 font-weight-bold">Avatares</div>
      <v-btn
        color="green-darken-3"
        prepend-icon="mdi-plus"
        rounded="lg"
        @click="openNewDialog"
      >
        Novo Avatar
      </v-btn>
    </div>

    <!-- Loading -->
    <v-progress-linear
      v-if="avatarsStore.loading"
      indeterminate
      color="green-darken-3"
      class="mb-4"
    />

    <!-- Estado vazio -->
    <EmptyState
      v-else-if="!avatarsStore.avatars.length"
      icon="mdi-account-circle-outline"
      title="Nenhum avatar cadastrado"
      description="Adicione avatares que os usuários poderão escolher para seu perfil."
      action-text="Novo Avatar"
      action-icon="mdi-plus"
      @action="openNewDialog"
    />

    <!-- Tabela -->
    <v-card v-else elevation="2" class="pa-4">
      <p class="text-caption text-medium-emphasis mb-4">
        {{ avatarsStore.avatars.length }} avatar{{ avatarsStore.avatars.length !== 1 ? 'es' : '' }} cadastrado{{ avatarsStore.avatars.length !== 1 ? 's' : '' }}
      </p>

      <!-- Tabela: visível apenas em sm+ -->
      <v-table class="d-none d-sm-block">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Selos</th>
            <th>Padrão</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="avatar in avatarsStore.avatars" :key="avatar.id">
            <td>
              <v-avatar size="44" rounded="md" class="my-1" color="grey-lighten-3">
                <v-img :src="avatar.url" :alt="avatar.name" cover />
              </v-avatar>
            </td>
            <td>{{ avatar.name }}</td>
            <td>{{ avatar.category ?? '—' }}</td>
            <td>
              <v-chip
                v-if="avatar.seal_cost > 0"
                size="x-small"
                color="amber-darken-2"
                variant="tonal"
                prepend-icon="mdi-seal"
              >
                {{ avatar.seal_cost }}
              </v-chip>
              <span v-else class="text-caption text-medium-emphasis">Grátis</span>
            </td>
            <td>
              <v-chip
                v-if="avatar.is_default"
                size="x-small"
                color="green-darken-3"
                variant="flat"
                prepend-icon="mdi-star"
              >
                Padrão
              </v-chip>
            </td>
            <td>
              <v-chip
                :color="avatar.active ? 'green' : 'grey'"
                size="x-small"
                variant="tonal"
              >
                {{ avatar.active ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </td>
            <td>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                title="Editar"
                @click="openEditDialog(avatar)"
              />
              <v-btn
                :icon="avatar.active ? 'mdi-eye-off' : 'mdi-eye'"
                size="small"
                variant="text"
                :color="avatar.active ? 'orange' : 'green'"
                :title="avatar.active ? 'Desativar' : 'Reativar'"
                @click="toggleActive(avatar)"
              />
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="red"
                title="Excluir"
                @click="openDeleteDialog(avatar)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Cards: visíveis apenas no mobile -->
      <div class="d-flex d-sm-none flex-column" style="gap:12px">
        <v-card
          v-for="avatar in avatarsStore.avatars"
          :key="avatar.id"
          variant="outlined"
          class="pa-3"
        >
          <!-- Linha 1: imagem + nome -->
          <div class="d-flex align-center mb-2" style="gap:12px">
            <v-avatar size="44" rounded="md" color="grey-lighten-3">
              <v-img :src="avatar.url" :alt="avatar.name" cover />
            </v-avatar>
            <span class="text-subtitle-2 font-weight-bold">{{ avatar.name }}</span>
          </div>

          <!-- Linha 2: categoria + selos + padrão -->
          <div class="d-flex align-center flex-wrap mb-2" style="gap:8px">
            <span class="text-caption text-medium-emphasis">{{ avatar.category ?? '—' }}</span>
            <v-chip
              v-if="avatar.seal_cost > 0"
              size="x-small"
              color="amber-darken-2"
              variant="tonal"
              prepend-icon="mdi-seal"
            >
              {{ avatar.seal_cost }}
            </v-chip>
            <span v-else class="text-caption text-medium-emphasis">Grátis</span>
            <v-chip
              v-if="avatar.is_default"
              size="x-small"
              color="green-darken-3"
              variant="flat"
              prepend-icon="mdi-star"
            >
              Padrão
            </v-chip>
          </div>

          <!-- Linha 3: status -->
          <div class="mb-2">
            <v-chip
              :color="avatar.active ? 'green' : 'grey'"
              size="x-small"
              variant="tonal"
            >
              {{ avatar.active ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </div>

          <!-- Linha 4: ações -->
          <div class="d-flex" style="gap:8px">
            <v-btn
              prepend-icon="mdi-pencil"
              size="small"
              variant="tonal"
              class="flex-1-1"
              @click="openEditDialog(avatar)"
            >
              Editar
            </v-btn>
            <v-btn
              :prepend-icon="avatar.active ? 'mdi-eye-off' : 'mdi-eye'"
              size="small"
              variant="tonal"
              :color="avatar.active ? 'orange' : 'green'"
              class="flex-1-1"
              @click="toggleActive(avatar)"
            >
              {{ avatar.active ? 'Desativar' : 'Reativar' }}
            </v-btn>
            <v-btn
              prepend-icon="mdi-delete"
              size="small"
              variant="tonal"
              color="red"
              class="flex-1-1"
              @click="openDeleteDialog(avatar)"
            >
              Excluir
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-card>

    <!-- Dialog Criar / Editar -->
    <v-dialog v-model="avatarDialog" max-width="540" persistent>
      <v-card class="pa-6">
        <div class="text-h6 mb-4">
          {{ editAvatar?.id ? 'Editar Avatar' : 'Novo Avatar' }}
        </div>

        <v-form @submit.prevent="saveAvatar" ref="avatarFormRef">
          <v-text-field
            v-model="avatarForm.name"
            label="Nome do avatar"
            prepend-inner-icon="mdi-tag-outline"
            :rules="[v => !!v || 'Nome obrigatório']"
            class="mb-2"
          />
          <v-text-field
            v-model="avatarForm.category"
            label="Categoria (opcional)"
            prepend-inner-icon="mdi-folder-outline"
            class="mb-2"
          />
          <v-switch
            v-model="avatarForm.active"
            label="Avatar ativo (visível para usuários)"
            color="green-darken-3"
            hide-details
            class="mb-2"
          />

          <v-text-field
            v-model.number="avatarForm.seal_cost"
            label="Custo em selos (0 = gratuito)"
            prepend-inner-icon="mdi-seal"
            type="number"
            min="0"
            :rules="[v => v >= 0 || 'Valor deve ser 0 ou maior']"
            class="mb-2"
          />

          <v-switch
            v-model="avatarForm.is_default"
            label="Avatar padrão (exibido para usuários sem avatar)"
            color="amber-darken-2"
            hide-details
            class="mb-1"
          />
          <v-alert
            v-if="avatarForm.is_default && existingDefault && existingDefault.id !== editAvatar?.id"
            type="warning"
            density="compact"
            variant="tonal"
            class="mb-3"
          >
            O avatar "<strong>{{ existingDefault.name }}</strong>" deixará de ser o padrão.
          </v-alert>

          <div class="text-body-2 font-weight-medium mb-3 mt-2">Imagem</div>
          <v-btn-toggle
            v-model="avatarImageMode"
            mandatory
            color="green-darken-3"
            variant="outlined"
            density="compact"
            class="mb-4"
          >
            <v-btn value="url" prepend-icon="mdi-link">URL externa</v-btn>
            <v-btn value="upload" prepend-icon="mdi-upload">Upload</v-btn>
          </v-btn-toggle>

          <!-- URL input -->
          <div v-if="avatarImageMode === 'url'">
            <v-text-field
              v-model="avatarForm.url"
              label="URL da imagem"
              prepend-inner-icon="mdi-image-outline"
              :rules="[v => !!v || 'URL obrigatória']"
              hint="Cole a URL completa da imagem"
              persistent-hint
            />
            <div v-if="avatarForm.url" class="mt-3 mb-2 d-flex align-center" style="gap:12px">
              <v-avatar size="56" rounded="md" color="grey-lighten-3">
                <v-img :src="avatarForm.url" />
              </v-avatar>
              <span class="text-caption text-medium-emphasis">Pré-visualização</span>
            </div>
          </div>

          <!-- Upload -->
          <div v-if="avatarImageMode === 'upload'">
            <v-file-input
              v-model="avatarFileInput"
              label="Selecionar imagem"
              prepend-icon=""
              prepend-inner-icon="mdi-image-plus"
              accept="image/*"
              :rules="[v => (Array.isArray(v) ? v.length > 0 : !!v) || 'Selecione um arquivo']"
              hint="PNG, JPG, WEBP. Máx 2 MB."
              persistent-hint
              @update:model-value="previewFile"
            />
            <div v-if="avatarUploadPreview" class="mt-3 mb-2 d-flex align-center" style="gap:12px">
              <v-avatar size="56" rounded="md" color="grey-lighten-3">
                <v-img :src="avatarUploadPreview" />
              </v-avatar>
              <span class="text-caption text-medium-emphasis">Pré-visualização</span>
            </div>
          </div>

          <v-alert
            v-if="avatarDialogError"
            type="error"
            variant="tonal"
            density="compact"
            closable
            class="mt-3 mb-2"
            @click:close="avatarDialogError = ''"
          >
            {{ avatarDialogError }}
          </v-alert>

          <div class="d-flex justify-end ga-2 mt-4">
            <v-btn variant="text" :disabled="savingAvatar" @click="closeDialog">
              Cancelar
            </v-btn>
            <v-btn type="submit" color="green-darken-3" :loading="savingAvatar">
              Salvar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão -->
    <v-dialog v-model="deleteAvatarDialog" max-width="420" persistent>
      <v-card class="pa-6">
        <div class="d-flex align-center mb-4" style="gap:12px">
          <v-icon icon="mdi-delete-outline" color="error" size="28" />
          <span class="text-body-1 font-weight-bold">Remover Avatar</span>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-2">
          Deseja desativar o avatar "<strong>{{ targetDeleteAvatar?.name }}</strong>"?
          Ele ficará invisível para os usuários, mas não será excluído permanentemente.
        </p>
        <p class="text-caption text-medium-emphasis mb-6">
          Para exclusão permanente, use o botão abaixo.
        </p>
        <div class="d-flex flex-column ga-3">
          <v-btn
            variant="outlined"
            color="error"
            prepend-icon="mdi-delete-forever"
            :loading="deletingAvatar"
            block
            @click="hardDelete"
          >
            Excluir definitivamente
          </v-btn>
          <div class="d-flex justify-end ga-2">
            <v-btn variant="text" :disabled="deletingAvatar" @click="deleteAvatarDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="warning" :loading="deletingAvatar" @click="softDelete">
              Desativar
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useAvatarsStore } from '@/stores/avatars'
import { useToastStore }   from '@/stores/toast'

const avatarsStore = useAvatarsStore()
const toast        = useToastStore()

onMounted(() => avatarsStore.fetchAvatars())

const existingDefault = computed(() => avatarsStore.avatars.find(a => a.is_default) ?? null)

// --- Dialog criar/editar ---
const avatarDialog       = ref(false)
const editAvatar         = ref(null)
const savingAvatar       = ref(false)
const avatarFormRef      = ref(null)
const avatarDialogError  = ref('')
const avatarImageMode    = ref('url')
const avatarFileInput    = ref([])
const avatarUploadPreview = ref('')

const avatarForm = reactive({
  name:       '',
  category:   '',
  url:        '',
  active:     true,
  seal_cost:  0,
  is_default: false,
})

function openNewDialog() {
  editAvatar.value = null
  Object.assign(avatarForm, { name: '', category: '', url: '', active: true, seal_cost: 0, is_default: false })
  avatarImageMode.value     = 'url'
  avatarFileInput.value     = []
  avatarUploadPreview.value = ''
  avatarDialogError.value   = ''
  avatarDialog.value        = true
}

function openEditDialog(avatar) {
  editAvatar.value = avatar
  Object.assign(avatarForm, {
    name:       avatar.name,
    category:   avatar.category ?? '',
    url:        avatar.url,
    active:     avatar.active,
    seal_cost:  avatar.seal_cost ?? 0,
    is_default: avatar.is_default ?? false,
  })
  avatarImageMode.value     = 'url'
  avatarFileInput.value     = []
  avatarUploadPreview.value = ''
  avatarDialogError.value   = ''
  avatarDialog.value        = true
}

function closeDialog() {
  if (avatarUploadPreview.value) {
    URL.revokeObjectURL(avatarUploadPreview.value)
    avatarUploadPreview.value = ''
  }
  avatarDialog.value = false
}

function previewFile(val) {
  const file = Array.isArray(val) ? val[0] : val
  if (avatarUploadPreview.value) URL.revokeObjectURL(avatarUploadPreview.value)
  avatarUploadPreview.value = (file && file.name) ? URL.createObjectURL(file) : ''
}

async function saveAvatar() {
  const { valid } = await avatarFormRef.value.validate()
  if (!valid) return
  savingAvatar.value      = true
  avatarDialogError.value = ''
  try {
    let finalUrl = avatarForm.url

    if (avatarImageMode.value === 'upload') {
      const raw  = avatarFileInput.value
      const file = Array.isArray(raw) ? raw[0] : raw
      if (file && file.name) finalUrl = await avatarsStore.uploadAvatarImage(file)
    }

    const payload = {
      name:      avatarForm.name,
      category:  avatarForm.category || null,
      url:       finalUrl,
      active:    avatarForm.active,
      seal_cost: Number(avatarForm.seal_cost) || 0,
    }

    if (editAvatar.value?.id) {
      await avatarsStore.updateAvatar(editAvatar.value.id, payload)
      if (avatarForm.is_default) await avatarsStore.setDefaultAvatar(editAvatar.value.id)
      toast.notify('Avatar atualizado!')
    } else {
      const created = await avatarsStore.addAvatar(payload)
      if (avatarForm.is_default) await avatarsStore.setDefaultAvatar(created.id)
      toast.notify('Avatar adicionado!')
    }
    closeDialog()
  } catch (e) {
    avatarDialogError.value = e.message || 'Erro ao salvar avatar.'
  } finally {
    savingAvatar.value = false
  }
}

async function toggleActive(avatar) {
  try {
    if (avatar.active) {
      await avatarsStore.deactivateAvatar(avatar.id)
      toast.notify('Avatar desativado.')
    } else {
      await avatarsStore.activateAvatar(avatar.id)
      toast.notify('Avatar reativado!')
    }
  } catch (e) {
    toast.notify(e.message || 'Erro ao alterar status.', 'error')
  }
}

// --- Dialog exclusão ---
const deleteAvatarDialog = ref(false)
const targetDeleteAvatar = ref(null)
const deletingAvatar     = ref(false)

function openDeleteDialog(avatar) {
  targetDeleteAvatar.value = avatar
  deleteAvatarDialog.value = true
}

async function softDelete() {
  deletingAvatar.value = true
  try {
    await avatarsStore.deactivateAvatar(targetDeleteAvatar.value.id)
    toast.notify('Avatar desativado.')
    deleteAvatarDialog.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao desativar.', 'error')
  } finally {
    deletingAvatar.value = false
  }
}

async function hardDelete() {
  deletingAvatar.value = true
  try {
    await avatarsStore.deleteAvatar(targetDeleteAvatar.value.id)
    toast.notify('Avatar excluído permanentemente.')
    deleteAvatarDialog.value = false
  } catch (e) {
    toast.notify(e.message || 'Erro ao excluir.', 'error')
  } finally {
    deletingAvatar.value = false
  }
}
</script>
