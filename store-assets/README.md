# Store assets

Graphic assets for the Google Play listing (see `../PLAY_STORE.md` for the copy).

| File | Purpose | Size |
| --- | --- | --- |
| `play-icon-512.png` | Play listing icon | 512×512 |
| `feature-graphic.png` | Feature graphic (banner) | 1024×500 |

## Screenshots — capture from the emulator

Play needs **2–8 phone screenshots**. The cleanest source is the **running app on
the Android emulator** (real resolution + status bar), not a browser capture.

1. In Android Studio, run the app on the emulator and tap **"Beispiel laden"** on
   the empty home screen so there's realistic demo content.
2. Take a screenshot with the emulator toolbar **camera icon** (or `Ctrl/Cmd+S`
   in the emulator) — it saves a PNG.
3. Suggested shots:
   - **Home / party list** (with the demo party)
   - **Party detail** — hero, guest list, shopping list
   - **Share as image** — tap "Als Bild teilen"; the light invitation card
   - **Settings** — appearance (light/dark), language, the support link
   - **Invitations** — the paste/inbox screen
4. Optional: a couple of the same screens in **dark mode** for variety.

Drop the PNGs into a `screenshots/` folder here (gitignored is fine) and upload
them in the Play Console.
