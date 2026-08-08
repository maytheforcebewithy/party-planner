<script setup lang="ts">
import PartyAppearancePicker from './PartyAppearancePicker.vue'
import { DEFAULT_COLOR, DEFAULT_ICON, resolveColor, resolveIcon } from '../config/party-appearance'
import { normalizeLink } from '../services/party-link'
import type { CreateParty } from '../types/party'

const props = defineProps<{
  submitLabel: string
  /** Pre-fill values (an existing party when editing, or a parsed draft). */
  initial?: CreateParty
}>()

const emit = defineEmits<{
  submit: [value: CreateParty]
  cancel: []
}>()

const { t } = useI18n()

const name = ref(props.initial?.name ?? '')
const date = ref(props.initial?.date ?? '')
const startTime = ref(props.initial?.startTime ?? '')
const endTime = ref(props.initial?.endTime ?? '')
const location = ref(props.initial?.location ?? '')
const description = ref(props.initial?.description ?? '')
const notes = ref(props.initial?.notes ?? '')
const icon = ref<string>(props.initial ? resolveIcon(props.initial.icon ?? null) : DEFAULT_ICON)
const color = ref<string>(props.initial ? resolveColor(props.initial.color ?? null) : DEFAULT_COLOR)
const image = ref<string>(props.initial?.image ?? '')
const link = ref(props.initial?.link ?? '')
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
    startTime: startTime.value || null,
    endTime: endTime.value || null,
    location: location.value.trim() || null,
    description: description.value.trim() || null,
    notes: notes.value.trim() || null,
    icon: icon.value,
    color: color.value,
    image: image.value || null,
    link: normalizeLink(link.value),
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
    <PartyAppearancePicker
      v-model:icon="icon"
      v-model:color="color"
      v-model:image="image"
    />
    <BaseField
      v-model="date"
      :label="t('form.date.label')"
      type="date"
      optional
    />
    <div class="form__row">
      <BaseField
        v-model="startTime"
        :label="t('form.startTime.label')"
        type="time"
        optional
      />
      <BaseField
        v-model="endTime"
        :label="t('form.endTime.label')"
        type="time"
        optional
      />
    </div>
    <BaseField
      v-model="location"
      :label="t('form.location.label')"
      :placeholder="t('form.location.placeholder')"
      optional
    />
    <BaseField
      v-model="description"
      :label="t('form.description.label')"
      :placeholder="t('form.description.placeholder')"
      optional
      multiline
    />
    <BaseField
      v-model="notes"
      :label="t('form.notes.label')"
      :placeholder="t('form.notes.placeholder')"
      optional
      multiline
    />
    <BaseField
      v-model="link"
      :label="t('form.link.label')"
      :placeholder="t('form.link.placeholder')"
      type="url"
      optional
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

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  margin-top: var(--space-2);
}
</style>
