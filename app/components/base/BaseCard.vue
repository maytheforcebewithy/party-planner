<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <section class="card">
    <h2
      v-if="title"
      class="card__title"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

/* Muted body copy: slot a `<p class="card__text">` — `:deep` reaches the
   slotted node, and scoping under `.card` keeps the style card-only. */
.card :deep(.card__text) {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
