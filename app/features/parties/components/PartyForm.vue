<script setup lang="ts">
import type { CreateParty, Party } from '../types/party'

const props = defineProps<{
  submitLabel: string
  initial?: Party
}>()

const emit = defineEmits<{
  submit: [value: CreateParty]
  cancel: []
}>()

const { t } = useI18n()

const name = ref(props.initial?.name ?? '')
const date = ref(props.initial?.date ?? '')
const location = ref(props.initial?.location ?? '')
const description = ref(props.initial?.description ?? '')
const error = ref('')

function onSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) {
    error.value = t('form.name.required')
    return
  }
  error.value = ''
  emit('submit', {
    name: trimmed,
    date: date.value || null,
    location: location.value.trim() || null,
    description: description.value.trim() || null,
  })
}
</script>

<template>
  <form
    class="form"
    novalidate
    @submit.prevent="onSubmit"
  >
    <BaseField
      v-model="name"
      :label="t('form.name.label')"
      :placeholder="t('form.name.placeholder')"
      :error="error"
      required
    />
    <BaseField
      v-model="date"
      :label="t('form.date.label')"
      type="date"
    />
    <BaseField
      v-model="location"
      :label="t('form.location.label')"
      :placeholder="t('form.location.placeholder')"
    />
    <BaseField
      v-model="description"
      :label="t('form.description.label')"
      :placeholder="t('form.description.placeholder')"
      multiline
    />

    <div class="form__actions">
      <BaseButton
        variant="ghost"
        type="button"
        data-testid="cancel"
        @click="emit('cancel')"
      >
        {{ t('form.cancel') }}
      </BaseButton>
      <BaseButton
        variant="primary"
        type="submit"
        data-testid="submit"
      >
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
}
</style>
