<script setup lang="ts">
import type { Party } from '../types/party'
import { usePartyFormatting } from '../composables/use-party-formatting'

const props = defineProps<{ party: Party }>()

const { displayDate } = usePartyFormatting()
const dateLabel = computed(() => (props.party.date ? displayDate(props.party.date) : ''))
</script>

<template>
  <NuxtLink
    :to="`/parties/${party.id}`"
    class="row"
    data-testid="party-row"
  >
    <span
      aria-hidden="true"
      class="row__badge"
    >🎉</span>
    <span class="row__body">
      <span class="row__name">{{ party.name }}</span>
      <span
        v-if="dateLabel"
        class="row__date"
      >{{ dateLabel }}</span>
      <span
        v-if="party.location"
        class="row__location"
      >{{ party.location }}</span>
    </span>
    <span
      aria-hidden="true"
      class="row__chevron"
    >›</span>
  </NuxtLink>
</template>

<style scoped>
.row {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  color: var(--color-text);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.row:hover {
  border-color: var(--color-primary);
}

.row:active {
  transform: scale(0.99);
}

.row__badge {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  font-size: var(--font-size-lg);
  background-color: var(--surface-sunken);
  border-radius: var(--radius-md);
}

.row__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.row__name {
  overflow: hidden;
  font-weight: var(--font-weight-semibold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row__date {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-text);
}

.row__location {
  overflow: hidden;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row__chevron {
  flex-shrink: 0;
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
}
</style>
