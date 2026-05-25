<template>
  <AppLayout>
    <v-progress-linear v-if="loading" indeterminate color="green-darken-3" class="mb-4" />

    <template v-if="group">
      <!-- Cabeçalho Desktop -->
      <div class="d-none d-sm-block mb-4">
        <!-- Linha 1: Voltar + Sair do grupo -->
        <div class="d-flex align-center justify-space-between mb-3">
          <v-btn :to="backRoute" variant="text" prepend-icon="mdi-arrow-left">
            Voltar
          </v-btn>
          <v-btn
            v-if="isMember && !isOwner"
            color="red-darken-2"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-logout"
            @click="leaveDialog = true"
          >
            Sair do grupo
          </v-btn>
        </div>

        <!-- Linha 2: Avatar + info -->
        <div class="d-flex align-start gap-4">
          <v-avatar v-if="group.image_url" size="72" rounded="lg">
            <v-img :src="group.image_url" cover />
          </v-avatar>
          <v-avatar v-else size="72" color="green-darken-3" rounded="lg">
            <v-icon icon="mdi-account-group" color="white" />
          </v-avatar>

          <div class="px-3">
            <span class="text-h5 font-weight-bold">{{ group.name }}</span>
            <div v-if="group.description" class="text-body-2 text-medium-emphasis mt-1">
              {{ group.description }}
            </div>
            <div class="d-flex align-center gap-2 flex-wrap mt-2">
              <v-chip v-if="isOwner && route.name !== 'MeusGrupoDetail'" size="small" color="green-darken-3" variant="tonal">Dono</v-chip>
              <v-chip size="small" color="green-darken-3" variant="tonal">
                <v-icon start :icon="group.is_public ? 'mdi-earth' : 'mdi-lock-outline'" size="x-small" />
                {{ group.is_public ? 'Público' : 'Privado' }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Cabeçalho Mobile -->
      <div class="d-flex d-sm-none flex-column mb-4">
        <!-- Linha 1: Voltar -->
        <div>
          <v-btn :to="backRoute" variant="text" prepend-icon="mdi-arrow-left">
            Voltar
          </v-btn>
        </div>

        <!-- Linha 2: Avatar + Sair do grupo -->
        <div class="d-flex align-center justify-space-between mt-3">
          <v-avatar v-if="group.image_url" size="80" rounded="lg">
            <v-img :src="group.image_url" cover />
          </v-avatar>
          <v-avatar v-else size="80" color="green-darken-3" rounded="lg">
            <v-icon icon="mdi-account-group" color="white" />
          </v-avatar>

          <v-btn
            v-if="isMember && !isOwner"
            color="red-darken-2"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-logout"
            size="small"
            @click="leaveDialog = true"
          >
            Sair do grupo
          </v-btn>
        </div>

        <!-- Linha 3: Nome -->
        <span class="text-h6 font-weight-bold mt-3">{{ group.name }}</span>

        <!-- Linha 4: Descrição -->
        <div v-if="group.description" class="text-body-2 text-medium-emphasis mt-2">
          {{ group.description }}
        </div>

        <!-- Linha 5: Status -->
        <div class="d-flex align-center gap-2 flex-wrap mt-2">
          <v-chip v-if="isOwner && route.name !== 'MeusGrupoDetail'" size="small" color="green-darken-3" variant="tonal">Dono</v-chip>
          <v-chip size="small" color="green-darken-3" variant="tonal">
            <v-icon start :icon="group.is_public ? 'mdi-earth' : 'mdi-lock-outline'" size="x-small" />
            {{ group.is_public ? 'Público' : 'Privado' }}
          </v-chip>
        </div>
      </div>

      <!-- Abas Mobile: select -->
      <v-select
        v-if="route.name !== 'MeusGrupoDetail'"
        v-model="tab"
        :items="[{ title: 'Ranking', value: 'ranking' }]"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        color="green-darken-3"
        class="d-flex d-sm-none mb-4"
      />
      <v-select
        v-else
        v-model="tab"
        :items="[{ title: 'Membros', value: 'membros' }, { title: 'Gerenciar', value: 'gerenciar' }]"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        color="green-darken-3"
        class="d-flex d-sm-none mb-4"
      />

      <!-- Abas Desktop: tabs -->
      <v-tabs v-model="tab" color="green-darken-3" class="d-none d-sm-flex mb-4">
        <v-tab v-if="route.name !== 'MeusGrupoDetail'" value="ranking">
          <v-icon start icon="mdi-podium" />
          Ranking
        </v-tab>
        <v-tab v-if="route.name === 'MeusGrupoDetail'" value="membros">
          <v-icon start icon="mdi-account-group" />
          Membros
        </v-tab>
        <v-tab v-if="route.name === 'MeusGrupoDetail'" value="gerenciar">
          <v-icon start icon="mdi-cog" />
          Gerenciar
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- Aba Ranking -->
        <v-window-item value="ranking">
          <v-progress-linear v-if="rankingLoading" indeterminate color="green-darken-3" class="mb-4" />

          <template v-if="isMember">
          <template v-if="groups.groupRanking.length">
            <v-card elevation="2" class="w-100">
              <!-- Desktop -->
              <v-table class="d-none d-sm-table w-100">
                <thead>
                  <tr style="border-bottom: 2px solid rgba(0,0,0,0.12)">
                    <th class="text-center" style="padding-left:0;padding-right:0">Posição</th>
                    <th class="text-left">Nome</th>
                    <th class="text-center">Pontos</th>
                    <th class="text-center">Placares exatos</th>
                    <th class="text-center">Vencedor</th>
                    <th class="text-center">Empates</th>
                    <th class="text-center">Palpites</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(entry, idx) in groups.groupRanking"
                    :key="entry.user_id"
                    :class="entry.user_id === auth.user?.id ? 'bg-green-lighten-5 font-weight-bold' : ''"
                  >
                    <td class="text-center" style="padding-left:0;padding-right:0">
                      <v-chip
                        :color="idx === 0 ? 'amber' : idx === 1 ? 'grey-lighten-1' : idx === 2 ? 'brown-lighten-2' : 'default'"
                        :variant="idx < 3 ? 'elevated' : 'text'"
                        size="small"
                      >
                        {{ idx + 1 }}
                      </v-chip>
                    </td>
                    <td>
                      {{ entry.profiles?.name ?? '—' }}
                      <v-chip v-if="entry.user_id === auth.user?.id" size="x-small" color="green" class="ml-1">Você</v-chip>
                    </td>
                    <td class="text-center font-weight-bold text-green-darken-3">{{ entry.total_points }}</td>
                    <td class="text-center">{{ entry.exact_hits }}</td>
                    <td class="text-center">{{ entry.winner_hits }}</td>
                    <td class="text-center">{{ entry.draw_hits }}</td>
                    <td class="text-center">{{ entry.total_bets }}</td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Mobile -->
              <v-table class="d-sm-none">
                <thead>
                  <tr style="border-bottom: 2px solid rgba(0,0,0,0.12)">
                    <th class="text-center" style="padding-left:0;padding-right:0">Posição</th>
                    <th class="text-left">Nome</th>
                    <th class="text-center">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(entry, idx) in groups.groupRanking"
                    :key="entry.user_id"
                    :class="entry.user_id === auth.user?.id ? 'bg-green-lighten-5 font-weight-bold' : ''"
                    style="cursor:pointer"
                    @click="openModal(entry, idx)"
                  >
                    <td class="text-center" style="padding-left:0;padding-right:0">
                      <v-chip
                        :color="idx === 0 ? 'amber' : idx === 1 ? 'grey-lighten-1' : idx === 2 ? 'brown-lighten-2' : 'default'"
                        :variant="idx < 3 ? 'elevated' : 'text'"
                        size="small"
                      >
                        {{ idx + 1 }}
                      </v-chip>
                    </td>
                    <td>
                      {{ entry.profiles?.name ?? '—' }}
                      <v-chip v-if="entry.user_id === auth.user?.id" size="x-small" color="green" class="ml-1">Você</v-chip>
                    </td>
                    <td class="text-center font-weight-bold text-green-darken-3">{{ entry.total_points }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <div class="mt-4 text-caption text-medium-emphasis d-flex flex-column gap-1">
              <span><strong>Pontos</strong> — total acumulado de pontos no bolão</span>
              <span><strong>Placares exatos</strong> — acertou o placar exato do jogo (maior peso no desempate)</span>
              <span><strong>Vencedor</strong> — acertou apenas o time vencedor ou que o jogo terminaria empatado</span>
              <span><strong>Empates</strong> — acertou que o jogo terminaria empatado</span>
              <span><strong>Palpites</strong> — total de palpites registrados</span>
              <span class="mt-1">Critério de desempate: placares exatos → vencedor → palpites feitos</span>
            </div>
          </template>

          <div
            v-else-if="!rankingLoading"
            class="text-center py-12 text-medium-emphasis"
          >
            <v-icon icon="mdi-podium-silver" size="60" style="opacity:.3" class="mb-4" />
            <p>Nenhum resultado ainda. Aguarde os placares serem apurados!</p>
          </div>
          </template>

          <div v-else class="text-center py-12 text-medium-emphasis">
            <v-icon icon="mdi-lock-outline" size="60" style="opacity:.3" class="mb-4" />
            <p>Este ranking é visível apenas para membros do grupo.</p>
          </div>
        </v-window-item>

        <!-- Aba Membros -->
        <v-window-item value="membros">
          <!-- Convidar por username (só o dono vê) -->
          <template v-if="isOwner">
            <v-card :elevation="route.name === 'MeusGrupoDetail' ? 0 : 1" rounded="lg" class="mb-6 pa-4" :style="route.name === 'MeusGrupoDetail' ? ($vuetify.display.xs ? 'background: transparent; box-shadow: none; border: none;' : 'max-width: 50%; background: transparent; box-shadow: none; border: none;') : ''">
              <div class="text-body-1 text-medium-emphasis mb-1">
                (<strong :class="availableSlots === 0 ? 'text-red-darken-2' : ''">{{ usedSlots }}/{{ maxSlots }}</strong>) vaga{{ maxSlots !== 1 ? 's' : '' }} usada{{ maxSlots !== 1 ? 's' : '' }}
              </div>
              <div class="text-subtitle-2 font-weight-medium mb-3">Convidar por @username</div>
              <div class="d-flex gap-2 align-start">
                <v-text-field
                  ref="inviteInputRef"
                  v-model="inviteUsername"
                  label="@username"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :hide-details="availableSlots > 0"
                  prefix="@"
                  class="flex-grow-1"
                  @keyup.enter="handleInvite"
                >
                  <template v-if="availableSlots === 0" #details>
                    <span class="text-caption text-red-darken-2">Sem vagas. Compre mais vagas abaixo.</span>
                  </template>
                </v-text-field>
                <v-btn
                  color="green-darken-3"
                  variant="tonal"
                  rounded="lg"
                  height="48"
                  :loading="inviting"
                  :disabled="!inviteUsername?.trim() || availableSlots === 0"
                  @click="handleInvite"
                >
                  Convidar
                </v-btn>
              </div>
            </v-card>

          </template>

          <!-- Cards de membros -->
          <v-progress-linear v-if="membersLoading" indeterminate color="green-darken-3" class="mb-3" />

          <!-- Seção: Solicitações de entrada (só dono vê) -->
          <template v-if="isOwner && joinRequests.length">
            <div class="text-subtitle-2 font-weight-medium mb-3 d-flex align-center gap-1">
              Solicitações de entrada ({{ joinRequests.length }})
            </div>
            <v-row class="mb-6">
              <v-col
                v-for="req in joinRequests"
                :key="req.id"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  rounded="lg"
                  elevation="2"
                  class="pa-2"
                  style="min-height: 130px; position: relative; border: 2px solid #e65100;"
                >
                  <div style="position: absolute; top: 8px; right: 8px;">
                    <v-chip color="orange-darken-2" size="x-small" variant="tonal">
                      Solicitação
                    </v-chip>
                  </div>

                  <div class="d-flex flex-column align-center text-center pt-2 pb-1">
                    <v-avatar color="orange-darken-2" size="48" class="mb-2">
                      <v-img v-if="req.profiles?.avatar_url" :src="req.profiles.avatar_url" cover />
                      <span v-else class="text-white font-weight-bold text-body-2">
                        {{ (req.profiles?.name || '?')[0].toUpperCase() }}
                      </span>
                    </v-avatar>
                    <div class="font-weight-medium text-body-2" style="line-height:1.3">
                      {{ req.profiles?.name ?? '—' }}
                    </div>
                    <div v-if="req.profiles?.username" class="text-caption text-medium-emphasis">
                      @{{ req.profiles.username }}
                    </div>
                  </div>

                  <div class="d-flex justify-center gap-6 mt-1 mb-2">
                    <v-btn
                      size="x-small"
                      color="green-darken-2"
                      variant="tonal"
                      rounded="lg"
                      class="px-4 mr-3"
                      style="height: 36px;"
                      :loading="acceptingRequestId === req.id"
                      @click="handleAcceptRequest(req.id)"
                    >
                      Aceitar
                    </v-btn>
                    <v-btn
                      size="x-small"
                      color="red"
                      variant="tonal"
                      rounded="lg"
                      class="px-4"
                      style="height: 36px;"
                      :loading="rejectingRequestId === req.id"
                      @click="handleRejectRequest(req)"
                    >
                      Rejeitar
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-divider class="mb-4" />
          </template>

          <v-row>
            <v-col
              v-for="member in activeAndInvitedMembers"
              :key="member.id"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card
                rounded="lg"
                :elevation="member.user_id === auth.user?.id ? 0 : 2"
                :style="member.user_id === auth.user?.id
                  ? 'border: 2px solid #2e7d32; background: #f1f8e9;'
                  : route.name === 'MeusGrupoDetail'
                    ? member.status === 'active'
                      ? 'border: 2px solid #43a047;'
                      : 'border: 2px solid #ffa000;'
                    : ''"
                class="pa-2"
                style="min-height: 130px; position: relative;"
              >
                <!-- Status: canto superior direito -->
                <div style="position: absolute; top: 8px; right: 8px;">
                  <v-chip
                    :color="member.status === 'active' ? 'green' : 'amber-darken-2'"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ member.status === 'active' ? 'Ativo' : 'Convite pendente' }}
                  </v-chip>
                </div>

                <!-- Conteúdo centralizado -->
                <div class="d-flex flex-column align-center text-center pt-2 pb-1">
                  <v-avatar color="green-darken-2" size="48" class="mb-2">
                    <v-img v-if="member.profiles?.avatar_url" :src="member.profiles.avatar_url" cover />
                    <span v-else class="text-white font-weight-bold text-body-2">
                      {{ (member.profiles?.name || '?')[0].toUpperCase() }}
                    </span>
                  </v-avatar>
                  <div class="font-weight-medium text-body-2" style="line-height:1.3">
                    {{ member.profiles?.name ?? '—' }}
                  </div>
                  <div v-if="member.profiles?.username" class="text-caption text-medium-emphasis">
                    @{{ member.profiles.username }}
                  </div>
                </div>

                <!-- Remover: canto inferior direito -->
                <div v-if="isOwner && member.user_id !== auth.user?.id" style="position: absolute; bottom: 6px; right: 6px;">
                  <v-btn
                    icon="mdi-account-remove"
                    variant="text"
                    size="x-small"
                    color="red"
                    :loading="removingId === member.user_id"
                    @click="openRemoveDialog(member)"
                  />
                </div>
              </v-card>
            </v-col>

            <!-- Cards de vagas vazias -->
            <v-col
              v-for="n in availableSlots"
              :key="`empty-${n}`"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card
                rounded="lg"
                elevation="0"
                class="pa-2 d-flex flex-column align-center justify-center"
                style="min-height: 130px; border: 2px dashed #a5d6a7; cursor: pointer;"
                @click="focusInviteInput"
              >
                <v-avatar color="grey-lighten-3" size="48" class="mb-2">
                  <v-icon icon="mdi-plus" color="grey-lighten-1" size="28" />
                </v-avatar>
                <div class="text-caption text-medium-emphasis">Vaga livre</div>
              </v-card>
            </v-col>

            <!-- Card: comprar mais vagas (sempre visível para o dono) -->
            <v-col v-if="isOwner" key="buy-slots" cols="6" sm="4" md="3">
              <v-card
                rounded="lg"
                elevation="0"
                class="pa-2 d-flex flex-column align-center justify-center"
                style="min-height: 130px; border: 2px dashed #66bb6a; cursor: pointer;"
                @click="buySlotDialog = true"
              >
                <v-avatar color="green-lighten-4" size="48" class="mb-2">
                  <v-icon icon="mdi-plus-circle-outline" color="green-darken-2" size="28" />
                </v-avatar>
                <div class="text-caption font-weight-medium text-green-darken-2">Comprar vagas</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Excluir grupo (só dono, rota GrupoDetail) -->
          <template v-if="isOwner && route.name !== 'MeusGrupoDetail'">
            <v-divider class="mt-8 mb-4" />
            <div class="d-flex justify-end">
              <v-btn
                color="red"
                variant="tonal"
                prepend-icon="mdi-delete-outline"
                rounded="lg"
                @click="deleteDialog = true"
              >
                Excluir grupo
              </v-btn>
            </div>
          </template>
        </v-window-item>

        <!-- Aba Gerenciar (só dono na rota MeusGrupoDetail) -->
        <v-window-item value="gerenciar">
          <div class="d-flex justify-center mt-6">
          <v-card elevation="0" rounded="lg" class="pa-0 w-100" style="max-width: 540px;">
            <div class="d-flex flex-column gap-6">

              <!-- Nome -->
              <v-text-field
                v-model="editName"
                label="Nome do grupo"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details="auto"
                class="mt-4"
                :rules="[v => !!v?.trim() || 'Nome obrigatório']"
              />

              <!-- Descrição -->
              <v-textarea
                v-model="editDescription"
                label="Descrição (opcional)"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                rows="3"
                auto-grow
                hide-details
                class="mt-4"
              />

              <!-- Visibilidade -->
              <div class="d-flex align-center gap-4 py-2">
                <v-icon :icon="editIsPublic ? 'mdi-earth' : 'mdi-lock-outline'" color="green-darken-3" size="22" />
                <span class="text-body-2 mr-4">{{ editIsPublic ? 'Público' : 'Privado' }}</span>
                <v-switch
                  v-model="editIsPublic"
                  color="green-darken-3"
                  hide-details
                  density="compact"
                />
              </div>

              <!-- Imagem -->
              <div>
                <div class="text-subtitle-2 font-weight-medium mb-4">Imagem do grupo</div>
                <div class="d-flex gap-3 align-start flex-wrap">
                  <!-- Preview -->
                  <v-avatar
                    v-if="editImagePreview || editImageUrl"
                    size="120"
                    rounded="lg"
                    class="flex-shrink-0"
                  >
                    <v-img :src="editImagePreview || editImageUrl" cover />
                  </v-avatar>
                  <v-avatar v-else size="120" color="green-darken-3" rounded="lg" class="flex-shrink-0">
                    <v-icon icon="mdi-account-group" color="white" size="40" />
                  </v-avatar>

                  <div class="d-flex flex-column gap-2 flex-grow-1">
                    <v-text-field
                      v-model="editImageUrl"
                      label="URL da imagem"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      :disabled="!!editImageFile"
                      clearable
                      @click:clear="editImageUrl = ''"
                    />
                    <div class="text-caption text-medium-emphasis text-center">— ou —</div>
                    <v-file-input
                      v-model="editImageFile"
                      label="Fazer upload"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      hide-details
                      accept="image/*"
                      prepend-icon=""
                      prepend-inner-icon="mdi-upload"
                      clearable
                      @update:model-value="onEditFileChange"
                    />
                  </div>
                </div>
              </div>

              <!-- Salvar -->
              <div class="d-flex justify-end mt-2">
                <v-btn
                  color="green-darken-3"
                  variant="tonal"
                  rounded="lg"
                  :loading="saving"
                  :disabled="!editName?.trim() || !hasChanges"
                  prepend-icon="mdi-content-save"
                  @click="handleSave"
                >
                  Salvar alterações
                </v-btn>
              </div>

              <!-- Excluir grupo -->
              <v-divider class="mt-4 mb-2" />
              <div class="d-flex justify-end">
                <v-btn
                  color="red"
                  variant="tonal"
                  prepend-icon="mdi-delete-outline"
                  rounded="lg"
                  @click="deleteDialog = true"
                >
                  Excluir grupo
                </v-btn>
              </div>

            </div>
          </v-card>
          </div>
        </v-window-item>
      </v-window>
    </template>

    <!-- Modal detalhes mobile -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card v-if="selectedEntry" rounded="lg">
        <v-card-title class="d-flex align-center gap-2 pt-4 px-4">
          <v-chip
            :color="selectedIdx === 0 ? 'amber' : selectedIdx === 1 ? 'grey-lighten-1' : selectedIdx === 2 ? 'brown-lighten-2' : 'default'"
            :variant="selectedIdx < 3 ? 'elevated' : 'text'"
            size="small"
          >
            {{ selectedIdx + 1 }}
          </v-chip>
          <span class="font-weight-bold ml-2">{{ selectedEntry.profiles?.name ?? '—' }}</span>
          <v-chip v-if="selectedEntry.user_id === auth.user?.id" size="x-small" color="green" class="ml-1">Você</v-chip>
        </v-card-title>
        <v-divider class="mt-2" />
        <v-card-text class="px-4 pt-3 pb-2">
          <v-list density="compact" class="pa-0">
            <v-list-item class="px-0">
              <template #title><span class="text-body-2 text-medium-emphasis">Pontos</span></template>
              <template #append><span class="font-weight-bold text-green-darken-3">{{ selectedEntry.total_points }}</span></template>
            </v-list-item>
            <v-divider />
            <v-list-item class="px-0">
              <template #title><span class="text-body-2 text-medium-emphasis">Placares exatos</span></template>
              <template #append><span class="font-weight-medium">{{ selectedEntry.exact_hits }}</span></template>
            </v-list-item>
            <v-divider />
            <v-list-item class="px-0">
              <template #title><span class="text-body-2 text-medium-emphasis">Vencedor</span></template>
              <template #append><span class="font-weight-medium">{{ selectedEntry.winner_hits }}</span></template>
            </v-list-item>
            <v-divider />
            <v-list-item class="px-0">
              <template #title><span class="text-body-2 text-medium-emphasis">Empates</span></template>
              <template #append><span class="font-weight-medium">{{ selectedEntry.draw_hits }}</span></template>
            </v-list-item>
            <v-divider />
            <v-list-item class="px-0">
              <template #title><span class="text-body-2 text-medium-emphasis">Palpites</span></template>
              <template #append><span class="font-weight-medium">{{ selectedEntry.total_bets }}</span></template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn color="green-darken-3" variant="tonal" rounded="lg" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog confirmar remoção de membro -->
    <v-dialog v-model="removeDialog" max-width="400" persistent>
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Remover membro?</v-card-title>
        <v-card-text class="px-4">
          <p class="mb-3 text-body-2 text-medium-emphasis">
            Para confirmar, digite <strong>{{ memberToRemove?.profiles?.name }}</strong> abaixo:
          </p>
          <v-text-field
            v-model="removeConfirmText"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            :placeholder="memberToRemove?.profiles?.name"
          />
        </v-card-text>
        <v-card-actions class="px-4 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="removeDialog = false; removeConfirmText = ''">Cancelar</v-btn>
          <v-btn
            color="red"
            variant="tonal"
            rounded="lg"
            :disabled="removeConfirmText !== memberToRemove?.profiles?.name"
            :loading="removingId === memberToRemove?.user_id"
            @click="confirmRemove"
          >
            Remover
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog confirmar rejeição de solicitação -->
    <v-dialog v-model="rejectDialog" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Rejeitar solicitação?</v-card-title>
        <v-card-text class="px-4 pb-2 text-body-2 text-medium-emphasis">
          A solicitação de <strong>{{ requestToReject?.profiles?.name }}</strong> será recusada.
        </v-card-text>
        <v-card-actions class="px-4 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="rejectDialog = false; requestToReject = null">Cancelar</v-btn>
          <v-btn color="red" variant="tonal" rounded="lg" :loading="rejectingRequestId === requestToReject?.id" @click="confirmRejectRequest">Rejeitar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog confirmar exclusão do grupo -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Excluir grupo?</v-card-title>
        <v-card-text class="px-4 pb-2 text-body-2 text-medium-emphasis">
          Todos os membros serão removidos e o grupo não poderá ser recuperado.
        </v-card-text>
        <v-card-actions class="px-4 pb-4 gap-2">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" variant="tonal" rounded="lg" :loading="deleting" @click="handleDelete">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: sair do grupo -->
    <v-dialog v-model="leaveDialog" max-width="420" persistent>
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Sair do grupo?</v-card-title>
        <v-card-text class="px-4">
          <p class="mb-3">Para confirmar, digite <strong>SAIR DO GRUPO</strong> abaixo:</p>
          <v-text-field
            v-model="leaveConfirmText"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            placeholder="SAIR DO GRUPO"
            style="text-transform: uppercase"
            @input="leaveConfirmText = leaveConfirmText.toUpperCase()"
          />
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="leaveDialog = false; leaveConfirmText = ''">Cancelar</v-btn>
          <v-btn
            color="red-darken-2"
            variant="tonal"
            rounded="lg"
            :disabled="leaveConfirmText !== 'SAIR DO GRUPO'"
            :loading="leaving"
            @click="confirmLeave"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: comprar vagas -->
    <v-dialog v-model="buySlotDialog" max-width="420">
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Comprar vagas</v-card-title>
        <v-card-subtitle class="px-4 pb-2">
          Saldo atual:
          <strong class="text-green-darken-3">
            <v-icon icon="mdi-seal" size="14" color="green-darken-3" />
            {{ auth.profile?.total_seals ?? 0 }} selos
          </strong>
        </v-card-subtitle>

        <v-card-text class="px-4 pb-2">
          <v-row dense>
            <v-col cols="6">
              <v-card
                rounded="lg"
                :elevation="(auth.profile?.total_seals ?? 0) >= 50 ? 2 : 0"
                :style="(auth.profile?.total_seals ?? 0) < 50 ? 'opacity:0.4;' : 'cursor:pointer;'"
                :disabled="(auth.profile?.total_seals ?? 0) < 50 || !!purchasingPkg"
                class="pa-4 d-flex flex-column align-center text-center"
                style="min-height: 130px;"
                @click="confirmBuyPkg = 'slots_plus_5'; confirmBuyDialog = true"
              >
                <v-avatar color="green-lighten-4" size="52" class="mb-3">
                  <v-icon icon="mdi-account-multiple-plus" color="green-darken-2" size="26" />
                </v-avatar>
                <div class="font-weight-bold text-body-1">+5 vagas</div>
                <div class="text-caption text-medium-emphasis d-flex align-center justify-center gap-1 mt-1">
                  <v-icon icon="mdi-seal" size="13" color="green-darken-3" />
                  50 selos
                </div>
                <div v-if="(auth.profile?.total_seals ?? 0) < 50" class="text-caption text-red-darken-2 mt-1">Saldo insuficiente</div>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card
                rounded="lg"
                :elevation="(auth.profile?.total_seals ?? 0) >= 90 ? 2 : 0"
                :style="(auth.profile?.total_seals ?? 0) < 90 ? 'opacity:0.4;' : 'cursor:pointer;'"
                :disabled="(auth.profile?.total_seals ?? 0) < 90 || !!purchasingPkg"
                class="pa-4 d-flex flex-column align-center text-center"
                style="min-height: 130px;"
                @click="confirmBuyPkg = 'slots_plus_10'; confirmBuyDialog = true"
              >
                <v-avatar color="green-lighten-4" size="52" class="mb-3">
                  <v-icon icon="mdi-account-group" color="green-darken-2" size="26" />
                </v-avatar>
                <div class="font-weight-bold text-body-1">+10 vagas</div>
                <div class="text-caption text-medium-emphasis d-flex align-center justify-center gap-1 mt-1">
                  <v-icon icon="mdi-seal" size="13" color="green-darken-3" />
                  90 selos
                </div>
                <div v-if="(auth.profile?.total_seals ?? 0) < 90" class="text-caption text-red-darken-2 mt-1">Saldo insuficiente</div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="buySlotDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: confirmar compra de vagas -->
    <v-dialog v-model="confirmBuyDialog" max-width="360" persistent>
      <v-card rounded="lg">
        <v-card-title class="pt-4 px-4 font-weight-bold">Confirmar compra</v-card-title>
        <v-card-text class="px-4">
          <p>Você está prestes a comprar
            <strong>{{ confirmBuyPkg === 'slots_plus_5' ? '+5 vagas' : '+10 vagas' }}</strong>
            por
            <strong class="text-green-darken-3">
              <v-icon icon="mdi-seal" size="14" color="green-darken-3" />
              {{ confirmBuyPkg === 'slots_plus_5' ? '50' : '90' }} selos
            </strong>.
          </p>
          <p class="mt-2 text-medium-emphasis text-body-2">
            Saldo após a compra:
            <strong>{{ (auth.profile?.total_seals ?? 0) - (confirmBuyPkg === 'slots_plus_5' ? 50 : 90) }} selos</strong>
          </p>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn variant="text" :disabled="!!purchasingPkg" @click="confirmBuyDialog = false">Cancelar</v-btn>
          <v-spacer />
          <v-btn
            color="green-darken-3"
            variant="tonal"
            rounded="lg"
            :loading="!!purchasingPkg"
            @click="confirmPurchase"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useGroupsStore } from '@/stores/groups'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const groups = useGroupsStore()
const auth = useAuthStore()
const toast = useToastStore()

const group = ref(null)
const loading = ref(false)
const rankingLoading = ref(false)
const membersLoading = ref(false)
const tab = ref(route.name === 'MeusGrupoDetail' ? 'membros' : 'ranking')

const inviteUsername = ref('')
const inviteInputRef = ref(null)
const inviting = ref(false)
const removingId = ref(null)
const removeDialog = ref(false)
const memberToRemove = ref(null)
const removeConfirmText = ref('')

const leaveDialog = ref(false)
const leaveConfirmText = ref('')
const leaving = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)

const dialog = ref(false)
const selectedEntry = ref(null)
const selectedIdx = ref(null)

const editName = ref('')
const editDescription = ref('')
const editIsPublic = ref(false)
const editImageUrl = ref('')
const editImageFile = ref(null)
const editImagePreview = ref('')
const saving = ref(false)

const isOwner = computed(() => group.value?.owner_id === auth.user?.id)

// Solicitações de entrada (pending sem invited_by) — só o dono vê
const joinRequests = computed(() =>
  (groups.groupMembers || []).filter(m => m.status === 'pending' && !m.invited_by)
)
// Membros ativos + convites pendentes (com invited_by) — exibidos nos cards
const activeAndInvitedMembers = computed(() =>
  (groups.groupMembers || []).filter(m => m.status === 'active' || (m.status === 'pending' && m.invited_by))
)

const acceptingRequestId = ref(null)
const rejectingRequestId = ref(null)
const rejectDialog = ref(false)
const requestToReject = ref(null)

const hasChanges = computed(() => {
  if (!group.value) return false
  return (
    editName.value.trim() !== (group.value.name ?? '') ||
    editDescription.value.trim() !== (group.value.description ?? '') ||
    editIsPublic.value !== group.value.is_public ||
    editImageFile.value !== null ||
    (editImageUrl.value || '') !== (group.value.image_url ?? '')
  )
})
const isMember = computed(() =>
  isOwner.value ||
  (groups.groupMembers || []).some(m => m.user_id === auth.user?.id && m.status === 'active')
)
const backRoute = computed(() =>
  route.name === 'MeusGrupoDetail' ? { name: 'MeusGruposOwner' } : { name: 'MeusGrupos' }
)

const purchasingPkg = ref(null)
const buySlotDialog = ref(false)
const confirmBuyDialog = ref(false)
const confirmBuyPkg = ref(null)

const usedSlots = computed(() =>
  (groups.groupMembers || []).filter(
    m => m.status === 'active' || (m.status === 'pending' && m.invited_by)
  ).length
)
const maxSlots = computed(() => group.value?.max_slots ?? 5)
const availableSlots = computed(() => Math.max(0, maxSlots.value - usedSlots.value))
const slotsColor = computed(() => {
  if (availableSlots.value === 0) return 'red-darken-2'
  if (availableSlots.value <= 2)  return 'orange-darken-2'
  return 'green-darken-3'
})

watch(tab, (val) => {
  if (val === 'gerenciar' && group.value) {
    editName.value = group.value.name
    editDescription.value = group.value.description || ''
    editIsPublic.value = group.value.is_public
    editImageUrl.value = group.value.image_url || ''
    editImageFile.value = null
    editImagePreview.value = ''
  }
})

function onEditFileChange(file) {
  if (!file) { editImagePreview.value = ''; return }
  const reader = new FileReader()
  reader.onload = e => { editImagePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

async function handleSave() {
  saving.value = true
  try {
    let imageUrl = editImageUrl.value
    if (editImageFile.value) {
      imageUrl = await groups.uploadGroupImage(editImageFile.value)
    }
    const updated = await groups.updateGroup(route.params.id, {
      name: editName.value.trim(),
      description: editDescription.value.trim(),
      is_public: editIsPublic.value,
      image_url: imageUrl || null,
    })
    group.value = updated
    toast.notify('Grupo atualizado!', 'success')
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    saving.value = false
  }
}

function openModal(entry, idx) {
  selectedEntry.value = entry
  selectedIdx.value = idx
  dialog.value = true
}

async function load() {
  loading.value = true
  try {
    group.value = await groups.fetchGroup(route.params.id)
    await Promise.all([
      loadRanking(),
      loadMembers(),
    ])
  } catch (e) {
    toast.notify('Grupo não encontrado.', 'error')
    router.push(backRoute.value)
  } finally {
    loading.value = false
  }
}

async function loadRanking() {
  rankingLoading.value = true
  try {
    await groups.fetchGroupRanking(route.params.id)
  } finally {
    rankingLoading.value = false
  }
}

async function loadMembers() {
  membersLoading.value = true
  try {
    await groups.fetchGroupMembers(route.params.id)
  } finally {
    membersLoading.value = false
  }
}

function focusInviteInput() {
  inviteInputRef.value?.focus()
  inviteInputRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function handleInvite() {
  if (!inviteUsername.value?.trim()) return
  inviting.value = true
  try {
    const profile = await groups.inviteByUsername(route.params.id, inviteUsername.value.trim())
    inviteUsername.value = ''
    toast.notify(`Convite enviado para ${profile.name}!`, 'success')
    await loadMembers()
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    inviting.value = false
  }
}

async function handlePurchaseSlots(pkg) {
  purchasingPkg.value = pkg
  try {
    const labels = { slots_plus_5: '+5 vagas', slots_plus_10: '+10 vagas' }
    const newMax = await groups.purchaseSlots(route.params.id, pkg)
    group.value = { ...group.value, max_slots: newMax }
    toast.notify(`${labels[pkg]} adicionadas ao grupo!`, 'success')
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    purchasingPkg.value = null
  }
}

async function confirmPurchase() {
  if (!confirmBuyPkg.value) return
  await handlePurchaseSlots(confirmBuyPkg.value)
  confirmBuyDialog.value = false
  buySlotDialog.value = false
  confirmBuyPkg.value = null
}

function openRemoveDialog(member) {
  memberToRemove.value = member
  removeConfirmText.value = ''
  removeDialog.value = true
}

async function confirmRemove() {
  const member = memberToRemove.value
  removingId.value = member.user_id
  try {
    await groups.removeFromGroup(route.params.id, member.user_id)
    toast.notify('Membro removido.', 'success')
    removeDialog.value = false
    removeConfirmText.value = ''
    memberToRemove.value = null
    await loadMembers()
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    removingId.value = null
  }
}

async function handleRemove(userId) {
  removingId.value = userId
  try {
    await groups.removeFromGroup(route.params.id, userId)
    toast.notify('Membro removido.', 'success')
    await loadRanking()
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    removingId.value = null
  }
}

async function handleAcceptRequest(memberId) {
  acceptingRequestId.value = memberId
  try {
    await groups.acceptJoinRequest(memberId)
    toast.notify('Solicitação aceita! O usuário agora é membro do grupo.', 'success')
    await loadMembers()
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    acceptingRequestId.value = null
  }
}

function handleRejectRequest(req) {
  requestToReject.value = req
  rejectDialog.value = true
}

async function confirmRejectRequest() {
  const req = requestToReject.value
  if (!req) return
  rejectingRequestId.value = req.id
  try {
    await groups.rejectJoinRequest(req.id)
    toast.notify('Solicitação rejeitada.', 'success')
    rejectDialog.value = false
    requestToReject.value = null
    await loadMembers()
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    rejectingRequestId.value = null
  }
}

async function handleDelete() {
  deleting.value = true
  try {
    await groups.deleteGroup(route.params.id)
    toast.notify('Grupo excluído.', 'success')
    router.push(backRoute.value)
  } catch (e) {
    toast.notify(e.message, 'error')
    deleting.value = false
    deleteDialog.value = false
  }
}

async function confirmLeave() {
  leaving.value = true
  try {
    await groups.leaveGroup(group.value.id)
    toast.notify('Você saiu do grupo.', 'success')
    router.push(backRoute.value)
  } catch (e) {
    toast.notify(e.message, 'error')
  } finally {
    leaving.value = false
    leaveDialog.value = false
    leaveConfirmText.value = ''
  }
}

onMounted(load)
</script>
