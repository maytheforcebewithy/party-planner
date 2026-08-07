import { defineConfig, devices } from '@playwright/test'

// e2e reuses a dev server already running for manual review when present, and
// otherwise starts its own — on the same port, because the Nuxt dev lock is
// per-project, so a second parallel dev server would fail. (mizuhara owns 3000.)
const PORT = 3001
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Fail the build if a `test.only` is committed by accident.
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    // Pin the locale so i18n renders the primary German UI deterministically
    // (the app auto-detects browser language otherwise).
    locale: 'de-DE',
    trace: 'on-first-retry',
  },
  // The product is mobile-only; drive a mobile viewport so e2e matches reality.
  projects: [
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
