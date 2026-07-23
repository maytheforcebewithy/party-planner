// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
  ],

  // Client-rendered SPA (mobile app via Capacitor, no public website): the app
  // is exported as static assets and packaged into the native Android/iOS shell.
  ssr: false,

  // Auto-import composables from global and feature-scoped locations.
  imports: {
    dirs: [
      'composables',
      'shared/composables',
      'features/*/composables',
    ],
  },

  devtools: { enabled: true },

  // Global stylesheets, loaded in cascade order: tokens → reset → base.
  css: [
    '~/assets/css/variables.css',
    '~/assets/css/reset.css',
    '~/assets/css/base.css',
  ],

  srcDir: 'src/',

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-07-15',

  typescript: {
    strict: true,
    // Type checking runs via the dedicated `npm run typecheck` script.
    typeCheck: false,
  },

  // Enable stylistic formatting rules in the generated ESLint flat config.
  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Auto-register Pinia stores from global and feature-scoped locations.
  pinia: {
    storesDirs: [
      './src/stores/**',
      './src/features/*/stores/**',
    ],
  },
})
