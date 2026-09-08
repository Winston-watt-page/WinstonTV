"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Channel } from "@/types/channel";
import { ChannelCard } from "./ChannelCard";
import { EmptyState } from "../feedback/EmptyState";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";

interface ChannelGridProps {
  channels: Channel[];
  emptyTitleKey?: "noResultsTitle" | "noFavoritesTitle";
  emptyBodyKey?: "noResultsBody" | "noFavoritesBody";
}

const CHUNK_SIZE = 60;

export function ChannelGrid({
  channels,
  emptyTitleKey = "noResultsTitle",
  emptyBodyKey = "noResultsBody",
}: ChannelGridProps) {
  const { t } = useI18n();
  const currentChannelId = useAppStore((s) => s.currentChannelId);
  const selectChannel = useAppStore((s) => s.selectChannel);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  // Reset pagination and focus whenever the underlying list changes.
  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
    setFocusIndex(0);
  }, [channels]);

  const visible = useMemo(() => channels.slice(0, visibleCount), [channels, visibleCount]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const cards = containerRef.current?.querySelectorAll<HTMLButtonElement>("[data-channel-card]");
    if (!cards || cards.length === 0) return;

    let next = focusIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = Math.min(focusIndex + 1, cards.length - 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = Math.max(focusIndex - 1, 0);
    } else if (e.key === "Escape") {
      (document.activeElement as HTMLElement)?.blur();
      return;
    } else {
      return;
    }

    setFocusIndex(next);
    cards[next]?.focus();
  }

  if (channels.length === 0) {
    return <EmptyState titleKey={emptyTitleKey} bodyKey={emptyBodyKey} />;
  }

  return (
    <div
      ref={containerRef}
      role="grid"
      aria-label={t("channelList")}
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {visible.map((channel, i) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          isActive={channel.id === currentChannelId}
          isFavorite={favoriteIds.includes(channel.id)}
          onSelect={selectChannel}
          onToggleFavorite={toggleFavorite}
          tabIndex={i === focusIndex ? 0 : -1}
        />
      ))}

      {visibleCount < channels.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + CHUNK_SIZE)}
          className="col-span-full mt-2 rounded-lg border border-white/10 py-3 text-sm text-mist-300 hover:bg-ink-700 focus:outline-none focus-visible:shadow-focus"
        >
          {t("showMoreChannels")}
        </button>
      )}
    </div>
  );
}
