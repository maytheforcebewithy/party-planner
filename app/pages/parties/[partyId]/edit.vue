<script setup lang="ts">
import PartyForm from '~/features/parties/components/PartyForm.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { useReminders } from '~/features/parties/composables/use-reminders'
import type { UpdateParty } from '~/features/parties/types/party'

definePageMeta({ layout: 'modal' })

const route = useRoute()
const store = usePartiesStore()
const reminders = useReminders()

const partyId = computed(() => String(route.params.partyId))
const party = computed(() => store.findById(partyId.value))

onMounted(() => {
  void store.ensureLoaded()
})

async function save(data: UpdateParty): Promise<void> {
  const updated = await store.update(partyId.value, data)
  // Keep an active reminder in sync with an edited date/time: re-schedule it, or
  // drop it if the date was removed (enable() bails when there's no future date).
  if (reminders.has(updated.id)) {
    await reminders.disable(updated)
    await reminders.enable(updated)
  }
  await navigateTo(`/parties/${partyId.value}`)
}

function onSubmit(data: UpdateParty): void {
  void save(data)
}

function onCancel(): void {
  void navigateTo(`/parties/${partyId.value}`)
}
</script>

<template>
  <div class="screen">
    <AppBar
      :title="$t('edit.title')"
      :back-to="`/parties/${partyId}`"
    />

    <main class="page">
      <PartyForm
        v-if="party"
        :submit-label="$t('edit.submit')"
        :initial="party"
        @submit="onSubmit"
        @cancel="onCancel"
      />
      <p
        v-else-if="store.loaded"
        class="missing"
        data-testid="not-found"
      >
        {{ $t('edit.notFound') }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.missing {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
