<script setup lang="ts">
import { ICON_PATHS, resolveIcon } from '../config/party-appearance'

const props = defineProps<{ icon: string | null }>()

const paths = computed(() => ICON_PATHS[resolveIcon(props.icon)])
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      v-for="(d, i) in paths"
      :key="i"
      :d="d"
    />
  </svg>
</template>
