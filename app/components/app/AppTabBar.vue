<script setup lang="ts">
interface Tab {
  key: string
  to: string
  labelKey: string
  iconPaths: readonly string[]
  isActive: (path: string) => boolean
}

const tabs: readonly Tab[] = [
  {
    key: 'parties',
    to: '/',
    labelKey: 'nav.tabs.parties',
    iconPaths: [
      'M8 2v4',
      'M16 2v4',
      'M3 10h18',
      'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    ],
    isActive: path => path === '/' || path.startsWith('/parties'),
  },
  {
    key: 'invitations',
    to: '/invitations',
    labelKey: 'nav.tabs.invitations',
    iconPaths: [
      'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
      'm3 7 9 6 9-6',
    ],
    isActive: path => path.startsWith('/invitations'),
  },
  {
    key: 'importExport',
    to: '/import-export',
    labelKey: 'nav.tabs.importExport',
    iconPaths: [
      'M8 20V8',
      'm4 12 4-4 4 4',
      'M16 4v12',
      'm20 12-4 4-4-4',
    ],
    isActive: path => path.startsWith('/import-export'),
  },
  {
    key: 'settings',
    to: '/settings',
    labelKey: 'nav.tabs.settings',
    iconPaths: [
      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
      'M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 6.1 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.3 6.1L3.2 6a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8a1.7 1.7 0 0 0 1-1.6V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V8a1.7 1.7 0 0 0 1.6 1H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
    ],
    isActive: path => path.startsWith('/settings'),
  },
]

const route = useRoute()
</script>

<template>
  <nav class="tabs">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.key"
      :to="tab.to"
      class="tabs__item"
      :class="{ 'tabs__item--active': tab.isActive(route.path) }"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="tabs__icon"
      >
        <path
          v-for="(d, index) in tab.iconPaths"
          :key="index"
          :d="d"
        />
      </svg>
      <span class="tabs__label">{{ $t(tab.labelKey) }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  height: calc(var(--tab-bar-height) + var(--safe-area-inset-bottom));
  padding-bottom: var(--safe-area-inset-bottom);
  background-color: color-mix(in srgb, var(--color-bg) 90%, transparent);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
}

.tabs__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.tabs__item--active {
  color: var(--color-primary-text);
}

.tabs__icon {
  width: 1.5rem;
  height: 1.5rem;
}

.tabs__label {
  font-size: 0.6875rem;
  font-weight: var(--font-weight-medium);
}
</style>
