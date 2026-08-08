<script setup lang="ts">
import PartyHero from '~/features/parties/components/PartyHero.vue'
import PartyInfoCard from '~/features/parties/components/PartyInfoCard.vue'
import PartyGuestList from '~/features/parties/components/PartyGuestList.vue'
import PartyShoppingList from '~/features/parties/components/PartyShoppingList.vue'
import PartyAttendance from '~/features/parties/components/PartyAttendance.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { usePartyFormatting } from '~/features/parties/composables/use-party-formatting'
import { useShareInvitation } from '~/features/parties/composables/use-share-invitation'
import { useExportImport } from '~/features/parties/composables/use-export-import'
import { useCalendarExport } from '~/features/parties/composables/use-calendar-export'
import { useReminders } from '~/features/parties/composables/use-reminders'
import { linkHost } from '~/features/parties/services/party-link'
import { shareNoticeKey } from '~/shared/sharing/share-text'
import type { Party } from '~/features/parties/types/party'

const route = useRoute()
const store = usePartiesStore()
const { displayDate, displayTime } = usePartyFormatting()
const { shareInvitation } = useShareInvitation()
const { exportParty } = useExportImport()
const { exportToCalendar } = useCalendarExport()
const reminders = useReminders()
const { t } = useI18n()

const partyId = computed(() => String(route.params.partyId))
const party = computed(() => store.findById(partyId.value))
const timeLabel = computed(() =>
  party.value ? displayTime(party.value.startTime, party.value.endTime) : null,
)
const linkLabel = computed(() => (party.value?.link ? linkHost(party.value.link) : ''))
const hasReminder = computed(() => (party.value ? reminders.has(party.value.id) : false))
// A received invitation was reached from the invitations tab, so send back there.
const backTo = computed(() => (party.value?.received ? '/invitations' : '/'))
const confirming = ref(false)
const confirmPanel = ref<HTMLElement | null>(null)
const shareNotice = ref('')

onMounted(() => {
  void store.ensureLoaded()
})

async function share(target: Party): Promise<void> {
  const key = shareNoticeKey(await shareInvitation(target))
  shareNotice.value = key ? t(key) : ''
}

function onShare(): void {
  if (party.value) void share(party.value)
}

function onExport(): void {
  if (party.value) void exportParty(party.value)
}

function onAddToCalendar(): void {
  if (party.value) void exportToCalendar(party.value)
}

function onToggleReminder(): void {
  if (party.value) void reminders.toggle(party.value)
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
  if (party.value) await reminders.disable(party.value)
  await store.remove(partyId.value)
  await navigateTo('/')
}

function onDelete(): void {
  void deleteParty()
}
</script>

<template>
  <div class="screen">
    <AppBar :back-to="backTo" />

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

        <PartyAttendance
          v-if="party.received"
          :party-id="party.id"
        />
        <PartyGuestList
          v-if="!party.received"
          :party-id="party.id"
        />
        <PartyShoppingList
          :party-id="party.id"
          :received="party.received"
        />

        <template v-if="!party.received">
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
        </template>

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

        <div
          v-if="party.date"
          class="detail__schedule"
        >
          <BaseButton
            :variant="hasReminder ? 'primary' : 'ghost'"
            :aria-pressed="hasReminder"
            :aria-label="hasReminder ? $t('reminder.on') : $t('reminder.off')"
            :title="hasReminder ? $t('reminder.on') : $t('reminder.off')"
            data-testid="reminder-toggle"
            @click="onToggleReminder"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="detail__schedule-icon"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
              />
            </svg>
          </BaseButton>

          <BaseButton
            variant="ghost"
            :aria-label="$t('detail.addToCalendar')"
            :title="$t('detail.addToCalendar')"
            data-testid="add-to-calendar"
            @click="onAddToCalendar"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              class="detail__schedule-icon"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 4v3m10-3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
              />
            </svg>
          </BaseButton>
        </div>

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

/* Reminder + calendar sit side by side as icon-only actions (labels via aria). */
.detail__schedule {
  display: flex;
  gap: var(--space-3);
}

.detail__schedule > * {
  flex: 1;
}

.detail__schedule-icon {
  width: 1.4rem;
  height: 1.4rem;
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
