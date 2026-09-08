/**
 * Central configuration for WinstonTV.
 * Keep every environment-tunable constant here so it is never scattered
 * throughout the codebase.
 */

export const DEFAULT_PLAYLIST_URL =
  process.env.NEXT_PUBLIC_DEFAULT_PLAYLIST_URL ||
  "https://iptv-org.github.io/iptv/languages/tam.m3u";

export const APP_NAME = "WinstonTV";

/** How often (ms) the playlist is silently refreshed in the background. */
export const PLAYLIST_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 hours

/** How many recently watched channels to remember. */
export const RECENTLY_WATCHED_LIMIT = 12;

/** How many times the player retries a failed stream automatically. */
export const STREAM_AUTO_RETRY_ATTEMPTS = 3;

export const STREAM_AUTO_RETRY_DELAY_MS = 2500;

/** LocalStorage keys, centralized to avoid collisions/typos. */
export const STORAGE_KEYS = {
  favorites: "winstontv:favorites",
  recentlyWatched: "winstontv:recently-watched",
  language: "winstontv:language",
  quality: "winstontv:quality",
  volume: "winstontv:volume",
  lastChannelId: "winstontv:last-channel",
  playlistCache: "winstontv:playlist-cache",
  playlistUpdatedAt: "winstontv:playlist-updated-at",
} as const;

export const CATEGORY_FALLBACK = "General";

export const KNOWN_CATEGORIES = [
  "All",
  "News",
  "Entertainment",
  "Movies",
  "Music",
  "Sports",
  "Kids",
  "Religious",
  "Regional",
  "General",
] as const;
