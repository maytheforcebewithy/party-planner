import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Run tests inside a Nuxt runtime so auto-imports and components resolve.
    environment: 'nuxt',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['app/**/*.{ts,vue}'],
    },
  },
})
