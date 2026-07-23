<template>
  <div class="app-page">
    <slot />
  </div>
</template>

<style scoped>
/* Per-page wrapper. Fills the space the shell offers and is ready to host a
   header/navigation above the content in a later phase. */
.app-page {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
</style>
