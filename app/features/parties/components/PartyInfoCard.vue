<script setup lang="ts">
defineProps<{ label: string, value: string }>()
</script>

<template>
  <section class="info-card">
    <h2 class="info-card__label">
      <span
        v-if="$slots.icon"
        aria-hidden="true"
        class="info-card__icon"
      >
        <slot name="icon" />
      </span>
      {{ label }}
    </h2>
    <p class="info-card__value">
      {{ value }}
    </p>
  </section>
</template>

<style scoped>
.info-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.info-card__label {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.info-card__icon {
  display: inline-grid;
  place-items: center;
  color: var(--color-primary-text);
}

.info-card__icon :deep(svg) {
  width: 1.1rem;
  height: 1.1rem;
}

.info-card__value {
  color: var(--color-text);
  white-space: pre-wrap;
}
</style>
