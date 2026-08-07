<script setup lang="ts">
defineProps<{ title: string, placeholder: string }>()
</script>

<template>
  <div class="screen">
    <main class="page section">
      <h1 class="section__title">
        {{ title }}
      </h1>
      <p class="section__placeholder">
        {{ placeholder }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.section {
  padding-top: calc(var(--safe-area-inset-top) + var(--space-6));
}

.section__title {
  margin-bottom: var(--space-6);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.section__placeholder {
  color: var(--color-text-muted);
}
</style>
