<template>
  <div class="layout">
    <div class="layout__body">
      <slot />
    </div>
    <AppTabBar />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100dvh;
}

.layout__body {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  /* Clear the fixed bottom tab bar so content is never hidden behind it. */
  padding-bottom: calc(var(--tab-bar-height) + var(--safe-area-inset-bottom));
}
</style>
