import { parseM3U } from "@/lib/m3u/parser";
import { readJSON, writeJSON, readString, writeString } from "@/lib/storage";
import { DEFAULT_PLAYLIST_URL, STORAGE_KEYS } from "@/config";
import type { Channel } from "@/types/channel";

export interface PlaylistResult {
  channels: Channel[];
  updatedAt: number;
}

export function getCachedPlaylist(): PlaylistResult | null {
  const channels = readJSON<Channel[] | null>(STORAGE_KEYS.playlistCache, null);
  const updatedAtRaw = readString(STORAGE_KEYS.playlistUpdatedAt, "");
  if (!channels || channels.length === 0 || !updatedAtRaw) return null;
  const updatedAt = Number(updatedAtRaw);
  if (!Number.isFinite(updatedAt)) return null;
  return { channels, updatedAt };
}

function cachePlaylist(channels: Channel[], updatedAt: number) {
  writeJSON(STORAGE_KEYS.playlistCache, channels);
  writeString(STORAGE_KEYS.playlistUpdatedAt, String(updatedAt));
}

export async function fetchPlaylist(playlistUrl: string = DEFAULT_PLAYLIST_URL): Promise<PlaylistResult> {
  const proxyUrl = `/api/playlist?url=${encodeURIComponent(playlistUrl)}`;

  let response: Response;
  try {
    response = await fetch(proxyUrl, { cache: "no-store" });
  } catch {
    throw new Error("network");
  }

  if (!response.ok) {
    throw new Error(response.status === 502 || response.status === 504 ? "network" : "playlist");
  }

  const text = await response.text();
  const channels = parseM3U(text);

  if (channels.length === 0) {
    throw new Error("empty");
  }

  const updatedAt = Date.now();
  cachePlaylist(channels, updatedAt);
  return { channels, updatedAt };
}
