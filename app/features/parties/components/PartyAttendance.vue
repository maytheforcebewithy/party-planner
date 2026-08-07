<script setup lang="ts">
import { usePartiesStore } from '../stores/parties-store'
import { ATTENDANCE_OPTIONS } from '../types/party'
import type { Attendance } from '../types/party'

const props = defineProps<{ partyId: string }>()

const { t } = useI18n()
const store = usePartiesStore()

const options = computed(() =>
  ATTENDANCE_OPTIONS.map(value => ({ value, label: t(`attendance.${value}`) })),
)

// Empty string means "no reply yet" — none of the segments is highlighted.
const reply = computed<string>({
  get: () => store.findById(props.partyId)?.attendance ?? '',
  set: (value) => {
    void store.update(props.partyId, { attendance: value as Attendance })
  },
})
</script>

<template>
  <section
    class="attendance"
    data-testid="attendance"
  >
    <h2 class="attendance__title">
      {{ t('attendance.title') }}
    </h2>
    <BaseSegmentedControl
      v-model="reply"
      :options="options"
      test-id-prefix="attendance"
    />
  </section>
</template>

<style scoped>
.attendance {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.attendance__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}
</style>
