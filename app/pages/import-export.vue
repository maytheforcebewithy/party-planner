<script setup lang="ts">
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { useExportImport } from '~/features/parties/composables/use-export-import'

const { t } = useI18n()
const store = usePartiesStore()
const { exportParties, importParties } = useExportImport()

const notice = ref('')

onMounted(() => {
  void store.ensureLoaded()
})

async function runExport(): Promise<void> {
  notice.value = t('importExport.exported', { count: await exportParties() })
}

function onExport(): void {
  void runExport()
}

async function runImport(file: File): Promise<void> {
  const result = await importParties(file)
  notice.value = result.ok
    ? t('importExport.imported', { count: result.imported })
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
        {{ t('importExport.title') }}
      </h1>

      <BaseCard :title="t('importExport.export.title')">
        <p class="card__text">
          {{ t('importExport.export.text') }}
        </p>
        <BaseButton
          block
          :disabled="store.partyCount === 0"
          data-testid="export"
          @click="onExport"
        >
          {{ t('importExport.export.action', { count: store.partyCount }) }}
        </BaseButton>
      </BaseCard>

      <BaseCard :title="t('importExport.import.title')">
        <p class="card__text">
          {{ t('importExport.import.text') }}
        </p>
        <label class="upload">
          <input
            type="file"
            accept="application/json,.json"
            class="visually-hidden"
            :aria-label="t('importExport.import.action')"
            data-testid="import-input"
            @change="onImport"
          >
          {{ t('importExport.import.action') }}
        </label>
      </BaseCard>

      <p
        v-if="notice"
        class="notice"
        role="status"
        data-testid="ie-notice"
      >
        {{ notice }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.upload {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-text);
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-pill);
}
</style>
