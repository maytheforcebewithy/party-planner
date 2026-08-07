<script setup lang="ts">
import PartyListItem from '~/features/parties/components/PartyListItem.vue'
import { useParties } from '~/features/parties/composables/use-parties'
import { useDemoSeed } from '~/features/parties/composables/use-demo-seed'
import { partitionParties } from '~/features/parties/services/partition-parties'

const { t } = useI18n()
const store = useParties()
const { seedDemo } = useDemoSeed()

function onSeedDemo(): void {
  void seedDemo()
}

const today = new Date().toISOString().slice(0, 10)
const tab = ref('upcoming')

const tabOptions = computed(() => [
  { value: 'upcoming', label: t('list.tabs.upcoming') },
  { value: 'past', label: t('list.tabs.past') },
])

const ownParties = computed(() => store.parties.filter(party => !party.received))
const groups = computed(() => partitionParties(ownParties.value, today))
const visible = computed(() => (tab.value === 'past' ? groups.value.past : groups.value.upcoming))
const isEmpty = computed(() => store.loaded && ownParties.value.length === 0)
const noneMessage = computed(() => (tab.value === 'past' ? t('list.none.past') : t('list.none.upcoming')))
</script>

<template>
  <div class="screen">
    <main class="page page--list">
      <header class="head">
        <div class="head__top">
          <h1 class="head__title">
            {{ $t('list.title') }}
          </h1>
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
        </div>
        <BaseSegmentedControl
          v-model="tab"
          :options="tabOptions"
        />
      </header>

      <BaseEmptyState
        v-if="isEmpty"
        :title="$t('list.empty.title')"
      >
        <template #action>
          <BaseButton
            to="/parties/create"
            data-testid="empty-cta"
          >
            {{ $t('list.empty.cta') }}
          </BaseButton>
          <BaseButton
            variant="ghost"
            data-testid="seed-demo"
            @click="onSeedDemo"
          >
            {{ $t('list.empty.demo') }}
          </BaseButton>
        </template>
      </BaseEmptyState>

      <ul
        v-else-if="visible.length"
        class="list"
      >
        <li
          v-for="party in visible"
          :key="party.id"
        >
          <PartyListItem :party="party" />
        </li>
      </ul>

      <p
        v-else
        class="none"
        data-testid="list-none"
      >
        {{ noneMessage }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.page--list {
  padding-top: calc(var(--safe-area-inset-top) + var(--space-6));
}

.head {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.head__top {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

.head__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.add {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
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
  padding: 0;
  list-style: none;
}

.none {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
