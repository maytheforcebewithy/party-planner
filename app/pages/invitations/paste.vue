<script setup lang="ts">
import PartyForm from '~/features/parties/components/PartyForm.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { parseInvitationText } from '~/features/parties/services/parse-invitation'
import { readClipboard } from '~/shared/clipboard/read-clipboard'
import type { CreateParty } from '~/features/parties/types/party'

definePageMeta({ layout: 'modal' })

const { t } = useI18n()
const store = usePartiesStore()

const text = ref('')
const draft = ref<CreateParty | null>(null)
const empty = ref(false)

function parse(source: string): void {
  if (source.trim()) {
    draft.value = parseInvitationText(source)
    empty.value = false
  }
}

async function fromClipboard(showEmptyHint: boolean): Promise<void> {
  const clip = await readClipboard()
  if (clip.trim()) {
    text.value = clip
    parse(clip)
  }
  else if (showEmptyHint) {
    empty.value = true
  }
}

// On a device the clipboard reads silently, so opening the screen jumps straight
// to the pre-filled form. In the browser this is blocked without a user gesture,
// so the explicit button and textarea below are used instead.
onMounted(() => {
  void fromClipboard(false)
})

function onClipboard(): void {
  void fromClipboard(true)
}

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

        <BaseButton
          block
          data-testid="paste-clipboard"
          @click="onClipboard"
        >
          {{ t('invitations.paste.clipboard') }}
        </BaseButton>

        <p
          v-if="empty"
          class="empty"
          role="status"
          data-testid="paste-empty"
        >
          {{ t('invitations.paste.empty') }}
        </p>

        <p class="or">
          {{ t('invitations.paste.or') }}
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
          variant="ghost"
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

.empty {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  text-align: center;
}

.or {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
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
