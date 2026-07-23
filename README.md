# Party Planner

App zur Organisation privater Veranstaltungen. **Ausschließlich eine mobile App
für Android und iOS**, ausgeliefert als native Capacitor-App. Es gibt keine
öffentliche Web-Version — der Browser dient nur der lokalen Entwicklung.

## Stack

Nuxt 4 · Vue 3 · TypeScript · Capacitor · Pinia · VueUse · ESLint · Vitest ·
eigenes CSS. Kein SSR, keine Server-Routen, kein Backend (die REST-API entsteht
separat).

## Voraussetzungen

- Node.js `>= 20`
- pnpm (via `corepack enable`)
- Android: Android Studio / Android SDK
- iOS: macOS mit Xcode (nur dort baubar)

## Installation

```bash
corepack enable
pnpm install
```

## Lokale Entwicklung

```bash
pnpm dev
```

Optional reproduzierbar im Container: siehe `.devcontainer/` bzw. `Dockerfile`
(Web-Toolchain; native Builds laufen weiterhin auf dem Host).

## Tests

```bash
pnpm test        # Watch-Modus
pnpm test:run    # einmalig
pnpm typecheck
pnpm lint
```

## Build (statischer Client für Capacitor)

```bash
pnpm generate    # erzeugt .output/public
```

## Capacitor-Sync

```bash
pnpm app:sync         # generate + cap sync
pnpm capacitor:sync   # nur cap sync
```

## Android starten

```bash
pnpm capacitor:android   # öffnet das Projekt in Android Studio
```

## iOS starten

Nur auf macOS. Einmalig das iOS-Projekt erzeugen, danach öffnen:

```bash
pnpm exec cap add ios
pnpm capacitor:ios       # öffnet das Projekt in Xcode
```

## Hinweis

Die Anwendung ist ausschließlich als mobile Capacitor-App gedacht. Es ist keine
Website und keine eigenständige Web-App geplant.

Die App-ID ist zentral in `capacitor.config.ts` gesetzt
(`de.kikimika.partyplanner`) und über `CAPACITOR_APP_ID` überschreibbar.
