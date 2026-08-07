<script setup lang="ts">
import PartyIconTile from './PartyIconTile.vue'
import type { Party } from '../types/party'
import { usePartyFormatting } from '../composables/use-party-formatting'
import { ATTENDANCE_APPEARANCE } from '../config/attendance-appearance'

const props = defineProps<{ party: Party }>()

const { t } = useI18n()
const { displayDate } = usePartyFormatting()
const dateLabel = computed(() => (props.party.date ? displayDate(props.party.date) : ''))

// Colour feedback for a received invitation you have replied to.
const reply = computed(() => {
  const { received, attendance } = props.party
  if (!received || !attendance) return null
  return { colors: ATTENDANCE_APPEARANCE[attendance], label: t(`attendance.${attendance}`) }
})
</script>

<template>
  <NuxtLink
    :to="`/parties/${party.id}`"
    class="row"
    :style="reply ? { borderColor: reply.colors.color } : undefined"
    data-testid="party-row"
  >
    <PartyIconTile
      :icon="party.icon"
      :color="party.color"
      :image="party.image"
    />
    <span class="row__body">
      <span class="row__name">{{ party.name }}</span>
      <span
        v-if="dateLabel"
        class="row__date"
      >{{ dateLabel }}</span>
      <span
        v-if="party.location"
        class="row__location"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="row__location-icon"
        >
          <path
            fill="currentColor"
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
          />
        </svg>
        <span class="row__location-text">{{ party.location }}</span>
      </span>
      <span
        v-if="reply"
        class="row__reply"
        data-testid="party-row-reply"
        :style="{ backgroundColor: reply.colors.soft, color: reply.colors.color }"
      >{{ reply.label }}</span>
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
  display: flex;
  gap: var(--space-1);
  align-items: center;
  min-width: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.row__location-icon {
  flex-shrink: 0;
  width: 0.9rem;
  height: 0.9rem;
  color: var(--color-primary-text);
}

.row__location-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row__reply {
  align-self: flex-start;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-pill);
}

.row__chevron {
  flex-shrink: 0;
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
}
</style>
