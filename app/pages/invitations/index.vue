<script setup lang="ts">
import PartyListItem from '~/features/parties/components/PartyListItem.vue'
import { useParties } from '~/features/parties/composables/use-parties'
import { useExportImport } from '~/features/parties/composables/use-export-import'
import { partitionParties } from '~/features/parties/services/partition-parties'
import { readClipboard } from '~/shared/clipboard/read-clipboard'

const { t } = useI18n()
const store = useParties()
const { importParties } = useExportImport()

// Carries the clipboard text to the paste page so one tap goes straight to the
// pre-filled form.
const pasteSource = useState<string>('paste-source', () => '')

async function goPaste(): Promise<void> {
  pasteSource.value = await readClipboard()
  await navigateTo('/invitations/paste')
}

function onPaste(): void {
  void goPaste()
}

const today = todayIso()
const received = computed(() => {
  const groups = partitionParties(store.parties.filter(party => party.received), today)
  return [...groups.upcoming, ...groups.past]
})
const isEmpty = computed(() => store.loaded && received.value.length === 0)
const notice = ref('')

async function runImport(file: File): Promise<void> {
  const result = await importParties(file, { received: true })
  notice.value = result.ok
    ? t('invitations.imported', { count: result.imported })
    : t('importExport.invalid')
}

function onImport(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) void runImport(file)
  input.value = ''
}
</script>

<template>
  <div class="screen">
    <main class="page">
      <h1 class="title">
        {{ t('invitations.title') }}
      </h1>

      <div class="actions">
        <button
          type="button"
          class="action action--primary"
          data-testid="invite-paste"
          @click="onPaste"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="action__icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            />
          </svg>
          {{ t('invitations.paste.action') }}
        </button>

        <label class="action">
          <input
            type="file"
            accept="application/json,.json"
            class="action__input"
            data-testid="invite-import"
            @change="onImport"
          >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="action__icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 15V3m0 12-4-4m4 4 4-4M5 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"
            />
          </svg>
          {{ t('invitations.import') }}
        </label>
      </div>

      <p
        v-if="notice"
        class="notice"
        role="status"
        data-testid="invite-notice"
      >
        {{ notice }}
      </p>

      <p
        v-if="isEmpty"
        class="none"
        data-testid="invite-none"
      >
        {{ t('invitations.none') }}
      </p>

      <ul
        v-else
        class="list"
      >
        <li
          v-for="party in received"
          :key="party.id"
        >
          <PartyListItem :party="party" />
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.action {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-text);
  cursor: pointer;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
}

.action--primary {
  color: var(--color-primary-contrast);
  background-color: var(--color-primary);
  border-color: transparent;
}

.action__icon {
  width: 1.05rem;
  height: 1.05rem;
}

.action__input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: 0;
  list-style: none;
}

.none {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}

.notice {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
