<script setup lang="ts">
defineProps<{ title: string, summary: string }>()
</script>

<template>
  <section class="section">
    <header class="section__head">
      <h2 class="section__title">
        {{ title }}
      </h2>
      <span class="section__summary">{{ summary }}</span>
    </header>
    <slot />
  </section>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.section__head {
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
  justify-content: space-between;
}

.section__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.section__summary {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
