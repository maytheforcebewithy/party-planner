<script setup lang="ts">
import PartyHero from '~/features/parties/components/PartyHero.vue'
import PartyInfoCard from '~/features/parties/components/PartyInfoCard.vue'
import PartyGuestList from '~/features/parties/components/PartyGuestList.vue'
import PartyShoppingList from '~/features/parties/components/PartyShoppingList.vue'
import PartyAttendance from '~/features/parties/components/PartyAttendance.vue'
import PartyDetailActions from '~/features/parties/components/PartyDetailActions.vue'
import { usePartiesStore } from '~/features/parties/stores/parties-store'
import { usePartyFormatting } from '~/features/parties/composables/use-party-formatting'
import { linkHost } from '~/features/parties/services/party-link'

const route = useRoute()
const store = usePartiesStore()
const { displayDate, displayTime } = usePartyFormatting()

const partyId = computed(() => String(route.params.partyId))
const party = computed(() => store.findById(partyId.value))
const timeLabel = computed(() =>
  party.value ? displayTime(party.value.startTime, party.value.endTime) : null,
)
const linkLabel = computed(() => (party.value?.link ? linkHost(party.value.link) : ''))
// A received invitation was reached from the invitations tab, so send back there.
const backTo = computed(() => (party.value?.received ? '/invitations' : '/'))

onMounted(() => {
  void store.ensureLoaded()
})
</script>

<template>
  <div class="screen">
    <AppBar :back-to="backTo">
      <template #action>
        <NuxtLink
          v-if="party"
          :to="`/parties/${party.id}/edit`"
          class="detail__edit"
          :aria-label="$t('detail.edit')"
          :title="$t('detail.edit')"
          data-testid="edit"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="detail__edit-icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"
            />
          </svg>
        </NuxtLink>
      </template>
    </AppBar>

    <main class="page">
      <article
        v-if="party"
        class="detail"
      >
        <PartyHero
          :name="party.name"
          :date-label="displayDate(party.date)"
          :time-label="timeLabel"
          :icon="party.icon"
          :color="party.color"
          :image="party.image"
        />

        <div class="detail__cards">
          <PartyInfoCard
            v-if="party.location"
            :label="$t('form.location.label')"
            :value="party.location"
          >
            <template #icon>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
                />
              </svg>
            </template>
          </PartyInfoCard>

          <PartyInfoCard
            v-if="party.description"
            :label="$t('form.description.label')"
            :value="party.description"
          />

          <PartyInfoCard
            v-if="party.notes"
            :label="$t('form.notes.label')"
            :value="party.notes"
          />
        </div>

        <BaseButton
          v-if="party.link"
          :href="party.link"
          variant="ghost"
          block
          data-testid="open-link"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="detail__link-icon"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"
            />
          </svg>
          {{ $t('detail.openLink', { host: linkLabel }) }}
        </BaseButton>

        <PartyAttendance
          v-if="party.received"
          :party-id="party.id"
        />
        <PartyGuestList
          v-if="!party.received"
          :party-id="party.id"
        />
        <PartyShoppingList
          :party-id="party.id"
          :received="party.received"
        />

        <PartyDetailActions :party="party" />
      </article>

      <p
        v-else-if="store.loaded"
        class="detail__missing"
        data-testid="not-found"
      >
        {{ $t('detail.notFound') }}
      </p>
    </main>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.detail__cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.detail__link-icon {
  width: 1.2rem;
  height: 1.2rem;
}

/* Edit lives in the app bar, so the detail footer stays a single primary CTA. */
.detail__edit {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  color: var(--color-primary-text);
}

.detail__edit-icon {
  width: 1.35rem;
  height: 1.35rem;
}

.detail__missing {
  padding-block: var(--space-10);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
