<script setup lang="ts">
defineProps<{ expanded: boolean, hiddenCount: number }>()
defineEmits<{ toggle: [] }>()

const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="toggle"
    :aria-expanded="expanded"
    data-testid="list-toggle"
    @click="$emit('toggle')"
  >
    <span>{{ expanded ? t('lists.showLess') : t('lists.showMore', { count: hiddenCount }) }}</span>
    <svg
      class="toggle__chevron"
      :class="{ 'toggle__chevron--up': expanded }"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 9l6 6 6-6"
      />
    </svg>
  </button>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  gap: var(--space-1);
  align-items: center;
  align-self: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-text);
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: var(--radius-pill);
  transition: background-color var(--transition-fast);
}

.toggle:hover {
  background-color: var(--surface-sunken);
}

.toggle__chevron {
  width: 1.05rem;
  height: 1.05rem;
  transition: transform var(--transition-fast);
}

.toggle__chevron--up {
  transform: rotate(180deg);
}
</style>
