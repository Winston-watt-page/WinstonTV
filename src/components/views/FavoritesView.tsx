"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { filterBySearch } from "@/lib/channelUtils";
import { ChannelGrid } from "../channels/ChannelGrid";

export function FavoritesView() {
  const { t } = useI18n();
  const channels = useAppStore((s) => s.channels);
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const searchQuery = useAppStore((s) => s.searchQuery);

  const favoriteChannels = useMemo(() => {
    const favs = channels.filter((c) => favoriteIds.includes(c.id));
    return filterBySearch(favs, searchQuery);
  }, [channels, favoriteIds, searchQuery]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h1 className="text-base sm:text-lg font-medium text-mist-100">{t("favorites")}</h1>
      <ChannelGrid
        channels={favoriteChannels}
        emptyTitleKey="noFavoritesTitle"
        emptyBodyKey="noFavoritesBody"
      />
    </div>
  );
}
