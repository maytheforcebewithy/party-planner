<script setup lang="ts">
import { FIRST_RUN_LANGUAGE, readStoredLanguage, useLanguage } from '~/composables/use-language'
import { useTheme } from '~/composables/use-theme'

// Apply the persisted language on start; on a fresh install none is stored, so
// the app renders in the first-run language and the picker below gates it until
// the user chooses.
const { locale, setLocale } = useI18n()
const { hasChosenLanguage } = useLanguage()

// Apply the persisted (or system) theme from the first paint.
useTheme()

void setLocale(readStoredLanguage() ?? FIRST_RUN_LANGUAGE)

// Reflect the active locale on <html lang> for accessibility.
useHead({ htmlAttrs: { lang: locale } })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppLanguagePicker v-if="!hasChosenLanguage" />
</template>
