<script setup lang="ts">
import PartyForm from '~/features/parties/components/PartyForm.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { parseInvitationText } from '~/features/parties/services/parse-invitation'
import { pasteSourceKey } from '~/features/parties/composables/use-paste-source'
import type { CreateParty } from '~/features/parties/types/party'

definePageMeta({ layout: 'modal' })

const { t } = useI18n()
const store = usePartiesStore()
const pasteSource = useState<string>(pasteSourceKey, () => '')

const text = ref('')
const draft = ref<CreateParty | null>(null)

function parse(source: string): void {
  if (source.trim()) draft.value = parseInvitationText(source)
}

onMounted(() => {
  // The invitations tab already read the clipboard for us (its tap was the
  // required user gesture); jump straight to the pre-filled form when it had
  // content. Otherwise the textarea below is the manual fallback.
  const clip = pasteSource.value
  pasteSource.value = ''
  if (clip.trim()) {
    text.value = clip
    parse(clip)
  }
})

function onParse(): void {
  parse(text.value)
}

async function create(data: CreateParty): Promise<void> {
  const party = await store.create({ ...data, received: true })
  await navigateTo(`/parties/${party.id}`)
}

function onSubmit(data: CreateParty): void {
  void create(data)
}

function onCancel(): void {
  void navigateTo('/invitations')
}
</script>

<template>
  <div class="screen">
    <AppBar
      :title="t('invitations.paste.action')"
      back-to="/invitations"
    />

    <main class="page">
      <template v-if="!draft">
        <p class="intro">
          {{ t('invitations.paste.intro') }}
        </p>
        <textarea
          v-model="text"
          :placeholder="t('invitations.paste.placeholder')"
          rows="7"
          class="paste"
          data-testid="paste-input"
        />
        <BaseButton
          block
          :disabled="!text.trim()"
          data-testid="paste-parse"
          @click="onParse"
        >
          {{ t('invitations.paste.parse') }}
        </BaseButton>
      </template>

      <template v-else>
        <p class="intro">
          {{ t('invitations.paste.review') }}
        </p>
        <PartyForm
          :initial="draft"
          :submit-label="t('invitations.paste.submit')"
          @submit="onSubmit"
          @cancel="onCancel"
        />
      </template>
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.intro {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.paste {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
}

.paste:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}
</style>
