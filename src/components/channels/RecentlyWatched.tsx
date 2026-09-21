"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { ChannelLogo } from "./ChannelLogo";

export function RecentlyWatched() {
  const { t } = useI18n();
  const channels = useAppStore((s) => s.channels);
  const recentlyWatchedIds = useAppStore((s) => s.recentlyWatchedIds);
  const currentChannelId = useAppStore((s) => s.currentChannelId);
  const selectChannel = useAppStore((s) => s.selectChannel);

  const recent = useMemo(() => {
    const map = new Map(channels.map((c) => [c.id, c]));
    return recentlyWatchedIds.map((id) => map.get(id)).filter(Boolean);
  }, [channels, recentlyWatchedIds]);

  if (recent.length === 0) return null;

  return (
    <section aria-label={t("recentlyWatched")}>
      <h2 className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium text-mist-300">{t("recentlyWatched")}</h2>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {recent.map((channel) => (
          <button
            key={channel!.id}
            type="button"
            onClick={() => selectChannel(channel!.id)}
            className={`flex shrink-0 flex-col items-center gap-1 sm:gap-1.5 rounded-lg p-1.5 sm:p-2 focus:outline-none focus-visible:shadow-focus ${
              channel!.id === currentChannelId ? "bg-ink-700" : "hover:bg-ink-700/60"
            }`}
          >
            <ChannelLogo src={channel!.logo} name={channel!.name} size="md" />
            <span className="w-14 sm:w-16 truncate text-center text-[10px] sm:text-[11px] text-mist-400">
              {channel!.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
