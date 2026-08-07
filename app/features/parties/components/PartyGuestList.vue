<script setup lang="ts">
import PartyListSection from './PartyListSection.vue'
import PartyListAddRow from './PartyListAddRow.vue'
import PartyListToggle from './PartyListToggle.vue'
import { usePartyLists } from '../composables/use-party-lists'
import { useCollapsibleList } from '../composables/use-collapsible-list'

const props = defineProps<{ partyId: string }>()

const { t } = useI18n()
const { guests, guestStats, addGuest, cycleGuestRsvp, removeGuest } = usePartyLists(() => props.partyId)
const { visible, collapsible, expanded, hiddenCount, toggle } = useCollapsibleList(guests)

const summary = computed(() =>
  guestStats.value.total === 0 ? '' : t('guests.count', guestStats.value),
)

function onAdd(name: string): void {
  void addGuest(name)
}

function onCycle(id: string): void {
  void cycleGuestRsvp(id)
}

function onRemove(id: string): void {
  void removeGuest(id)
}
</script>

<template>
  <PartyListSection
    :title="t('guests.title')"
    :summary="summary"
  >
    <ul
      v-if="guests.length"
      class="items"
    >
      <li
        v-for="guest in visible"
        :key="guest.id"
        class="guest"
      >
        <button
          type="button"
          class="rsvp"
          :class="`rsvp--${guest.rsvp}`"
          :aria-label="t('guests.rsvpToggle', { name: guest.name, status: t(`guests.rsvp.${guest.rsvp}`) })"
          @click="onCycle(guest.id)"
        >
          {{ t(`guests.rsvp.${guest.rsvp}`) }}
        </button>
        <span class="guest__name">{{ guest.name }}</span>
        <button
          type="button"
          class="remove"
          :aria-label="t('guests.remove', { name: guest.name })"
          @click="onRemove(guest.id)"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        </button>
      </li>
    </ul>
    <p
      v-else
      class="empty"
    >
      {{ t('guests.empty') }}
    </p>

    <PartyListToggle
      v-if="collapsible"
      :expanded="expanded"
      :hidden-count="hiddenCount"
      @toggle="toggle"
    />

    <PartyListAddRow
      :placeholder="t('guests.add')"
      :action-label="t('guests.addAction')"
      @add="onAdd"
    />
  </PartyListSection>
</template>

<style scoped>
.items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: none;
}

.guest {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.guest__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rsvp {
  flex-shrink: 0;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.rsvp--yes {
  color: var(--color-primary-text);
  background-color: var(--color-primary-soft);
}

.rsvp--pending {
  color: var(--color-text-muted);
  border-color: var(--color-border-strong);
}

.rsvp--no {
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
}

.remove {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-text-muted);
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: var(--radius-pill);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.remove:hover {
  color: var(--color-danger);
  background-color: var(--surface-sunken);
}

.remove svg {
  width: 1.1rem;
  height: 1.1rem;
}

.empty {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
