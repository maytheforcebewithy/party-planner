<template>
  <main class="app-content">
    <slot />
  </main>
</template>

<style scoped>
/* Main content region. Takes the remaining space within a page. */
.app-content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}
</style>
