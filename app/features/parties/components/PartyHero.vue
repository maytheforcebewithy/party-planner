<script setup lang="ts">
defineProps<{ name: string, dateLabel: string, timeLabel?: string | null }>()
</script>

<template>
  <header class="hero">
    <span
      aria-hidden="true"
      class="hero__icon"
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
        <path d="M12 8V6" />
        <circle
          cx="12"
          cy="4"
          r="1"
        />
      </svg>
    </span>
    <h1 class="hero__name">
      {{ name }}
    </h1>
    <p class="hero__date">
      {{ dateLabel }}
    </p>
    <p
      v-if="timeLabel"
      class="hero__time"
    >
      {{ timeLabel }}
    </p>
  </header>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-6) var(--space-4) var(--space-2);
  text-align: center;
}

.hero__icon {
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  color: var(--color-primary-text);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-lg);
}

.hero__icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.hero__name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.hero__date {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-text);
}

.hero__time {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>
