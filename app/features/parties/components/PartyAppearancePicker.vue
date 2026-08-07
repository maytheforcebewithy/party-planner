<script setup lang="ts">
import PartyIcon from './PartyIcon.vue'
import PartyIconTile from './PartyIconTile.vue'
import { COLOR_KEYS, ICON_KEYS } from '../config/party-appearance'

const icon = defineModel<string>('icon', { required: true })
const color = defineModel<string>('color', { required: true })

const { t } = useI18n()

const iconTint = computed(() => ({ color: `var(--party-${color.value})` }))
</script>

<template>
  <div class="appearance">
    <div class="appearance__preview">
      <PartyIconTile
        :icon="icon"
        :color="color"
        size="lg"
      />
    </div>

    <fieldset class="appearance__group">
      <legend class="appearance__legend">
        {{ t('form.appearance.icon') }}
      </legend>
      <div
        class="appearance__row"
        :style="iconTint"
      >
        <button
          v-for="key in ICON_KEYS"
          :key="key"
          type="button"
          class="appearance__option"
          :class="{ 'appearance__option--active': icon === key }"
          :aria-pressed="icon === key"
          :aria-label="t(`form.appearance.icons.${key}`)"
          :data-testid="`icon-${key}`"
          @click="icon = key"
        >
          <PartyIcon :icon="key" />
        </button>
      </div>
    </fieldset>

    <fieldset class="appearance__group">
      <legend class="appearance__legend">
        {{ t('form.appearance.color') }}
      </legend>
      <div class="appearance__row">
        <button
          v-for="key in COLOR_KEYS"
          :key="key"
          type="button"
          class="appearance__swatch"
          :class="{ 'appearance__swatch--active': color === key }"
          :style="{ '--swatch': `var(--party-${key})` }"
          :aria-pressed="color === key"
          :aria-label="t(`form.appearance.colors.${key}`)"
          :data-testid="`color-${key}`"
          @click="color = key"
        />
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.appearance {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.appearance__preview {
  display: flex;
  justify-content: center;
}

.appearance__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
  border: 0;
}

.appearance__legend {
  padding: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.appearance__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.appearance__option {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  color: inherit;
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.appearance__option :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

.appearance__option--active {
  background-color: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.appearance__swatch {
  width: 2.25rem;
  height: 2.25rem;
  background-color: var(--swatch);
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  box-shadow: 0 0 0 1px var(--color-border);
  transition: box-shadow var(--transition-fast);
}

.appearance__swatch--active {
  box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--swatch);
}
</style>
