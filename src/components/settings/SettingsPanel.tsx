"use client";

import { RefreshCw } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { LanguageSelector } from "./LanguageSelector";
import { usePlaylist } from "@/hooks/usePlaylist";
import type { QualityLevel } from "@/types/channel";

const QUALITY_OPTIONS: QualityLevel[] = ["auto", "1080p", "720p", "576p", "480p", "360p"];

export function SettingsPanel() {
  const { t } = useI18n();
  const quality = useAppStore((s) => s.quality);
  const setQuality = useAppStore((s) => s.setQuality);
  const playlistUpdatedAt = useAppStore((s) => s.playlistUpdatedAt);
  const channelCount = useAppStore((s) => s.channels.length);
  const { refresh } = usePlaylist();

  return (
    <div className="flex flex-col gap-6">
      <LanguageSelector />

      <div>
        <p className="mb-2 text-xs font-medium text-mist-500">{t("videoQuality")}</p>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              aria-pressed={quality === q}
              className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                quality === q
                  ? "border-marigold-500 bg-marigold-500/15 text-marigold-400"
                  : "border-white/10 text-mist-300 hover:border-white/20"
              }`}
            >
              {q === "auto" ? t("auto") : q}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] text-mist-700">
          Applied when the active stream offers that quality.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-mist-100">{channelCount} {t("channelsAvailable")}</p>
            {playlistUpdatedAt && (
              <p className="text-[11px] text-mist-500">
                {t("lastUpdated")}: {new Date(playlistUpdatedAt).toLocaleString()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-mist-100 hover:bg-white/5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t("refreshChannels")}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-3 text-xs text-mist-500">
        <p className="font-medium text-mist-300">{t("about")}</p>
        <p className="mt-1">{t("winstonTvAbout")}</p>
        <p className="mt-1">{t("poweredByPublicPlaylist")}</p>
      </div>
    </div>
  );
}
