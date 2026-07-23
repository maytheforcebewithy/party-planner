import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Run tests inside a Nuxt runtime so auto-imports and components resolve.
    environment: 'nuxt',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      // Enforce coverage only where logic actually lives. Placeholder folders
      // (empty stores/services/types) and framework config are intentionally
      // excluded so we never write hollow tests just to hit a number.
      include: [
        'src/components/**/*.vue',
        'src/pages/**/*.vue',
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
