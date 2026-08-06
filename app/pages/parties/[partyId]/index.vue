<script setup lang="ts">
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { usePartyFormatting } from '~/features/parties/composables/use-party-formatting'

const route = useRoute()
const store = usePartiesStore()
const { displayDate } = usePartyFormatting()

const partyId = computed(() => String(route.params.partyId))
const party = computed(() => store.findById(partyId.value))
const confirming = ref(false)

onMounted(() => {
  void store.ensureLoaded()
})

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
    <AppBar
      :title="party ? party.name : $t('app.title')"
      back-to="/"
    />

    <main class="page">
      <article
        v-if="party"
        class="detail"
      >
        <p class="detail__date">
          <span aria-hidden="true">📅</span> {{ displayDate(party.date) }}
        </p>
        <p
          v-if="party.location"
          class="detail__meta"
        >
          <span aria-hidden="true">📍</span> {{ party.location }}
        </p>

        <section
          v-if="party.description"
          class="detail__notes"
        >
          <h2 class="detail__notes-title">
            {{ $t('detail.notes') }}
          </h2>
          <p class="detail__notes-body">
            {{ party.description }}
          </p>
        </section>

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
            @click="confirming = true"
          >
            {{ $t('detail.delete') }}
          </BaseButton>
        </div>

        <div
          v-if="confirming"
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

.detail__date {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.detail__meta {
  color: var(--color-text-muted);
}

.detail__notes {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--surface-sunken);
  border-radius: var(--radius-md);
}

.detail__notes-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.detail__notes-body {
  white-space: pre-wrap;
}

.detail__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
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
