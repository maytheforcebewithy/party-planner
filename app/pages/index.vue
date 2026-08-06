<script setup lang="ts">
import PartyListItem from '~/features/parties/components/PartyListItem.vue'
import { useParties } from '~/features/parties/composables/use-parties'

const store = useParties()
</script>

<template>
  <div class="screen">
    <AppBar :title="$t('list.title')">
      <template #action>
        <NuxtLink
          to="/parties/create"
          :aria-label="$t('list.new')"
          class="add"
          data-testid="new-party"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="add__icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              d="M12 5v14M5 12h14"
            />
          </svg>
        </NuxtLink>
      </template>
    </AppBar>

    <main class="page">
      <BaseEmptyState
        v-if="store.loaded && store.partyCount === 0"
        :title="$t('list.empty.title')"
        :hint="$t('list.empty.hint')"
      >
        <template #action>
          <BaseButton
            to="/parties/create"
            data-testid="empty-cta"
          >
            {{ $t('list.empty.cta') }}
          </BaseButton>
        </template>
      </BaseEmptyState>

      <ul
        v-else
        class="list"
      >
        <li
          v-for="party in store.parties"
          :key="party.id"
        >
          <PartyListItem :party="party" />
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.add {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-primary-contrast);
  background-color: var(--color-primary);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
}

.add__icon {
  width: 1.5rem;
  height: 1.5rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
}
</style>
