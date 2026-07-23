<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-layout__main">
      <AppContainer>
        <slot />
      </AppContainer>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.app-layout__main {
  flex: 1 1 auto;
  padding-block: var(--space-6);
}
</style>
