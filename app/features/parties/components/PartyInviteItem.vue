<script setup lang="ts">
import PartyIconTile from './PartyIconTile.vue'
import type { Party } from '../types/party'
import { usePartyFormatting } from '../composables/use-party-formatting'

const props = defineProps<{ party: Party }>()
defineEmits<{ share: [] }>()

const { t } = useI18n()
const { displayDate } = usePartyFormatting()
const dateLabel = computed(() => (props.party.date ? displayDate(props.party.date) : ''))
</script>

<template>
  <div class="invite">
    <PartyIconTile
      :icon="party.icon"
      :color="party.color"
      :image="party.image"
    />
    <span class="invite__body">
      <span class="invite__name">{{ party.name }}</span>
      <span
        v-if="dateLabel"
        class="invite__date"
      >{{ dateLabel }}</span>
    </span>
    <BaseButton
      variant="ghost"
      data-testid="invite-share"
      @click="$emit('share')"
    >
      {{ t('share.action') }}
    </BaseButton>
  </div>
</template>

<style scoped>
.invite {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  background-color: var(--surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.invite__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.invite__name {
  overflow: hidden;
  font-weight: var(--font-weight-semibold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.invite__date {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-text);
}
</style>
