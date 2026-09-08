export interface Channel {
  id: string;
  name: string;
  url: string;
  logo: string | null;
  group: string;
  language: string | null;
  country: string | null;
  tvgId: string | null;
  tvgName: string | null;
}

export interface ChannelRuntimeMeta {
  isFavorite: boolean;
  lastWatchedAt?: number;
}

export type QualityLevel = "auto" | "1080p" | "720p" | "576p" | "480p" | "360p";

export interface HlsVariant {
  index: number;
  height: number | null;
  bitrate: number;
  label: QualityLevel | string;
}

export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "error"
  | "unavailable";

export type AppLanguage = "ta" | "en";

export type PlaylistStatus = "idle" | "loading" | "ready" | "error";
