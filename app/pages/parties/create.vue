<script setup lang="ts">
import PartyForm from '~/features/parties/components/PartyForm.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import type { CreateParty } from '~/features/parties/types/party'

definePageMeta({ layout: 'modal' })

const route = useRoute()
const store = usePartiesStore()

// Reached from the Invitations tab (?received=1) to add a received invitation
// rather than an own party.
const received = computed(() => route.query.received === '1')
const backTo = computed(() => (received.value ? '/invitations' : '/'))
const title = computed(() => (received.value ? 'invitations.add' : 'create.title'))
const submit = computed(() => (received.value ? 'invitations.addSubmit' : 'create.submit'))

async function create(data: CreateParty): Promise<void> {
  const party = await store.create({ ...data, received: received.value })
  await navigateTo(`/parties/${party.id}`)
}

function onSubmit(data: CreateParty): void {
  void create(data)
}

function onCancel(): void {
  void navigateTo(backTo.value)
}
</script>

<template>
  <div class="screen">
    <AppBar
      :title="$t(title)"
      :back-to="backTo"
    />

    <main class="page">
      <PartyForm
        :submit-label="$t(submit)"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </main>
  </div>
</template>
