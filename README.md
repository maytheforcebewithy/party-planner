# Party Planner

App for organising private events. **A mobile-only app for Android and iOS**,
shipped as a native Capacitor app. There is no public web version — the browser
is only used for local development.

## Stack

Nuxt 4 · Vue 3 · TypeScript · Capacitor · Pinia · VueUse · ESLint · Vitest ·
hand-written CSS. No SSR, no server routes, no backend (a REST API, if ever
needed, is a separate concern).

## Requirements

- Node.js `>= 20`
- pnpm (via `corepack enable`)
- Android: Android Studio / Android SDK
- iOS: macOS with Xcode (only buildable there)

## Install

```bash
corepack enable
pnpm install
```

## Local development

```bash
pnpm dev
```

Optionally reproducible in a container: see `.devcontainer/` or `Dockerfile`
(web toolchain; native builds still run on the host). For a hot-reload dev
container, `docker compose up --build` uses `Dockerfile.dev` and `compose.yaml`
(override the host port with `APP_PORT`).

## Tests

```bash
pnpm test        # watch mode
pnpm test:run    # single run
pnpm typecheck
pnpm lint
```

## Build (static client for Capacitor)

```bash
pnpm generate    # produces .output/public
```

## Capacitor sync

```bash
pnpm app:sync         # generate + cap sync
pnpm capacitor:sync   # cap sync only
```

## Run on Android

```bash
pnpm capacitor:android   # opens the project in Android Studio
```

## Run on iOS

macOS only. Generate the iOS project once, then open it:

```bash
pnpm exec cap add ios
pnpm capacitor:ios       # opens the project in Xcode
```

## Local data storage

All business data lives **exclusively on the device**. The app is offline-first
and works without an internet connection.

- **Why SQLite?** Party data grows (lists, tasks, guests, budget, schedule) and
  needs structured, queryable storage. SQLite (via the
  `@capacitor-community/sqlite` plugin) is more robust for this than
  `LocalStorage` or Preferences. Preferences are reserved for simple settings
  later on, not for business data.
- **Why no cloud?** Privacy is a core feature: no accounts, no central storage,
  no synchronisation. The data belongs to the user and stays on their device.
  Sharing only happens deliberately (invitation/export).
- **Why no REST API?** Without a cloud and without shared state there is nothing
  to serve. The core works entirely without a network.

Access is encapsulated: `Page → Composable/Store → repository interface →
persistence layer`. Components know nothing about SQLite or Capacitor. SQLite
runs only in the **native** app; in the browser (development/tests) a
non-persistent in-memory driver is used.

## Note

The application is intended solely as a mobile Capacitor app. No website and no
standalone web app is planned.

The app ID is set centrally in `capacitor.config.ts`
(`de.kikimika.partyplanner`) and overridable via `CAPACITOR_APP_ID`.
