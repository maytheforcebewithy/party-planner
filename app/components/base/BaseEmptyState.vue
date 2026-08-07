<script setup lang="ts">
defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <div class="empty">
    <div
      aria-hidden="true"
      class="empty__badge"
    >
      🎉
    </div>
    <p class="empty__title">
      {{ title }}
    </p>
    <p
      v-if="hint"
      class="empty__hint"
    >
      {{ hint }}
    </p>
    <div
      v-if="$slots.action"
      class="empty__action"
    >
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty__badge {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  font-size: var(--font-size-xl);
  background: var(--surface-sunken);
  border-radius: var(--radius-pill);
}

.empty__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.empty__hint {
  max-width: 22rem;
  color: var(--color-text-muted);
}

.empty__action {
  margin-top: var(--space-2);
}
</style>
