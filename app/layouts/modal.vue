<template>
  <div class="layout">
    <slot />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding-bottom: var(--safe-area-inset-bottom);
}
</style>
