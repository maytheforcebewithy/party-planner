# Party Planner

App zur Organisation privater Veranstaltungen. **Ausschließlich eine mobile App
für Android und iOS**, ausgeliefert als native Capacitor-App. Es gibt keine
öffentliche Web-Version — der Browser dient nur der lokalen Entwicklung.

## Stack

Nuxt 4 · Vue 3 · TypeScript · Capacitor · Pinia · VueUse · ESLint · Vitest ·
eigenes CSS. Kein SSR, keine Server-Routen, kein Backend (die REST-API entsteht
separat).

## Voraussetzungen

- **Docker** + Docker Compose (empfohlener Weg für die lokale Entwicklung)
- Für native Builds ohne Container: Node.js `>= 20`, pnpm (`corepack enable`),
  Android Studio / Android SDK, sowie macOS mit Xcode für iOS.

## Lokale Entwicklung mit Docker (empfohlen)

Die komplette Web-Entwicklung läuft über Docker — ein einziger Befehl:

```bash
docker compose up --build     # startet den Nuxt-Dev-Server auf http://localhost:3000
```

Weitere Befehle:

```bash
docker compose up             # starten (ohne Neubau)
docker compose up -d          # im Hintergrund starten
docker compose down           # Container stoppen und entfernen
docker compose logs -f        # Logs live anzeigen
docker compose exec app sh    # Shell im Container öffnen
```

Hot Reload ist aktiv: Änderungen im Arbeitsverzeichnis werden per Volume in den
Container gespiegelt (Dateiänderungen via Polling erkannt, siehe `VITE_USE_POLLING`).
`node_modules` und `.nuxt` bleiben im Container.

## Lokale Entwicklung ohne Docker

```bash
corepack enable
pnpm install
pnpm dev
```

## Tests & Qualität

Im Container (`docker compose exec app <cmd>`) oder lokal:

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
