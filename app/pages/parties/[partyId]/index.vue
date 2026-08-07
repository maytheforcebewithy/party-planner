<script setup lang="ts">
import PartyHero from '~/features/parties/components/PartyHero.vue'
import PartyInfoCard from '~/features/parties/components/PartyInfoCard.vue'
import PartyGuestList from '~/features/parties/components/PartyGuestList.vue'
import PartyShoppingList from '~/features/parties/components/PartyShoppingList.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { usePartyFormatting } from '~/features/parties/composables/use-party-formatting'
import { useShareInvitation } from '~/features/parties/composables/use-share-invitation'
import { useExportImport } from '~/features/parties/composables/use-export-import'
import { linkHost } from '~/features/parties/services/party-link'
import type { Party } from '~/features/parties/types/party'

const route = useRoute()
const store = usePartiesStore()
const { displayDate, displayTime } = usePartyFormatting()
const { shareInvitation } = useShareInvitation()
const { exportParty } = useExportImport()
const { t } = useI18n()

const partyId = computed(() => String(route.params.partyId))
const party = computed(() => store.findById(partyId.value))
const timeLabel = computed(() =>
  party.value ? displayTime(party.value.startTime, party.value.endTime) : null,
)
const linkLabel = computed(() => (party.value?.link ? linkHost(party.value.link) : ''))
const confirming = ref(false)
const confirmPanel = ref<HTMLElement | null>(null)
const shareNotice = ref('')

onMounted(() => {
  void store.ensureLoaded()
})

async function share(target: Party): Promise<void> {
  const result = await shareInvitation(target)
  shareNotice.value = result === 'copied'
    ? t('share.copied')
    : result === 'unavailable'
      ? t('share.unavailable')
      : ''
}

function onShare(): void {
  if (party.value) void share(party.value)
}

function onExport(): void {
  if (party.value) void exportParty(party.value)
}

async function startConfirm(): Promise<void> {
  confirming.value = true
  // Reveal the confirmation, which renders below the fold on longer parties.
  await nextTick()
  confirmPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function onConfirm(): void {
  void startConfirm()
}

async function deleteParty(): Promise<void> {
  await store.remove(partyId.value)
  await navigateTo('/')
}

function onDelete(): void {
  void deleteParty()
}
</script>

<template>
  <div class="screen">
    <AppBar back-to="/" />

    <main class="page">
      <article
        v-if="party"
        class="detail"
      >
        <PartyHero
          :name="party.name"
          :date-label="displayDate(party.date)"
          :time-label="timeLabel"
          :icon="party.icon"
          :color="party.color"
          :image="party.image"
        />

        <div class="detail__cards">
          <PartyInfoCard
            v-if="party.location"
            :label="$t('form.location.label')"
            :value="party.location"
          >
            <template #icon>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
                />
              </svg>
            </template>
          </PartyInfoCard>

          <PartyInfoCard
            v-if="party.description"
            :label="$t('form.description.label')"
            :value="party.description"
          />

          <PartyInfoCard
            v-if="party.hinweise"
            :label="$t('form.hinweise.label')"
            :value="party.hinweise"
          />
        </div>

        <BaseButton
          v-if="party.link"
          :href="party.link"
          variant="ghost"
          block
          data-testid="open-link"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="detail__link-icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"
            />
          </svg>
          {{ $t('detail.openLink', { host: linkLabel }) }}
        </BaseButton>

        <PartyGuestList :party-id="party.id" />
        <PartyShoppingList :party-id="party.id" />

        <BaseButton
          variant="primary"
          block
          data-testid="share"
          @click="onShare"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="detail__share-icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v13M12 3 8 7M12 3l4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"
            />
          </svg>
          {{ $t('share.action') }}
        </BaseButton>

        <p
          v-if="shareNotice"
          class="detail__share-notice"
          role="status"
          data-testid="share-notice"
        >
          {{ shareNotice }}
        </p>

        <BaseButton
          variant="ghost"
          block
          data-testid="export-party"
          @click="onExport"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="detail__share-icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v12m0 0-4-4m4 4 4-4M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"
            />
          </svg>
          {{ $t('detail.export') }}
        </BaseButton>

        <div class="detail__actions">
          <BaseButton
            :to="`/parties/${party.id}/edit`"
            variant="ghost"
            data-testid="edit"
          >
            {{ $t('detail.edit') }}
          </BaseButton>

          <BaseButton
            v-if="!confirming"
            variant="danger"
            data-testid="delete"
            @click="onConfirm"
          >
            {{ $t('detail.delete') }}
          </BaseButton>
        </div>

        <div
          v-if="confirming"
          ref="confirmPanel"
          class="detail__confirm"
          data-testid="delete-confirm-panel"
        >
          <p class="detail__confirm-text">
            {{ $t('detail.deleteConfirm') }}
          </p>
          <div class="detail__confirm-actions">
            <BaseButton
              variant="ghost"
              @click="confirming = false"
            >
              {{ $t('form.cancel') }}
            </BaseButton>
            <BaseButton
              variant="danger"
              data-testid="delete-confirm"
              @click="onDelete"
            >
              {{ $t('detail.delete') }}
            </BaseButton>
          </div>
        </div>
      </article>

      <p
        v-else-if="store.loaded"
        class="detail__missing"
        data-testid="not-found"
      >
        {{ $t('detail.notFound') }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.detail__cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.detail__share-icon,
.detail__link-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.detail__share-notice {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.detail__actions {
  display: flex;
  gap: var(--space-3);
}

.detail__confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.detail__confirm-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.detail__missing {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
