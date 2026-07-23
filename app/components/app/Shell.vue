<template>
  <div class="app-shell">
    <slot />
  </div>
</template>

<style scoped>
/* Outermost container: owns the full viewport and the device safe areas. */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding:
    var(--safe-area-inset-top)
    var(--safe-area-inset-right)
    var(--safe-area-inset-bottom)
    var(--safe-area-inset-left);
}
</style>
