<script setup lang="ts">
defineProps<{ placeholder: string, actionLabel: string }>()
const emit = defineEmits<{ add: [name: string] }>()

const value = ref('')

function submit(): void {
  const trimmed = value.value.trim()
  if (!trimmed) return
  emit('add', trimmed)
  value.value = ''
}
</script>

<template>
  <form
    class="add"
    @submit.prevent="submit"
  >
    <input
      v-model="value"
      :placeholder="placeholder"
      class="add__input"
      data-testid="list-add-input"
    >
    <button
      type="submit"
      class="add__button"
      :aria-label="actionLabel"
      :disabled="!value.trim()"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          d="M12 5v14M5 12h14"
        />
      </svg>
    </button>
  </form>
</template>

<style scoped>
.add {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.add__input {
  flex: 1;
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background-color: var(--surface-sunken);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.add__input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.add__button {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-primary-contrast);
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
}

.add__button:disabled {
  opacity: 0.4;
}

.add__button svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
