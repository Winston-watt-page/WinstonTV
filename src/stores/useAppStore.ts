"use client";

import { create } from "zustand";
import type {
  AppLanguage,
  Channel,
  PlaylistStatus,
  QualityLevel,
} from "@/types/channel";
import { RECENTLY_WATCHED_LIMIT, STORAGE_KEYS } from "@/config";
import { readJSON, readString, writeJSON, writeString } from "@/lib/storage";

interface AppState {
  // Playlist
  channels: Channel[];
  playlistStatus: PlaylistStatus;
  playlistError: string | null;
  playlistUpdatedAt: number | null;
  setChannels: (channels: Channel[], updatedAt: number) => void;
  setPlaylistStatus: (status: PlaylistStatus, error?: string | null) => void;

  // Selection / navigation
  currentChannelId: string | null;
  selectChannel: (id: string) => void;

  selectedCategory: string;
  setCategory: (category: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Favorites
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Recently watched
  recentlyWatchedIds: string[];
  pushRecentlyWatched: (id: string) => void;

  // Settings
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  quality: QualityLevel;
  setQuality: (q: QualityLevel) => void;

  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;

  // UI state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isFullscreen: boolean;
  setFullscreen: (open: boolean) => void;
  activeView: "home" | "favorites" | "categories" | "settings" | "about";
  setActiveView: (view: AppState["activeView"]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  channels: [],
  playlistStatus: "idle",
  playlistError: null,
  playlistUpdatedAt: null,
  setChannels: (channels, updatedAt) =>
    set({ channels, playlistUpdatedAt: updatedAt, playlistStatus: "ready", playlistError: null }),
  setPlaylistStatus: (status, error = null) => set({ playlistStatus: status, playlistError: error }),

  currentChannelId: null,
  selectChannel: (id) => {
    set({ currentChannelId: id });
    get().pushRecentlyWatched(id);
    writeString(STORAGE_KEYS.lastChannelId, id);
  },

  selectedCategory: "All",
  setCategory: (category) => set({ selectedCategory: category }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  favoriteIds: [],
  toggleFavorite: (id) => {
    const current = get().favoriteIds;
    const next = current.includes(id)
      ? current.filter((f) => f !== id)
      : [...current, id];
    set({ favoriteIds: next });
    writeJSON(STORAGE_KEYS.favorites, next);
  },
  isFavorite: (id) => get().favoriteIds.includes(id),

  recentlyWatchedIds: [],
  pushRecentlyWatched: (id) => {
    const current = get().recentlyWatchedIds.filter((c) => c !== id);
    const next = [id, ...current].slice(0, RECENTLY_WATCHED_LIMIT);
    set({ recentlyWatchedIds: next });
    writeJSON(STORAGE_KEYS.recentlyWatched, next);
  },

  language: "en",
  setLanguage: (lang) => {
    set({ language: lang });
    writeString(STORAGE_KEYS.language, lang);
  },

  quality: "auto",
  setQuality: (q) => {
    set({ quality: q });
    writeString(STORAGE_KEYS.quality, q);
  },

  volume: 1,
  setVolume: (v) => {
    set({ volume: v });
    writeString(STORAGE_KEYS.volume, String(v));
  },
  muted: false,
  setMuted: (m) => set({ muted: m }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  isFullscreen: false,
  setFullscreen: (open) => set({ isFullscreen: open }),
  activeView: "home",
  setActiveView: (view) => set({ activeView: view, isMobileMenuOpen: false }),
}));

/** Hydrates persisted preferences from LocalStorage. Call once on mount. */
export function hydrateAppStore() {
  const favoriteIds = readJSON<string[]>(STORAGE_KEYS.favorites, []);
  const recentlyWatchedIds = readJSON<string[]>(STORAGE_KEYS.recentlyWatched, []);
  const language = readString(STORAGE_KEYS.language, "en") as AppLanguage;
  const quality = readString(STORAGE_KEYS.quality, "auto") as QualityLevel;
  const volume = parseFloat(readString(STORAGE_KEYS.volume, "1"));
  const lastChannelId = readString(STORAGE_KEYS.lastChannelId, "");

  useAppStore.setState({
    favoriteIds,
    recentlyWatchedIds,
    language,
    quality,
    volume: Number.isFinite(volume) ? volume : 1,
    currentChannelId: lastChannelId || null,
  });
}
