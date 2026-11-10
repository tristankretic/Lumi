# LUMI Life

Native Android/iOS prototype built with React Native, Expo SDK 58, Expo Router and TypeScript. Slovenian interface, dark theme, lavender accents, Manrope/Inter fonts. This is a mobile application, not a website.

## Run on an Android phone

1. Install Node.js LTS and npm on your computer.
2. Open a terminal in this folder.
3. Run `npm install` (or `pnpm install` using the included pnpm lockfile).
4. Install an Expo Go version supporting SDK 58 on your phone.
5. Run `npx expo start --go` and scan the QR code in Expo Go. Phone and computer should use the same Wi-Fi.
6. If Expo Go on your phone does not support SDK 58, use a development build: `npx expo install expo-dev-client`, then `npx eas-cli build --profile development --platform android` and `npx expo start --dev-client`. EAS build requires your Expo account and Android build configuration; no build was submitted automatically.

On this Codex computer npm is not on PATH. The installed package manager can be invoked with:

```powershell
node 'C:\Users\Tristan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs' start --go
```

For a standalone Android APK: `npx eas-cli build --profile preview --platform android`. iOS builds require Apple signing. `eas.json` contains development, preview and production profiles.

## Implemented

- Onboarding and local demo with explicitly fictional examples.
- Five native tabs: Domov, Arhiv, Dodaj, Časovnica, Profil.
- Guided questions that skip already answered questions.
- Create/edit/delete written memories; favorites; search and media filters.
- Real microphone recording with permission request, live metering, timer, pause/resume, stop and playback.
- Image/video selection, still-photo camera capture, video playback.
- Durable app-document copies of attachments; SQLite metadata; debounced drafts and back-navigation protection.
- Chronological timeline, exact dates or approximate years.
- Demonstration family invitation list; no emails sent and no real sharing granted.
- Reminder preferences; notifications are not scheduled yet.
- Text/metadata JSON export through native share dialog. This is not a complete media backup.
- Optional real Supabase email/password sign-up and login; secure session storage. It does not sync local memories yet.
- Static, clearly labeled Legacy preview with fictional source.

## Supabase configuration

Copy `.env.example` to `.env`, add your Supabase project URL and publishable/anon key, and restart Expo. Do not put a service-role key in the application. Without these settings the demo remains usable; authentication reports that the backend is not configured.

`supabase/schema.sql` provides the phase-2 schema, ownership and explicit per-memory sharing RLS policies, plus private Storage policies. Review and test it against a development Supabase project before using real data. The app does not apply this schema automatically. Email invitation delivery, acceptance, authenticated cloud archive/sync, cloud account deletion, and server access tests remain phase-2 work. Signing in does not turn this local prototype into a secure multi-account archive: everyone using this installation sees the same local demo store.

## Data and limitations

New entries are device-local, never advertised as cloud backed-up. Uninstalling may remove them. Local SQLite is not encrypted; end-to-end encryption and biometric lock are not implemented. Removing a memory removes its metadata, while attachment files remain inside the application container until uninstall; storage cleanup is future work. Do not use this prototype as the sole copy of valuable memories.

The central Dodaj tab opens an animated native modal sheet with four creation actions. Full offline cloud synchronization, profile-photo editing, English localization, push delivery, and production recovery flows are not implemented.

## Validation

```sh
npm run typecheck
npm test
npx expo export --platform android --output-dir build-android
```

The JavaScript export checks Metro/native module resolution, not native compilation or device permissions. Real microphone, camera, keyboard, safe-area and restart persistence testing must be performed on a physical device. No APK or App Store submission is included.

Device checklist: enter demo → answer a question → record/pause/resume/stop → preview → save → find in archive → open in timeline → edit/favorite → restart and verify → deny microphone permission and try text → inspect demo family access → export text. Verify interruption/background behavior and available disk storage before recording long stories.

## Structure

- `app/`: Expo Router routes and tab navigation
- `src/ui.tsx`: shared native components and theme
- `src/store.tsx`: SQLite-backed local state
- `src/data.ts`: memory model, questions and fictional demo data
- `src/media.tsx`: native recording and media playback
- `src/supabase.ts`: optional auth client and SecureStore adapter
- `supabase/schema.sql`: phase-2 database foundation

Audio API reference: https://docs.expo.dev/versions/v58.0.0/sdk/audio/
