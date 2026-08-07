// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
  ],

  // The product is a native mobile app (Android/iOS) packaged with Capacitor.
  // It runs fully client-side: no SSR, no server routes, no Nitro backend.
  ssr: false,

  // Disabled: the floating devtools badge sits bottom-centre and overlaps the
  // app's bottom tab bar (dev only, but it blocks the nav in review and e2e).
  devtools: { enabled: false },

  app: {
    head: {
      // viewport-fit=cover is required for the CSS safe-area insets (notch,
      // home indicator) to resolve to non-zero values inside the webview.
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },

  // Global stylesheets in cascade order: reset → tokens → base.
  css: [
    '~/assets/css/reset.css',
    '~/assets/css/variables.css',
    '~/assets/css/base.css',
  ],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',

  typescript: {
    strict: true,
    // Type checking runs via the dedicated `pnpm typecheck` script.
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Local, single-user app: no locale in the URL (`no_prefix`), German default.
  // Locale messages live in `i18n/locales/*.json` and must stay at key parity.
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'de',
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
  },
})
