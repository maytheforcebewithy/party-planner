# Party Planner

App for organising private events. **A mobile-only app for Android and iOS**,
shipped as a native Capacitor app. There is no public web version — the browser
is only used for local development.

## Features

- **Plan a party** — name, date, time, location, description and free-form notes,
  plus a custom badge (icon + colour, or your own image) and a related link.
- **Guests** — a guest list with RSVP replies (yes / maybe / no) and a live count.
- **Shopping list** — items with per-guest assignment; for a received invitation
  it becomes a "what to bring" list instead.
- **Invitations inbox** — paste a message you received and the date, time and
  location are detected automatically; reply with your attendance.
- **Share** — send an invitation through the OS share sheet as text, or as a
  rendered **PNG image** (a clean, always-light card).
- **Reminders & calendar** — a per-party reminder (local notification the day
  before) and export to the phone calendar as an `.ics` event.
- **Import / export** — back up all parties, or a single party, as a file and
  import them again as fresh local copies.
- **Appearance & language** — light / dark / system theme, and a first-run
  language picker (English · German), changeable any time in settings.
- **Local-first & private** — everything lives on the device, works fully
  offline, no accounts and no cloud. Sharing only happens when you choose to.

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
