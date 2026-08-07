<script setup lang="ts">
import PartyListItem from '~/features/parties/components/PartyListItem.vue'
import { useParties } from '~/features/parties/composables/use-parties'
import { useExportImport } from '~/features/parties/composables/use-export-import'
import { partitionParties } from '~/features/parties/services/partition-parties'

const { t } = useI18n()
const store = useParties()
const { importParties } = useExportImport()

const today = new Date().toISOString().slice(0, 10)
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
        <BaseButton
          to="/parties/create?received=1"
          data-testid="invite-add"
        >
          {{ t('invitations.add') }}
        </BaseButton>
        <label class="upload">
          <input
            type="file"
            accept="application/json,.json"
            class="upload__input"
            data-testid="invite-import"
            @change="onImport"
          >
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

.upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-text);
  cursor: pointer;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
}

.upload__input {
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
