"use client";

import { forwardRef } from "react";
import { Heart } from "lucide-react";
import type { Channel } from "@/types/channel";
import { ChannelLogo } from "./ChannelLogo";
import { useI18n } from "@/i18n";

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  tabIndex?: number;
}

export const ChannelCard = forwardRef<HTMLButtonElement, ChannelCardProps>(
  ({ channel, isActive, isFavorite, onSelect, onToggleFavorite, tabIndex = -1 }, ref) => {
    const { t } = useI18n();

    return (
      <button
        ref={ref}
        type="button"
        data-channel-card
        tabIndex={tabIndex}
        onClick={() => onSelect(channel.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSelect(channel.id);
        }}
        className={`group relative flex w-full flex-col gap-2 sm:gap-3 rounded-xl border p-2 sm:p-3 text-left transition-colors
          focus:outline-none focus-visible:shadow-focus
          ${
            isActive
              ? "border-marigold-500 bg-ink-700"
              : "border-white/5 bg-ink-800 hover:border-white/15 hover:bg-ink-700"
          }`}
        aria-pressed={isActive}
        aria-label={`${channel.name}${isActive ? `, ${t("live")}` : ""}`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <ChannelLogo src={channel.logo} name={channel.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs sm:text-sm font-medium text-mist-100">{channel.name}</p>
            <p className="truncate text-[10px] sm:text-xs text-mist-500">
              {channel.group}
              {channel.language ? ` · ${channel.language}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isActive ? (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-signal-live">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-live animate-pulseLive" />
              {t("live")}
            </span>
          ) : (
            <span />
          )}

          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(channel.id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`rounded-full p-1.5 transition-colors ${
              isFavorite ? "text-marigold-400" : "text-mist-700 hover:text-mist-300"
            }`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </span>
        </div>
      </button>
    );
  }
);

ChannelCard.displayName = "ChannelCard";
