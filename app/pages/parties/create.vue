<script setup lang="ts">
import PartyForm from '~/features/parties/components/PartyForm.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import type { CreateParty } from '~/features/parties/types/party'

definePageMeta({ layout: 'modal' })

const store = usePartiesStore()

async function create(data: CreateParty): Promise<void> {
  const party = await store.create(data)
  await navigateTo(`/parties/${party.id}`)
}

function onSubmit(data: CreateParty): void {
  void create(data)
}

function onCancel(): void {
  void navigateTo('/')
}
</script>

<template>
  <div class="screen">
    <AppBar
      :title="$t('create.title')"
      back-to="/"
    />

    <main class="page">
      <PartyForm
        :submit-label="$t('create.submit')"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </main>
  </div>
</template>
