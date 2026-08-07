<template>
  <div class="layout">
    <div class="layout__body">
      <slot />
    </div>
    <AppAdBanner />
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
  /* Clear the fixed ad banner + tab bar so content is never hidden behind them. */
  padding-bottom: calc(var(--ad-banner-height) + var(--tab-bar-height) + var(--safe-area-inset-bottom));
}
</style>
