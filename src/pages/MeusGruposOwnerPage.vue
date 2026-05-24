<template>
  <AppLayout>
    <!-- Header igual MeusGruposPage -->
    <div class="mb-4">
      <div class="d-flex align-center justify-space-between">
        <div class="text-h5 font-weight-bold">{{ ownedGroups.length ? 'Meus Grupos' : 'Criar Grupo' }}</div>
        <v-btn
          v-if="ownedGroups.length"
          color="green-darken-3"
          prepend-icon="mdi-plus"
          rounded="lg"
          class="d-none d-sm-flex"
          :disabled="!canCreate"
          @click="openDialog"
        >
          Criar grupo
        </v-btn>
      </div>
      <v-btn
        v-if="ownedGroups.length"
        color="green-darken-3"
        prepend-icon="mdi-plus"
        rounded="lg"
        block
        class="d-flex d-sm-none mt-2"
        :disabled="!canCreate"
        @click="openDialog"
      >
        Criar grupo
      </v-btn>
    </div>

    <v-progress-linear v-if="groups.loading" indeterminate color="green-darken-3" class="mb-4" />

    <!-- Grupos que já sou dono -->
    <template v-if="ownedGroups.length">
      <v-row>
        <v-col
          v-for="group in ownedGroups"
          :key="group.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            elevation="2"
            rounded="lg"
            :to="{ name: 'MeusGrupoDetail', params: { id: group.id } }"
            hover
          >
            <v-img
              v-if="group.image_url"
              :src="group.image_url"
              height="120"
              cover
              class="rounded-t-lg"
            >
              <template #error>
                <div class="bg-green-darken-4 d-flex align-center justify-center rounded-t-lg" style="height:120px">
                  <v-icon icon="mdi-account-group" size="48" color="white" style="opacity:.35" />
                </div>
              </template>
            </v-img>
            <div
              v-else
              class="bg-green-darken-4 d-flex align-center justify-center rounded-t-lg"
              style="height:120px"
            >
              <v-icon icon="mdi-account-group" size="48" color="white" style="opacity:.35" />
            </div>

            <v-card-text>
              <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                <span class="font-weight-bold text-body-1">{{ group.name }}</span>
              </div>
              <div v-if="group.description" class="text-caption text-medium-emphasis mb-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                {{ group.description }}
              </div>
              <v-chip size="x-small" :color="group.is_public ? 'green-darken-3' : 'grey'" variant="tonal">
                {{ group.is_public ? 'Público' : 'Privado' }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Estado vazio -->
    <div
      v-else-if="!groups.loading"
      class="empty-state d-flex flex-column align-center justify-center text-center"
      style="min-height: calc(100vh - 120px);"
    >
      <v-icon icon="mdi-account-group-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
      <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">Nenhum grupo criado</p>
      <p class="text-body-2 text-medium-emphasis" style="max-width:360px">
        Crie seu primeiro grupo e convide amigos para um ranking privado!
      </p>
      <!-- Desktop: badge no canto superior direito -->
      <v-badge
        model-value
        color="orange-darken-2"
        offset-x="20"
        rounded="xs"
        class="mt-6 d-none d-sm-inline-flex"
      >
        <template #badge>
          <span class="px-1 d-flex align-center justify-center"><v-icon icon="mdi-lock" size="10" class="mr-1" />100 selos</span>
        </template>
        <v-btn
          color="green-darken-3"
          variant="tonal"
          prepend-icon="mdi-plus"
          rounded="lg"
          :disabled="!canCreate"
          @click="openDialog"
        >
          Criar meu primeiro grupo
        </v-btn>
      </v-badge>

      <!-- Mobile: badge centralizada embaixo do botão -->
      <div class="d-flex d-sm-none flex-column align-center mt-6">
        <v-btn
          color="green-darken-3"
          variant="tonal"
          prepend-icon="mdi-plus"
          rounded="lg"
          :disabled="!canCreate"
          @click="openDialog"
        >
          Criar meu primeiro grupo
        </v-btn>
        <v-chip
          color="orange-darken-2"
          size="x-small"
          rounded="xs"
          class="mt-n2"
          style="z-index:1"
        >
          <v-icon icon="mdi-lock" size="10" class="mr-1" />100 selos
        </v-chip>
      </div>
    </div>

    <!-- Dialog: criar grupo -->
    <v-dialog v-model="createDialog" max-width="520">
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Criar grupo</v-card-title>

        <v-alert
          v-if="!canCreate"
          type="error"
          density="compact"
          variant="tonal"
          class="mx-4 mt-2"
          icon="mdi-seal"
        >
          Selos insuficientes. Você precisa de <strong>100 selos</strong> para criar um grupo. Seu saldo atual: <strong>{{ auth.profile?.total_seals ?? 0 }} selos</strong>.
        </v-alert>
        <div v-else class="px-4 pt-2 d-flex align-center gap-1 text-caption text-medium-emphasis">
          <v-icon icon="mdi-seal" size="14" color="green-darken-3" />
          Custo: <strong class="text-green-darken-3">100 selos</strong>
          <span class="mx-1">·</span>
          Seu saldo: <strong>{{ auth.profile?.total_seals ?? 0 }} selos</strong>
        </div>

        <v-card-text class="px-4 pb-2 d-flex flex-column gap-4">
          <!-- Nome -->
          <v-text-field
            v-model="form.name"
            label="Nome do grupo"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            autofocus
            :rules="[v => !!v?.trim() || 'Informe um nome']"
          />

          <!-- Descrição -->
          <v-textarea
            v-model="form.description"
            label="Descrição (opcional)"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            rows="2"
            auto-grow
            hide-details
            class="mb-sm-2"
          />

          <!-- Privacidade -->
          <div class="d-flex flex-column flex-sm-row align-center justify-space-between pa-1 gap-2 mt-2 mt-sm-0">
            <div class="text-center text-sm-start">
              <div class="text-body-2 font-weight-medium">Privacidade</div>
              <div class="text-caption text-medium-emphasis">
                {{ form.is_public ? 'Qualquer membro pode ver o grupo' : 'Apenas convidados podem entrar' }}
              </div>
            </div>
            <v-btn-toggle
              v-model="form.is_public"
              mandatory
              rounded="lg"
              density="compact"
              color="green-darken-3"
              class="w-100 w-sm-auto"
              style="border: 1.5px solid #2e7d32"
            >
              <v-btn :value="false" size="small" class="flex-grow-1">
                <v-icon start icon="mdi-lock-outline" />
                Privado
              </v-btn>
              <v-btn :value="true" size="small" class="flex-grow-1">
                <v-icon start icon="mdi-earth" />
                Público
              </v-btn>
            </v-btn-toggle>
          </div>

          <!-- Imagem -->
          <div class="d-flex flex-column align-center align-sm-center">
            <div class="text-body-2 font-weight-medium mb-2 text-center mt-2 mt-sm-4">Imagem do grupo (opcional)</div>
            <v-btn-toggle
              v-model="imageMode"
              mandatory
              rounded="lg"
              density="compact"
              color="green-darken-3"
              class="mb-3 w-100 w-sm-auto"
              style="border: 1.5px solid #2e7d32"
            >
              <v-btn value="url" size="small" class="flex-grow-1 px-sm-6">
                <v-icon start icon="mdi-link" />
                URL
              </v-btn>
              <v-btn value="file" size="small" class="flex-grow-1 px-sm-6">
                <v-icon start icon="mdi-upload" />
                Upload
              </v-btn>
            </v-btn-toggle>

            <v-text-field
              v-if="imageMode === 'url'"
              v-model="form.image_url"
              label="Cole a URL da imagem"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              placeholder="https://..."
              class="w-100"
              @update:model-value="previewFromUrl"
            />

            <v-file-input
              v-else
              v-model="imageFile"
              label="Selecionar imagem"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              accept="image/*"
              prepend-icon=""
              prepend-inner-icon="mdi-image-outline"
              class="w-100"
              @update:model-value="previewFromFile"
            />

            <v-img
              v-if="imagePreview"
              :src="imagePreview"
              height="140"
              cover
              rounded="lg"
              class="mt-3 w-100"
            >
              <template #error>
                <div class="bg-grey-lighten-3 d-flex align-center justify-center rounded-lg" style="height:140px">
                  <v-icon icon="mdi-image-broken" size="32" color="grey" />
                </div>
              </template>
            </v-img>
          </div>
        </v-card-text>

        <v-card-actions class="px-4 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="createDialog = false">Cancelar</v-btn>
          <v-btn
            color="green-darken-3"
            variant="tonal"
            rounded="lg"
            :loading="creating"
            :disabled="!form.name?.trim() || !canCreate"
            @click="requestCreate"
          >
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog: confirmar gasto de selos -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card rounded="lg" class="text-center overflow-visible">
        <div class="seal-burst-wrapper" aria-hidden="true">
          <span v-if="confirmDialog" v-for="i in 8" :key="i" class="seal-particle" :style="`--i:${i}`">🔖</span>
        </div>
        <v-card-text class="pt-8 pb-2">
          <v-icon icon="mdi-account-group" size="48" color="green-darken-3" class="mb-3" />
          <div class="text-h6 font-weight-bold mb-1">Criar "{{ form.name }}"?</div>
          <div class="text-body-2 text-medium-emphasis mb-4">
            Você vai utilizar <strong>100 selos</strong> para abrir seu grupo {{ form.is_public ? 'público' : 'privado' }}.
          </div>
          <v-chip color="orange-darken-2" variant="tonal" size="small">
            <v-icon icon="mdi-seal" start size="14" />
            Seu saldo: {{ auth.profile?.total_seals ?? 0 }} selos
          </v-chip>
        </v-card-text>
        <v-card-actions class="px-4 pb-4 gap-2 justify-end">
          <v-btn variant="text" rounded="lg" @click="confirmDialog = false">Cancelar</v-btn>
          <v-btn color="green-darken-3" variant="tonal" rounded="lg" :loading="creating" @click="handleCreate">
            Confirmar e criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const groups = useGroupsStore()
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const createDialog = ref(false)
const confirmDialog = ref(false)
const creating = ref(false)
const imageMode = ref('url')
const imageFile = ref(null)
const imagePreview = ref('')
const form = ref({ name: '', description: '', is_public: false, image_url: '' })

const ownedGroups = computed(() =>
  groups.myGroups.filter(g => g.owner_id === auth.user?.id)
)

const canCreate = computed(() => (auth.profile?.total_seals ?? 0) >= 100)

function activeCount(group) {
  return (group.group_members || []).filter(m => m.status === 'active').length
}

function openDialog() {
  form.value = { name: '', description: '', is_public: false, image_url: '' }
  imageMode.value = 'url'
  imageFile.value = null
  imagePreview.value = ''
  createDialog.value = true
}

function previewFromUrl(val) {
  imagePreview.value = val?.trim() || ''
}

function previewFromFile(files) {
  const file = Array.isArray(files) ? files[0] : (files instanceof File ? files : null)
  if (!file) { imagePreview.value = ''; return }
  const reader = new FileReader()
  reader.onload = e => { imagePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

function requestCreate() {
  if (!form.value.name?.trim()) return
  confirmDialog.value = true
}

async function handleCreate() {
  confirmDialog.value = false
  // aguarda a animação de selos antes de criar
  await new Promise(r => setTimeout(r, 700))
  creating.value = true
  try {
    let finalImageUrl = form.value.image_url?.trim() || ''

    if (imageMode.value === 'file' && imageFile.value) {
      const file = Array.isArray(imageFile.value) ? imageFile.value[0] : imageFile.value
      if (file) finalImageUrl = await groups.uploadGroupImage(file)
    }

    const group = await groups.createGroup({
      name: form.value.name.trim(),
      description: form.value.description?.trim() || null,
      is_public: form.value.is_public,
      image_url: finalImageUrl || null,
    })

    createDialog.value = false
    toast.notify('Grupo criado!', 'success')
    router.push({ name: 'MeusGrupoDetail', params: { id: group.id } })
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    creating.value = false
  }
}

onMounted(async () => {
  await groups.fetchMyGroups()
})
</script>

<style scoped>
.seal-burst-wrapper {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  width: 0;
  height: 0;
  z-index: 10;
}

.seal-particle {
  position: absolute;
  font-size: 20px;
  animation: seal-fly 1.4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 175ms);
  opacity: 0;
}

@keyframes seal-fly {
  0%   { transform: translate(0, 0) scale(1);                                    opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 0.6; }
  100% { transform: translate(calc((var(--i) - 4.5) * 38px), -70px) scale(0.2); opacity: 0; }
}
</style>
