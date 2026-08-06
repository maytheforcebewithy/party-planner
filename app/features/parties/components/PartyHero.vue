<script setup lang="ts">
defineProps<{ dateLabel: string }>()
</script>

<template>
  <div class="hero">
    <span
      aria-hidden="true"
      class="hero__badge"
    >🎉</span>
    <p class="hero__date">
      {{ dateLabel }}
    </p>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-8) var(--space-6);
  color: var(--color-primary-contrast);
  text-align: center;
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.hero__badge {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  font-size: var(--font-size-2xl);
  background-color: rgb(255 255 255 / 18%);
  border: 2px solid var(--color-gold);
  border-radius: var(--radius-pill);
}

.hero__date {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}
</style>
