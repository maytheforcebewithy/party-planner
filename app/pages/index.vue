<template>
  <AppPage>
    <AppContent>
      <div class="home">
        <p class="home__title">
          Party Planner
        </p>
        <p class="home__hint">
          App setup successful
        </p>
      </div>
    </AppContent>
  </AppPage>
</template>

<style scoped>
.home {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.home__hint {
  color: var(--color-text-muted);
}
</style>
