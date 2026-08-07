<script setup lang="ts">
interface Segment {
  value: string
  label: string
  /** Optional fill/text colour for this segment's active state (default primary). */
  activeColor?: string
  activeContrast?: string
}

defineProps<{ options: readonly Segment[], testIdPrefix?: string }>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="segmented">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="segmented__option"
      :class="{ 'segmented__option--active': model === option.value }"
      :style="model === option.value && option.activeColor
        ? { backgroundColor: option.activeColor, color: option.activeContrast }
        : undefined"
      :aria-pressed="model === option.value"
      :data-testid="testIdPrefix ? `${testIdPrefix}-${option.value}` : undefined"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background-color: var(--surface-sunken);
  border-radius: var(--radius-pill);
}

.segmented__option {
  flex: 1;
  min-height: 2.25rem;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: var(--radius-pill);
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.segmented__option--active {
  color: var(--color-primary-contrast);
  background-color: var(--color-primary);
}
</style>
