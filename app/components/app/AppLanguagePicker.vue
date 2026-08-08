<script setup lang="ts">
import { useLanguage } from '~/composables/use-language'
import type { LanguageCode } from '~/composables/use-language'

const { t } = useI18n()
const { options, setLanguage } = useLanguage()

function choose(code: LanguageCode): void {
  void setLanguage(code)
}
</script>

<template>
  <div
    class="picker"
    data-testid="language-picker"
  >
    <div class="picker__card">
      <p
        class="picker__emoji"
        aria-hidden="true"
      >
        🎉
      </p>
      <h1 class="picker__title">
        {{ t('welcome.title') }}
      </h1>
      <p class="picker__subtitle">
        {{ t('welcome.subtitle') }}
      </p>

      <ul class="picker__list">
        <li
          v-for="option in options"
          :key="option.value"
        >
          <button
            type="button"
            class="picker__option"
            :lang="option.value"
            :data-testid="`language-option-${option.value}`"
            @click="choose(option.value)"
          >
            {{ option.label }}
            <span
              class="picker__chevron"
              aria-hidden="true"
            >›</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.picker {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: max(var(--space-6), var(--safe-area-inset-top))
    max(var(--space-6), var(--safe-area-inset-right))
    max(var(--space-6), var(--safe-area-inset-bottom))
    max(var(--space-6), var(--safe-area-inset-left));
  background-color: var(--color-bg);
}

.picker__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  max-width: 22rem;
}

.picker__emoji {
  font-size: var(--font-size-2xl);
  text-align: center;
}

.picker__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  text-align: center;
}

.picker__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.picker__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
  list-style: none;
}

.picker__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 3.25rem;
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  cursor: pointer;
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.picker__option:active {
  background-color: var(--surface-sunken);
  border-color: var(--color-border-strong);
}

.picker__chevron {
  font-size: var(--font-size-xl);
  color: var(--color-primary-text);
}
</style>
