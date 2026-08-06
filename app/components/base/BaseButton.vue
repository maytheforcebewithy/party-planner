<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
  /** When set, renders a NuxtLink styled as a button (valid markup for navigation). */
  to?: string
  disabled?: boolean
  block?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  block: false,
})

const classes = computed(() => [`btn--${props.variant}`, { 'btn--block': props.block }])
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="btn"
    :class="classes"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="classes"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 var(--space-5);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  text-align: center;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  transition: background-color var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn--block {
  display: flex;
  width: 100%;
}

.btn--primary {
  color: var(--color-primary-contrast);
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  box-shadow: var(--shadow-glow);
}

.btn--primary:hover:not(:disabled) {
  background-image: linear-gradient(135deg, var(--color-primary-hover), var(--color-accent-hover));
}

.btn--ghost {
  color: var(--color-primary-text);
  background-color: transparent;
  border-color: var(--color-border-strong);
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--surface-sunken);
}

.btn--danger {
  color: var(--color-danger-contrast);
  background-color: var(--color-danger);
}

.btn--danger:hover:not(:disabled) {
  background-color: var(--color-danger-hover);
}
</style>
