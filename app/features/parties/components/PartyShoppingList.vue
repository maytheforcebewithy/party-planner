<script setup lang="ts">
import PartyListSection from './PartyListSection.vue'
import PartyListAddRow from './PartyListAddRow.vue'
import PartyListToggle from './PartyListToggle.vue'
import { usePartyLists } from '../composables/use-party-lists'
import { useCollapsibleList } from '../composables/use-collapsible-list'

const props = defineProps<{ partyId: string }>()

const { t } = useI18n()
const {
  guests,
  shopping,
  shoppingStats,
  addShoppingItem,
  toggleShoppingItem,
  assignShoppingItem,
  removeShoppingItem,
} = usePartyLists(() => props.partyId)
const { visible, collapsible, expanded, hiddenCount, toggle } = useCollapsibleList(shopping)

const summary = computed(() =>
  shoppingStats.value.total === 0 ? '' : t('shopping.count', shoppingStats.value),
)

function onAdd(name: string): void {
  void addShoppingItem(name)
}

function onToggle(id: string): void {
  void toggleShoppingItem(id)
}

function onRemove(id: string): void {
  void removeShoppingItem(id)
}

function onAssign(id: string, event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  void assignShoppingItem(id, value || null)
}
</script>

<template>
  <PartyListSection
    :title="t('shopping.title')"
    :summary="summary"
  >
    <ul
      v-if="shopping.length"
      class="items"
    >
      <li
        v-for="item in visible"
        :key="item.id"
        class="item"
      >
        <button
          type="button"
          class="check"
          :class="{ 'check--done': item.done }"
          :aria-pressed="item.done"
          :aria-label="t('shopping.toggle', { name: item.name })"
          @click="onToggle(item.id)"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 12.5 10 17.5 19 7"
            />
          </svg>
        </button>

        <div class="item__body">
          <span
            class="item__name"
            :class="{ 'item__name--done': item.done }"
          >{{ item.name }}</span>
          <select
            v-if="guests.length"
            class="item__assign"
            :value="item.guestId ?? ''"
            :aria-label="t('shopping.assign')"
            @change="onAssign(item.id, $event)"
          >
            <option value="">
              {{ t('shopping.assignNone') }}
            </option>
            <option
              v-for="guest in guests"
              :key="guest.id"
              :value="guest.id"
            >
              {{ guest.name }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="remove"
          :aria-label="t('shopping.remove', { name: item.name })"
          @click="onRemove(item.id)"
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
      {{ t('shopping.empty') }}
    </p>

    <PartyListToggle
      v-if="collapsible"
      :expanded="expanded"
      :hidden-count="hiddenCount"
      @toggle="toggle"
    />

    <PartyListAddRow
      :placeholder="t('shopping.add')"
      :action-label="t('shopping.addAction')"
      @add="onAdd"
    />
  </PartyListSection>
</template>

<style scoped>
.items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.check {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.1rem;
  color: transparent;
  cursor: pointer;
  background: none;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.check--done {
  color: var(--color-primary-contrast);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.check svg {
  width: 1rem;
  height: 1rem;
}

.item__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item__name--done {
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.item__assign {
  align-self: flex-start;
  max-width: 100%;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  background-color: var(--surface-sunken);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
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
