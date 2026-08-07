<script setup lang="ts">
import PartyIcon from './PartyIcon.vue'
import { resolveColor } from '../config/party-appearance'

const props = withDefaults(defineProps<{
  icon: string | null
  color: string | null
  size?: 'lg' | 'md'
}>(), {
  size: 'md',
})

const accent = computed(() => ({
  '--tile-accent': `var(--party-${resolveColor(props.color)})`,
  '--tile-accent-soft': `var(--party-${resolveColor(props.color)}-soft)`,
}))
</script>

<template>
  <span
    aria-hidden="true"
    class="tile"
    :class="`tile--${size}`"
    :style="accent"
  >
    <PartyIcon :icon="icon" />
  </span>
</template>

<style scoped>
.tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  color: var(--tile-accent);
  background-color: var(--tile-accent-soft);
}

.tile--lg {
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-lg);
}

.tile--lg :deep(svg) {
  width: 2.5rem;
  height: 2.5rem;
}

.tile--md {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
}

.tile--md :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
