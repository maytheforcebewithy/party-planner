<script setup lang="ts">
import { readStoredLanguage } from '~/composables/use-settings'

// Apply a persisted language override on start so the whole app renders in the
// chosen language; with none stored, i18n's auto-detection stands.
const { setLocale } = useI18n()
const stored = readStoredLanguage()
if (stored) void setLocale(stored)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
