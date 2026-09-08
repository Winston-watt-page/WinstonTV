"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { fetchPlaylist, getCachedPlaylist } from "@/services/playlist/playlistService";
import { DEFAULT_PLAYLIST_URL, PLAYLIST_REFRESH_INTERVAL_MS } from "@/config";

export function usePlaylist() {
  const setChannels = useAppStore((s) => s.setChannels);
  const setPlaylistStatus = useAppStore((s) => s.setPlaylistStatus);
  const playlistStatus = useAppStore((s) => s.playlistStatus);
  const hasLoadedRef = useRef(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) setPlaylistStatus("loading");
      try {
        const { channels, updatedAt } = await fetchPlaylist(DEFAULT_PLAYLIST_URL);
        setChannels(channels, updatedAt);
      } catch (error) {
        const reason = (error as Error).message;
        const message =
          reason === "network" ? "network" : reason === "empty" ? "empty" : "playlist";
        // On a background refresh, keep showing whatever we already have.
        if (!isRefresh) {
          setPlaylistStatus("error", message);
        }
      }
    },
    [setChannels, setPlaylistStatus]
  );

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const cached = getCachedPlaylist();
    if (cached) {
      setChannels(cached.channels, cached.updatedAt);
      // Refresh quietly in the background without showing a loading screen.
      load(true);
    } else {
      load(false);
    }

    const interval = setInterval(() => load(true), PLAYLIST_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { playlistStatus, refresh: () => load(false) };
}
