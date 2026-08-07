<script setup lang="ts">
// Placeholder ad slot pinned above the tab bar. Real ad content is wired in
// later; for now it just reserves the space so layouts already account for it.
</script>

<template>
  <aside
    class="ad"
    aria-hidden="true"
  >
    <span class="ad__label">{{ $t('ads.placeholder') }}</span>
  </aside>
</template>

<style scoped>
.ad {
  position: fixed;
  right: 0;
  bottom: calc(var(--tab-bar-height) + var(--safe-area-inset-bottom));
  left: 0;
  z-index: 19;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--ad-banner-height);
  background-color: var(--surface-sunken);
  border-top: 1px solid var(--color-border);
}

.ad__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
