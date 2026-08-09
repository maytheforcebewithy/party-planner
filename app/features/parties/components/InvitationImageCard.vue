<script setup lang="ts">
import PartyIconTile from './PartyIconTile.vue'
import { usePartyFormatting } from '../composables/use-party-formatting'
import type { Party } from '../types/party'

const props = defineProps<{ party: Party }>()

const { t } = useI18n()
const { displayDate, displayTime } = usePartyFormatting()

// Empty (not the "no date" fallback) when unset, so the row drops off the image.
const dateLabel = computed(() => (props.party.date ? displayDate(props.party.date) : ''))
const timeLabel = computed(() => displayTime(props.party.startTime, props.party.endTime))
</script>

<template>
  <div class="invite">
    <PartyIconTile
      :icon="party.icon"
      :color="party.color"
      :image="party.image"
      size="lg"
    />

    <p class="invite__eyebrow">
      {{ t('share.invitation.eyebrow') }}
    </p>
    <h2 class="invite__name">
      {{ party.name }}
    </h2>

    <dl class="invite__facts">
      <div
        v-if="dateLabel"
        class="invite__fact"
      >
        <dt>{{ t('form.date.label') }}</dt>
        <dd>{{ dateLabel }}<span v-if="timeLabel"> · {{ timeLabel }}</span></dd>
      </div>
      <div
        v-if="party.location"
        class="invite__fact"
      >
        <dt>{{ t('form.location.label') }}</dt>
        <dd>{{ party.location }}</dd>
      </div>
    </dl>

    <p
      v-if="party.notes"
      class="invite__notes"
    >
      {{ party.notes }}
    </p>

    <p class="invite__brand">
      {{ t('app.title') }}
    </p>
  </div>
</template>

<style scoped>
.invite {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  width: 22rem;
  padding: var(--space-8) var(--space-6);
  text-align: center;
  background-color: var(--color-bg);
}

.invite__eyebrow {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-text);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.invite__name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.invite__facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  margin-top: var(--space-2);
}

.invite__fact dt {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.invite__fact dd {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

.invite__notes {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  background-color: var(--surface-sunken);
  border-radius: var(--radius-md);
}

.invite__brand {
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}
</style>
