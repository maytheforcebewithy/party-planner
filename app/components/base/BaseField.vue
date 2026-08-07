<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  type?: 'text' | 'date' | 'time' | 'url'
  placeholder?: string
  required?: boolean
  optional?: boolean
  multiline?: boolean
  error?: string
}>(), {
  type: 'text',
  required: false,
  optional: false,
  multiline: false,
})

const model = defineModel<string>({ required: true })

const { t } = useI18n()
const id = useId()
const errorId = computed(() => (props.error ? `${id}-error` : undefined))
</script>

<template>
  <div class="field">
    <label
      :for="id"
      class="field__label"
    >
      {{ label }}<span
        v-if="required"
        aria-hidden="true"
        class="field__req"
      > *</span>
      <span
        v-if="optional"
        class="field__optional"
      >{{ t('form.optional') }}</span>
    </label>

    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :aria-describedby="errorId"
      rows="4"
      class="field__control field__control--area"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="errorId"
      class="field__control"
    >

    <p
      v-if="error"
      :id="errorId"
      role="alert"
      class="field__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
}

.field__req {
  color: var(--color-primary-text);
}

.field__optional {
  margin-left: var(--space-2);
  font-size: var(--font-size-sm);
  font-style: italic;
  font-weight: var(--font-weight-light);
  color: var(--color-text-muted);
}

.field__control {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.field__control:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.field__control--area {
  resize: vertical;
  min-height: 6rem;
}

.field__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}
</style>
