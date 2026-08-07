<script setup lang="ts">
import PartyIcon from './PartyIcon.vue'
import { resolveColor } from '../config/party-appearance'

const props = withDefaults(defineProps<{
  icon: string | null
  color: string | null
  image?: string | null
  size?: 'lg' | 'md'
}>(), {
  image: null,
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
    :class="[`tile--${size}`, { 'tile--image': image }]"
    :style="accent"
  >
    <img
      v-if="image"
      :src="image"
      alt=""
      class="tile__image"
    >
    <PartyIcon
      v-else
      :icon="icon"
    />
  </span>
</template>

<style scoped>
.tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  color: var(--tile-accent);
  background-color: var(--tile-accent-soft);
}

.tile--image {
  background-color: transparent;
}

.tile__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
