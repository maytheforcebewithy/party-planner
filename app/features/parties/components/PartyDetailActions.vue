<script setup lang="ts">
import InvitationImageCard from './InvitationImageCard.vue'
import { usePartiesStore } from '../stores/parties-store'
import { useShareInvitation } from '../composables/use-share-invitation'
import { useShareInvitationImage } from '../composables/use-share-invitation-image'
import { useExportImport } from '../composables/use-export-import'
import { useCalendarExport } from '../composables/use-calendar-export'
import { useReminders } from '../composables/use-reminders'
import type { Party } from '../types/party'
import { shareNoticeKey } from '~/shared/sharing/share-text'

const props = defineProps<{ party: Party }>()

const { t } = useI18n()
const store = usePartiesStore()
const { shareInvitation } = useShareInvitation()
const { shareInvitationImage, generating: generatingImage } = useShareInvitationImage()
const { exportParty } = useExportImport()
const { exportToCalendar } = useCalendarExport()
const reminders = useReminders()

const confirming = ref(false)
const confirmPanel = ref<HTMLElement | null>(null)
const inviteCapture = ref<HTMLElement | null>(null)
const shareNotice = ref('')

const hasReminder = computed(() => reminders.has(props.party.id))

async function runShare(): Promise<void> {
  const key = shareNoticeKey(await shareInvitation(props.party))
  shareNotice.value = key ? t(key) : ''
}

function onShare(): void {
  void runShare()
}

function onShareImage(): void {
  if (inviteCapture.value) void shareInvitationImage(inviteCapture.value, props.party)
}

function onExport(): void {
  void exportParty(props.party)
}

function onAddToCalendar(): void {
  void exportToCalendar(props.party)
}

function onToggleReminder(): void {
  void reminders.toggle(props.party)
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

async function runDelete(): Promise<void> {
  await reminders.disable(props.party)
  await store.remove(props.party.id)
  await navigateTo('/')
}

function onDelete(): void {
  void runDelete()
}
</script>

<template>
  <div class="actions">
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
          class="actions__share-icon"
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
        class="actions__share-notice"
        role="status"
        data-testid="share-notice"
      >
        {{ shareNotice }}
      </p>

      <BaseButton
        variant="ghost"
        block
        :disabled="generatingImage"
        data-testid="share-image"
        @click="onShareImage"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="actions__share-icon"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 12 5-5 4 4 3-3 5 5"
          />
        </svg>
        {{ generatingImage ? $t('share.imagePending') : $t('share.shareImage') }}
      </BaseButton>

      <!-- Off-screen source node for the PNG render; kept in layout so
           html-to-image can measure it (display:none would break capture).
           Forced to the light theme so the shared image looks consistent and
           bright regardless of the app's current light/dark setting. -->
      <div
        ref="inviteCapture"
        class="actions__capture"
        data-theme="light"
        aria-hidden="true"
      >
        <InvitationImageCard :party="party" />
      </div>
    </template>

    <div class="actions__tools">
      <button
        v-if="party.date"
        type="button"
        class="actions__tool"
        :class="{ 'actions__tool--active': hasReminder }"
        :aria-pressed="hasReminder"
        :title="hasReminder ? $t('reminder.on') : $t('reminder.off')"
        data-testid="reminder-toggle"
        @click="onToggleReminder"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="actions__tool-icon"
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
        <span class="actions__tool-label">{{ $t('reminder.label') }}</span>
      </button>

      <button
        v-if="party.date"
        type="button"
        class="actions__tool"
        :title="$t('detail.addToCalendar')"
        data-testid="add-to-calendar"
        @click="onAddToCalendar"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="actions__tool-icon"
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
        <span class="actions__tool-label">{{ $t('detail.calendar') }}</span>
      </button>

      <button
        type="button"
        class="actions__tool"
        :title="$t('detail.export')"
        data-testid="export-party"
        @click="onExport"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="actions__tool-icon"
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
        <span class="actions__tool-label">{{ $t('detail.exportShort') }}</span>
      </button>
    </div>

    <button
      v-if="!confirming"
      type="button"
      class="actions__delete"
      data-testid="delete"
      @click="onConfirm"
    >
      {{ $t('detail.delete') }}
    </button>

    <div
      v-if="confirming"
      ref="confirmPanel"
      class="actions__confirm"
      data-testid="delete-confirm-panel"
    >
      <p class="actions__confirm-text">
        {{ $t('detail.deleteConfirm') }}
      </p>
      <div class="actions__confirm-buttons">
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
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.actions__share-icon {
  width: 1.2rem;
  height: 1.2rem;
}

/* Rendered but parked off-screen: it is only a source for the PNG capture. */
.actions__capture {
  position: fixed;
  top: 0;
  left: -9999px;
  pointer-events: none;
}

/* Reminder / calendar / export as one compact icon-and-label toolbar. */
.actions__tools {
  display: flex;
  gap: var(--space-2);
}

.actions__tool {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--color-text);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.actions__tool:hover {
  background-color: var(--surface-sunken);
}

.actions__tool--active {
  color: var(--color-primary-text);
}

.actions__tool-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.actions__tool-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.actions__tool--active .actions__tool-label {
  color: var(--color-primary-text);
}

/* Destructive action stays quiet at the very bottom. */
.actions__delete {
  align-self: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-danger);
  cursor: pointer;
  background-color: transparent;
  border: none;
}

.actions__delete:hover {
  text-decoration: underline;
}

.actions__share-notice {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.actions__confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.actions__confirm-buttons {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
</style>
