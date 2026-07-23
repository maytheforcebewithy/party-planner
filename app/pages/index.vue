<template>
  <main class="setup">
    <p class="setup__title">
      Party Planner
    </p>
    <p class="setup__hint">
      App setup successful
    </p>
  </main>
</template>

<style scoped>
.setup {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding:
    var(--safe-area-inset-top)
    var(--safe-area-inset-right)
    var(--safe-area-inset-bottom)
    var(--safe-area-inset-left);
  text-align: center;
}

.setup__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.setup__hint {
  color: var(--color-text-muted);
}
</style>
