// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
  ],

  // The product is a native mobile app (Android/iOS) packaged with Capacitor.
  // It runs fully client-side: no SSR, no server routes, no Nitro backend.
  ssr: false,

  devtools: { enabled: true },

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

  vite: {
    server: {
      watch: {
        // Bind-mounted source (Docker on Windows/macOS) doesn't emit native FS
        // events, so hot reload needs polling. Enabled via env in the container
        // (see compose.yaml); off by default for native local dev.
        usePolling: process.env.VITE_USE_POLLING === 'true',
      },
    },
  },

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
})
