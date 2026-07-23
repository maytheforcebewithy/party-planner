import type { CapacitorConfig } from '@capacitor/cli'

// The application id is centralised here and can be overridden per environment
// via CAPACITOR_APP_ID, so it stays easy to change later.
const appId = process.env.CAPACITOR_APP_ID ?? 'de.kikimika.partyplanner'

const config: CapacitorConfig = {
  appId,
  appName: 'Party Planner',
  // Nuxt's static SPA output (`nuxt generate`). Capacitor copies this into the
  // native projects on `cap sync`.
  webDir: '.output/public',
}

export default config
