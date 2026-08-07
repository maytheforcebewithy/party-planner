<script setup lang="ts">
import PartyIconTile from './PartyIconTile.vue'

defineProps<{
  name: string
  dateLabel: string
  timeLabel?: string | null
  icon?: string | null
  color?: string | null
}>()
</script>

<template>
  <header class="hero">
    <PartyIconTile
      :icon="icon ?? null"
      :color="color ?? null"
      size="lg"
    />
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
