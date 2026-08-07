<script setup lang="ts">
import PartyInviteItem from '~/features/parties/components/PartyInviteItem.vue'
import { useParties } from '~/features/parties/composables/use-parties'
import { useShareInvitation } from '~/features/parties/composables/use-share-invitation'
import { partitionParties } from '~/features/parties/services/partition-parties'
import type { Party } from '~/features/parties/types/party'

const { t } = useI18n()
const store = useParties()
const { shareInvitation } = useShareInvitation()

const today = new Date().toISOString().slice(0, 10)
const upcoming = computed(() => partitionParties(store.parties, today).upcoming)
const isEmpty = computed(() => store.loaded && store.partyCount === 0)
const notice = ref('')

async function share(party: Party): Promise<void> {
  const result = await shareInvitation(party)
  notice.value = result === 'copied'
    ? t('share.copied')
    : result === 'unavailable'
      ? t('share.unavailable')
      : ''
}

function onShare(party: Party): void {
  void share(party)
}
</script>

<template>
  <div class="screen">
    <main class="page">
      <h1 class="title">
        {{ t('invitations.title') }}
      </h1>
      <p class="intro">
        {{ t('invitations.intro') }}
      </p>

      <BaseEmptyState
        v-if="isEmpty"
        :title="t('invitations.empty.title')"
        :hint="t('invitations.empty.hint')"
      >
        <template #action>
          <BaseButton
            to="/parties/create"
            data-testid="invite-empty-cta"
          >
            {{ t('list.empty.cta') }}
          </BaseButton>
        </template>
      </BaseEmptyState>

      <p
        v-else-if="upcoming.length === 0"
        class="none"
        data-testid="invite-none"
      >
        {{ t('invitations.none') }}
      </p>

      <ul
        v-else
        class="list"
      >
        <li
          v-for="party in upcoming"
          :key="party.id"
        >
          <PartyInviteItem
            :party="party"
            @share="onShare(party)"
          />
        </li>
      </ul>

      <p
        v-if="notice"
        class="notice"
        role="status"
        data-testid="invite-notice"
      >
        {{ notice }}
      </p>
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

.intro {
  margin-top: calc(var(--space-3) * -1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: 0;
  list-style: none;
}

.none {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}

.notice {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
