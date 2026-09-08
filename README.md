# WinstonTV

A free, no-signup live Tamil television viewer for the web. WinstonTV loads a
public Tamil M3U playlist automatically, parses it into a clean channel list,
and gets you watching in two taps — no account, no backend database.

## Features

- Automatic Tamil playlist loading on startup (no upload required)
- Fast HLS playback via `hls.js` with auto quality, manual quality selection,
  auto-retry, and graceful per-channel error handling
- Client-side search, category browser, favorites, and recently watched —
  all persisted in `localStorage`
- Responsive layouts for mobile, tablet, laptop, desktop, and TV/keyboard
  navigation (arrow keys, Enter, Escape)
- Tamil-first UI with an English toggle
- Installable PWA (app shell cached; live streams are never cached)
- Ready to deploy to Vercel with zero configuration

## 1. Install dependencies

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Tamil playlist
(`https://iptv-org.github.io/iptv/languages/tam.m3u`) loads automatically.

## 3. Build for production

```bash
npm run build
npm start
```

## 4. Deploy to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. Import the repository in the [Vercel dashboard](https://vercel.com/new),
   or run:
   ```bash
   npx vercel
   ```
3. Vercel auto-detects the Next.js framework using the included
   `vercel.json`. No extra build configuration is required.

## 5. Configure environment variables

Copy `.env.example` to `.env.local` for local overrides:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_DEFAULT_PLAYLIST_URL` | The M3U playlist WinstonTV loads on startup | `https://iptv-org.github.io/iptv/languages/tam.m3u` |

On Vercel, set this under **Project Settings → Environment Variables** if you
want to override the default playlist in production.

## 6. Change the default playlist

Two ways to change which playlist loads by default:

- **Environment variable (recommended for deployments):** set
  `NEXT_PUBLIC_DEFAULT_PLAYLIST_URL` as described above.
- **Code default:** edit `DEFAULT_PLAYLIST_URL` in `src/config/index.ts`.

Any standard M3U/M3U8 playlist with `#EXTINF` metadata (`tvg-id`,
`tvg-name`, `tvg-logo`, `tvg-language`, `tvg-country`, `group-title`) is
supported. Users can also refresh the playlist at any time from
**Settings → Refresh Channels**.

## Project structure

```
app/                      Next.js App Router pages & API routes
  api/playlist/route.ts   Server-side M3U proxy (sidesteps browser CORS)
src/
  components/
    channels/              Channel cards, grid, categories, recently watched
    player/                Video player, controls, quality selector
    layout/                App shell, top bar, sidebar, mobile menu
    views/                 Home, Favorites, Categories, Settings, About
    settings/               Language selector, settings panel
    search/                 Search bar
    feedback/               Loading, error, empty states
  hooks/                   usePlaylist, useHlsPlayer
  lib/
    m3u/                   M3U parser (sanitizes untrusted playlist input)
    storage/                LocalStorage helpers
  services/playlist/        Fetch + cache orchestration
  stores/                   Zustand app store
  i18n/                     Tamil/English translation dictionary
  types/                    Shared TypeScript types
  config/                   Central configuration (playlist URL, etc.)
public/
  manifest.webmanifest      PWA manifest
  sw.js                      Service worker (app shell only, never streams)
```

## Notes on IPTV streams

Individual channels in any public M3U playlist may go offline, be
geo-restricted, or fail due to CORS depending on the origin server.
WinstonTV isolates stream failures to the player only — the rest of the app
keeps working, and you can switch to another channel immediately or hit
Retry.

## Tech stack

Next.js (App Router) · TypeScript (strict) · React · Tailwind CSS ·
hls.js · Zustand · lucide-react
