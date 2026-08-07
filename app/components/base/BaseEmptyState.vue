<script setup lang="ts">
defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <div class="empty">
    <span
      aria-hidden="true"
      class="empty__badge"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 21h16" />
        <path d="M5 21v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
        <path d="M4 15.5c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" />
        <path d="M12 8V5.5" />
        <path d="M12 3.5v.01" />
      </svg>
    </span>
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
  color: var(--color-primary-text);
  background: var(--color-primary-soft);
  border-radius: var(--radius-pill);
}

.empty__badge svg {
  width: 2rem;
  height: 2rem;
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
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  margin-top: var(--space-2);
}
</style>
