<script setup lang="ts">
defineProps<{
  title: string
  /** When set, shows a back link pointing at this route. */
  backTo?: string
}>()
</script>

<template>
  <header class="app-bar">
    <div class="app-bar__slot app-bar__slot--start">
      <NuxtLink
        v-if="backTo"
        :to="backTo"
        :aria-label="$t('nav.back')"
        class="app-bar__back"
        data-testid="back-link"
      >
        <span aria-hidden="true">‹</span>
      </NuxtLink>
    </div>

    <h1 class="app-bar__title">
      {{ title }}
    </h1>

    <div class="app-bar__slot app-bar__slot--end">
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
.app-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 2.75rem 1fr 2.75rem;
  align-items: center;
  padding-top: var(--safe-area-inset-top);
  background-color: color-mix(in srgb, var(--color-bg) 88%, transparent);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.app-bar__title {
  overflow: hidden;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: 2.75rem;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-bar__slot {
  display: flex;
  align-items: center;
  height: 2.75rem;
}

.app-bar__slot--end {
  justify-content: flex-end;
}

.app-bar__back {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  font-size: var(--font-size-xl);
  color: var(--color-primary-text);
}
</style>
