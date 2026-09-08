import type { Channel } from "@/types/channel";
import { CATEGORY_FALLBACK } from "@/config";

/**
 * Parses M3U/M3U8 playlist text into a clean, sanitized channel list.
 * The playlist is treated as untrusted input: nothing here is ever
 * evaluated as code, and every field is sanitized before use.
 */

const EXTINF_ATTR_RE = /([a-zA-Z0-9-]+)="([^"]*)"/g;

function sanitizeText(value: string | undefined | null): string {
  if (!value) return "";
  // Strip control characters and anything that looks like markup/script.
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

function isSafeStreamUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeLogoUrl(url: string | undefined): string | null {
  if (!url) return null;
  const cleaned = url.trim();
  if (!isSafeStreamUrl(cleaned)) return null;
  return cleaned;
}

function mapGroupToCategory(rawGroup: string): string {
  const g = rawGroup.toLowerCase();
  if (!g) return CATEGORY_FALLBACK;
  if (g.includes("news")) return "News";
  if (g.includes("movie") || g.includes("cinema") || g.includes("film")) return "Movies";
  if (g.includes("music") || g.includes("song")) return "Music";
  if (g.includes("sport")) return "Sports";
  if (g.includes("kid") || g.includes("cartoon") || g.includes("child")) return "Kids";
  if (g.includes("religio") || g.includes("devotion") || g.includes("god") || g.includes("temple"))
    return "Religious";
  if (g.includes("entertain") || g.includes("general") || g.includes("family"))
    return "Entertainment";
  if (g.includes("region") || g.includes("local")) return "Regional";
  return CATEGORY_FALLBACK;
}

function parseAttrs(line: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let match: RegExpExecArray | null;
  EXTINF_ATTR_RE.lastIndex = 0;
  while ((match = EXTINF_ATTR_RE.exec(line)) !== null) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

function makeId(tvgId: string, url: string, name: string, fallbackIndex: number): string {
  const base = tvgId || url || name || String(fallbackIndex);
  // Small deterministic hash so ids are stable across refreshes.
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return `ch_${hash.toString(36)}`;
}

export function parseM3U(raw: string): Channel[] {
  if (!raw || typeof raw !== "string") return [];

  const lines = raw.split(/\r?\n/);
  const channels: Channel[] = [];

  let pendingName = "";
  let pendingAttrs: Record<string, string> = {};
  let index = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF")) {
      const commaIdx = line.indexOf(",");
      pendingAttrs = parseAttrs(line);
      pendingName = sanitizeText(commaIdx >= 0 ? line.slice(commaIdx + 1) : "");
      continue;
    }

    if (line.startsWith("#")) {
      // Any other directive (#EXTM3U, #EXTGRP, #EXTVLCOPT, ...) is ignored
      // for playback purposes but never executed.
      continue;
    }

    // A non-comment, non-empty line is treated as the stream URL.
    const url = line;
    if (!isSafeStreamUrl(url)) {
      pendingName = "";
      pendingAttrs = {};
      continue;
    }

    const tvgId = sanitizeText(pendingAttrs["tvg-id"]);
    const tvgName = sanitizeText(pendingAttrs["tvg-name"]);
    const name = pendingName || tvgName || "Unnamed Channel";
    const group = mapGroupToCategory(sanitizeText(pendingAttrs["group-title"]));
    const language = sanitizeText(pendingAttrs["tvg-language"]) || null;
    const country = sanitizeText(pendingAttrs["tvg-country"]) || null;
    const logo = sanitizeLogoUrl(pendingAttrs["tvg-logo"]);

    channels.push({
      id: makeId(tvgId, url, name, index),
      name,
      url,
      logo,
      group,
      language,
      country,
      tvgId: tvgId || null,
      tvgName: tvgName || null,
    });

    index += 1;
    pendingName = "";
    pendingAttrs = {};
  }

  return channels;
}
