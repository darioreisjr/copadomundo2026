<template>
  <AppLayout>
    <div class="mb-4">
      <div class="text-h5 font-weight-bold">Grupos</div>
    </div>

    <v-progress-linear v-if="groups.loading" indeterminate color="green-darken-3" class="mb-4" />

    <!-- Convites pendentes -->
    <template v-if="groups.pendingInvites.length">
      <div class="text-subtitle-1 font-weight-medium mb-2 d-flex align-center gap-2">
        <v-icon icon="mdi-email-outline" color="amber-darken-2" size="small" />
        Convites recebidos
        <v-chip size="x-small" color="amber-darken-2">{{ groups.pendingInvites.length }}</v-chip>
      </div>

      <v-row class="mb-6">
        <v-col
          v-for="invite in groups.pendingInvites"
          :key="invite.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card elevation="2" rounded="lg" border>
            <v-card-text class="pb-2">
              <div class="font-weight-bold text-body-1 mb-1">{{ invite.groups?.name }}</div>
              <div class="text-caption text-medium-emphasis">
                Convidado por
                <span class="font-weight-medium">
                  {{ invite.profiles?.nome_fantasia || invite.profiles?.name || 'alguém' }}
                  <template v-if="invite.profiles?.username"> (@{{ invite.profiles.username }})</template>
                </span>
              </div>
            </v-card-text>
            <v-card-actions class="pt-0 px-4 pb-3 gap-2">
              <v-btn
                color="green-darken-3"
                variant="tonal"
                size="small"
                rounded="lg"
                :loading="acceptingId === invite.id"
                @click="handleAccept(invite.id)"
              >
                Aceitar
              </v-btn>
              <v-btn
                color="red"
                variant="text"
                size="small"
                rounded="lg"
                :loading="decliningId === invite.id"
                @click="handleDecline(invite.id)"
              >
                Recusar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-divider class="mb-6" />
    </template>

    <!-- Lista de grupos -->
    <template v-if="groups.myGroups.length">
      <v-row>
        <v-col
          v-for="group in groups.myGroups"
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
              <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                <v-icon v-if="!group.image_url" icon="mdi-account-group" color="green-darken-3" />
                <span class="font-weight-bold text-body-1">{{ group.name }}</span>
                <v-chip v-if="group.owner_id === auth.user?.id" size="x-small" color="green-darken-3" variant="tonal">Dono</v-chip>
                <v-chip size="x-small" :color="group.is_public ? 'blue' : 'grey'" variant="tonal">
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
    </template>

    <!-- Estado vazio -->
    <div
      v-else-if="!groups.loading && !groups.pendingInvites.length"
      class="empty-state d-flex flex-column align-center justify-center text-center"
      style="min-height: calc(100vh - 120px);"
    >
      <v-icon icon="mdi-account-group-outline" size="80" color="green-darken-2" style="opacity:.35" class="mb-6" />
      <p class="text-h6 font-weight-medium text-medium-emphasis mb-2">Nenhum grupo ainda</p>
      <p class="text-body-2 text-medium-emphasis" style="max-width:360px">
        Crie seu próprio grupo ou encontre grupos públicos para participar!
      </p>
      <v-btn
        color="blue-darken-2"
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
          <v-icon icon="mdi-magnify" color="blue-darken-2" />
          Encontrar grupo
        </v-card-title>

        <v-card-text class="px-4 pb-2">
          <div class="d-flex gap-2 mb-4">
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
            color="blue-darken-2"
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
                <v-list-item
                  :to="{ name: 'GrupoDetail', params: { id: result.id } }"
                  @click="searchDialog = false"
                  class="py-2"
                >
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
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const groups = useGroupsStore()
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const acceptingId = ref(null)
const decliningId = ref(null)

const searchDialog = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const searched = ref(false)
const randomLoading = ref(false)

function activeCount(group) {
  return (group.group_members || []).filter(m => m.status === 'active').length
}

function pendingCount(group) {
  return (group.group_members || []).filter(m => m.status === 'pending').length
}

function activeMemberCount(group) {
  return (group.group_members || []).filter(m => m.status === 'active').length
}

async function handleSearch() {
  if (!searchQuery.value?.trim()) return
  searching.value = true
  searched.value = false
  try {
    searchResults.value = await groups.searchPublicGroups(searchQuery.value.trim())
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
    searchDialog.value = false
    router.push({ name: 'GrupoDetail', params: { id: group.id } })
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    randomLoading.value = false
  }
}

async function handleAccept(memberId) {
  acceptingId.value = memberId
  try {
    await groups.acceptInvite(memberId)
    toast.notify('Você entrou no grupo!', 'success')
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    acceptingId.value = null
  }
}

async function handleDecline(memberId) {
  decliningId.value = memberId
  try {
    await groups.declineInvite(memberId)
    toast.notify('Convite recusado.', 'info')
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    decliningId.value = null
  }
}

onMounted(async () => {
  await Promise.all([groups.fetchMyGroups(), groups.fetchPendingInvites()])
})
</script>
