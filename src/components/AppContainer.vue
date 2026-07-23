<template>
  <div class="app-container">
    <slot />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-inline: auto;
  padding-inline: var(--space-4);
}
</style>
