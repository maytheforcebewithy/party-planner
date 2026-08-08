<script setup lang="ts">
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { useLanguage } from '~/composables/use-language'
import { useTheme } from '~/composables/use-theme'
import { useShareApp } from '~/composables/use-share-app'
import { shareNoticeKey } from '~/shared/sharing/share-text'
import { APP_STORE_LINKS } from '~/config/app-store'

const { t } = useI18n()
const store = usePartiesStore()
const { language, options: languageOptions } = useLanguage()
const { mode: themeMode, modes: themeModes } = useTheme()
const { shareApp } = useShareApp()

const themeOptions = computed(() =>
  themeModes.map(value => ({ value, label: t(`settings.theme.${value}`) })),
)

const appVersion = useRuntimeConfig().public.appVersion
const storeLinks = APP_STORE_LINKS

const confirming = ref(false)
const cleared = ref(false)
const shareNotice = ref('')

onMounted(() => {
  void store.ensureLoaded()
})

async function deleteAll(): Promise<void> {
  await store.clearAll()
  confirming.value = false
  cleared.value = true
}

function onDeleteAll(): void {
  void deleteAll()
}

async function runShareApp(): Promise<void> {
  const key = shareNoticeKey(await shareApp())
  shareNotice.value = key ? t(key) : ''
}

function onShareApp(): void {
  void runShareApp()
}
</script>

<template>
  <div class="screen">
    <main class="page">
      <h1 class="title">
        {{ t('settings.title') }}
      </h1>

      <BaseCard :title="t('settings.language.title')">
        <BaseSegmentedControl
          v-model="language"
          :options="languageOptions"
          test-id-prefix="settings-language"
        />
      </BaseCard>

      <BaseCard :title="t('settings.theme.title')">
        <BaseSegmentedControl
          v-model="themeMode"
          :options="themeOptions"
          test-id-prefix="settings-theme"
        />
      </BaseCard>

      <BaseCard :title="t('settings.data.title')">
        <p class="card__text">
          {{ t('settings.data.text') }}
        </p>

        <BaseButton
          v-if="!confirming"
          variant="danger"
          block
          :disabled="store.partyCount === 0"
          data-testid="delete-all"
          @click="confirming = true"
        >
          {{ t('settings.data.action', { count: store.partyCount }) }}
        </BaseButton>

        <div
          v-else
          class="confirm"
          data-testid="delete-all-confirm"
        >
          <p class="confirm__text">
            {{ t('settings.data.confirm') }}
          </p>
          <div class="confirm__actions">
            <BaseButton
              variant="ghost"
              @click="confirming = false"
            >
              {{ t('form.cancel') }}
            </BaseButton>
            <BaseButton
              variant="danger"
              data-testid="delete-all-confirmed"
              @click="onDeleteAll"
            >
              {{ t('settings.data.confirmAction') }}
            </BaseButton>
          </div>
        </div>

        <p
          v-if="cleared"
          class="notice"
          role="status"
          data-testid="cleared-notice"
        >
          {{ t('settings.data.cleared') }}
        </p>
      </BaseCard>

      <BaseCard :title="t('app.title')">
        <p class="card__text">
          {{ t('settings.about.text') }}
        </p>
        <p
          class="version"
          data-testid="app-version"
        >
          {{ t('settings.about.version', { version: appVersion }) }}
        </p>

        <BaseButton
          block
          data-testid="share-app"
          @click="onShareApp"
        >
          {{ t('settings.about.share') }}
        </BaseButton>

        <div class="stores">
          <BaseButton
            variant="ghost"
            block
            :href="storeLinks.android"
          >
            {{ t('settings.about.android') }}
          </BaseButton>
          <BaseButton
            variant="ghost"
            block
            :href="storeLinks.ios"
          >
            {{ t('settings.about.ios') }}
          </BaseButton>
        </div>

        <p
          v-if="shareNotice"
          class="notice"
          role="status"
          data-testid="share-app-notice"
        >
          {{ shareNotice }}
        </p>
      </BaseCard>
    </main>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.version {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.stores {
  display: flex;
  gap: var(--space-3);
}

.stores > * {
  flex: 1;
}

.confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.confirm__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.notice {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
