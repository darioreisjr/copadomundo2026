<template>
  <AppLayout>
    <div class="mb-4">
      <div class="text-h5 font-weight-bold mb-3">Grupos</div>
      <div v-if="groups.myGroups.length" class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between gap-2">
        <v-text-field
          v-model="groupFilter"
          placeholder="Pesquisar meus grupos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          clearable
          :style="$vuetify.display.xs ? '' : 'max-width:420px'"
          class="mb-1 mb-sm-0"
        />
        <v-btn
          color="green-darken-3"
          prepend-icon="mdi-account-search"
          rounded="lg"
          class="mb-4 mb-sm-0"
          @click="searchDialog = true"
        >
          Encontrar grupo
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="groups.loading" indeterminate color="green-darken-3" class="mb-4" />

    <!-- Lista de grupos -->
    <template v-if="groups.myGroups.length">
      <v-row>
        <v-col
          v-for="group in filteredGroups"
          :key="group.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            elevation="2"
            rounded="lg"
            :to="{ name: 'GrupoDetail', params: { id: group.id } }"
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
                <div class="bg-green-darken-4 d-flex align-center justify-center" style="height:120px">
                  <v-icon icon="mdi-account-group" size="40" color="white" style="opacity:.4" />
                </div>
              </template>
            </v-img>

            <v-card-text>
              <div class="d-flex align-center gap-2 mb-1">
                <v-icon v-if="!group.image_url" icon="mdi-account-group" color="green-darken-3" />
                <span class="font-weight-bold text-body-1">{{ group.name }}</span>
              </div>
              <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                <v-chip v-if="group.owner_id === auth.user?.id" size="x-small" color="green-darken-3" variant="tonal">Dono</v-chip>
                <v-chip size="x-small" color="green-darken-3" variant="tonal">
                  {{ group.is_public ? 'Público' : 'Privado' }}
                </v-chip>
              </div>
              <div v-if="group.description" class="text-caption text-medium-emphasis mb-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
                {{ group.description }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ activeCount(group) }} membro{{ activeCount(group) !== 1 ? 's' : '' }}
                <template v-if="pendingCount(group)">
                  · {{ pendingCount(group) }} convite{{ pendingCount(group) !== 1 ? 's' : '' }} pendente{{ pendingCount(group) !== 1 ? 's' : '' }}
                </template>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div
        v-if="groups.myGroups.length && !filteredGroups.length"
        class="text-center py-8 text-medium-emphasis text-body-2"
      >
        Nenhum grupo encontrado para "{{ groupFilter }}".
      </div>
    </template>

    <!-- Estado vazio -->
    <div
      v-else-if="!groups.loading"
      class="empty-state d-flex flex-column align-center justify-center text-center"
      style="min-height: calc(100vh - 120px);"
    >
      <v-icon icon="mdi-account-group-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
      <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">Nenhum grupo ainda</p>
      <p class="text-body-2 text-medium-emphasis" style="max-width:360px">
        Crie seu próprio grupo ou encontre grupos públicos para participar!
      </p>
      <v-btn
        color="green-darken-2"
        variant="tonal"
        prepend-icon="mdi-magnify"
        rounded="lg"
        class="mt-6"
        @click="searchDialog = true"
      >
        Entrar em grupo
      </v-btn>
    </div>

    <!-- Modal: buscar grupo público -->
    <v-dialog v-model="searchDialog" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold d-flex align-center gap-2">
          <v-icon icon="mdi-magnify" color="green-darken-2" class="mr-1" />
          Encontrar grupo
        </v-card-title>

        <v-card-text class="px-4 pb-2">
          <div class="d-flex gap-3 mb-4">
            <v-text-field
              v-model="searchQuery"
              label="Nome do grupo"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              hide-details
              class="flex-grow-1"
              @keyup.enter="handleSearch"
            />
            <v-btn
              color="green-darken-3"
              variant="tonal"
              rounded="lg"
              height="48"
              :loading="searching"
              icon="mdi-magnify"
              @click="handleSearch"
            />
          </div>

          <!-- Botão grupo aleatório -->
          <v-btn
            block
            variant="outlined"
            color="green-darken-2"
            rounded="lg"
            prepend-icon="mdi-shuffle-variant"
            :loading="randomLoading"
            class="mb-4"
            @click="handleRandom"
          >
            Grupo aleatório
          </v-btn>

          <!-- Resultados -->
          <v-progress-linear v-if="searching" indeterminate color="green-darken-3" class="mb-3" />

          <template v-if="searchResults.length">
            <div class="text-caption text-medium-emphasis mb-2">{{ searchResults.length }} resultado{{ searchResults.length !== 1 ? 's' : '' }}</div>
            <v-list rounded="lg" elevation="1" class="pa-0" lines="two">
              <template v-for="(result, idx) in searchResults" :key="result.id">
                <v-divider v-if="idx > 0" />
                <v-list-item class="py-2">
                  <template #prepend>
                    <v-avatar size="40" rounded="lg" color="green-darken-3" class="mr-3">
                      <v-img v-if="result.image_url" :src="result.image_url" cover />
                      <v-icon v-else icon="mdi-account-group" color="white" size="small" />
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ result.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ activeMemberCount(result) }} membro{{ activeMemberCount(result) !== 1 ? 's' : '' }}
                    <template v-if="result.description"> · {{ result.description }}</template>
                  </v-list-item-subtitle>
                  <template #append>
                    <v-btn
                      v-if="!isAlreadyMember(result) && !hasPendingRequest(result)"
                      size="small"
                      :color="result.is_public ? 'green-darken-2' : 'blue-darken-2'"
                      variant="tonal"
                      rounded="lg"
                      @click.stop="openJoinConfirm(result)"
                    >
                      {{ result.is_public ? 'Entrar' : 'Solicitar' }}
                    </v-btn>
                    <v-chip v-else-if="hasPendingRequest(result)" size="small" color="orange-darken-2" variant="tonal">
                      <v-icon start size="x-small" icon="mdi-clock-outline" />
                      Aguardando
                    </v-chip>
                    <v-chip v-else size="small" color="green-darken-2" variant="tonal">Membro</v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </template>

          <div v-else-if="searched && !searching" class="text-center py-4 text-medium-emphasis text-body-2">
            Nenhum grupo público encontrado.
          </div>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="searchDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: confirmar entrada no grupo -->
    <v-dialog v-model="joinConfirmDialog" max-width="400" persistent>
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold d-flex align-center gap-2">
          <v-icon :icon="joiningGroup?.is_public ? 'mdi-account-group' : 'mdi-lock-outline'" :color="joiningGroup?.is_public ? 'green-darken-2' : 'blue-darken-2'" />
          {{ joiningGroup?.is_public ? 'Entrar no grupo?' : 'Solicitar entrada?' }}
        </v-card-title>
        <v-card-text class="px-4">
          <template v-if="joiningGroup?.is_public">
            Tem certeza que deseja entrar no grupo <strong>{{ joiningGroup?.name }}</strong>?
          </template>
          <template v-else>
            O grupo <strong>{{ joiningGroup?.name }}</strong> é privado. Sua solicitação será enviada ao dono do grupo para aprovação.
          </template>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="joinConfirmDialog = false">Cancelar</v-btn>
          <v-btn
            :color="joiningGroup?.is_public ? 'green-darken-2' : 'blue-darken-2'"
            variant="tonal"
            rounded="lg"
            :loading="joiningLoading"
            @click="confirmJoin"
          >
            {{ joiningGroup?.is_public ? 'Entrar' : 'Enviar solicitação' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const groups = useGroupsStore()
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const groupFilter = ref('')
const filteredGroups = computed(() => {
  if (!groupFilter.value?.trim()) return groups.myGroups
  const q = groupFilter.value.trim().toLowerCase()
  return groups.myGroups.filter(g => g.name.toLowerCase().includes(q))
})

const searchDialog = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searched = ref(false)
const randomLoading = ref(false)

const joinConfirmDialog = ref(false)
const joiningGroup = ref(null)
const joiningLoading = ref(false)

function activeCount(group) {
  return (group.group_members || []).filter(m => m.status === 'active').length
}

function pendingCount(group) {
  return (group.group_members || []).filter(m => m.status === 'pending').length
}

function activeMemberCount(group) {
  return (group.group_members || []).filter(m => m.status === 'active').length
}

function isAlreadyMember(group) {
  const uid = auth.user?.id
  return group.owner_id === uid || (group.group_members || []).some(m => m.user_id === uid && m.status === 'active')
}

function hasPendingRequest(group) {
  const uid = auth.user?.id
  return (group.group_members || []).some(m => m.user_id === uid && m.status === 'pending')
}

function openJoinConfirm(group) {
  joiningGroup.value = group
  joinConfirmDialog.value = true
}

async function confirmJoin() {
  joiningLoading.value = true
  try {
    if (joiningGroup.value.is_public) {
      await groups.joinGroup(joiningGroup.value.id)
      toast.notify(`Você entrou no grupo ${joiningGroup.value.name}!`, 'success')
      joinConfirmDialog.value = false
      searchDialog.value = false
      router.push({ name: 'GrupoDetail', params: { id: joiningGroup.value.id } })
    } else {
      await groups.requestToJoin(joiningGroup.value.id)
      toast.notify('Solicitação enviada! Aguarde a aprovação do dono do grupo.', 'success')
      joinConfirmDialog.value = false
      // Atualiza os resultados para refletir a solicitação enviada
      searchResults.value = await groups.searchGroups(searchQuery.value.trim() || joiningGroup.value.name)
    }
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    joiningLoading.value = false
  }
}

async function handleSearch() {
  if (!searchQuery.value?.trim()) return
  searching.value = true
  searched.value = false
  try {
    searchResults.value = await groups.searchGroups(searchQuery.value.trim())
    searched.value = true
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    searching.value = false
  }
}

async function handleRandom() {
  randomLoading.value = true
  try {
    const group = await groups.fetchRandomPublicGroup()
    if (!group) {
      toast.notify('Nenhum grupo público disponível.', 'info')
      return
    }
    searchResults.value = [group]
    searched.value = true
    searchQuery.value = ''
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    randomLoading.value = false
  }
}

onMounted(async () => {
  await groups.fetchMyGroups()
})
</script>
