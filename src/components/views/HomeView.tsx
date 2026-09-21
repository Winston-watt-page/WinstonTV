"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { deriveCategories, filterByCategory, filterBySearch } from "@/lib/channelUtils";
import { ChannelGrid } from "../channels/ChannelGrid";
import { CategoryTabs } from "../channels/CategoryTabs";
import { RecentlyWatched } from "../channels/RecentlyWatched";
import { PremiumBanner } from "../premium/PremiumBanner";
import { APP_NAME } from "@/config";

export function HomeView() {
  const { t } = useI18n();
  const channels = useAppStore((s) => s.channels);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  const categories = useMemo(() => deriveCategories(channels), [channels]);

  const visibleChannels = useMemo(() => {
    const byCategory = filterByCategory(channels, selectedCategory);
    return filterBySearch(byCategory, searchQuery);
  }, [channels, selectedCategory, searchQuery]);

  const favoriteChannels = useMemo(
    () => channels.filter((c) => favoriteIds.includes(c.id)),
    [channels, favoriteIds]
  );

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {!isSearching && (
        <section className="rounded-2xl border border-white/5 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 p-4 sm:p-6 md:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-mist-100 sm:text-2xl md:text-3xl">
            {APP_NAME}
          </h1>
          <p className="mt-2 font-tamil text-sm text-mist-400 sm:text-base">{t("appTagline")}</p>
          <p className="mt-3 sm:mt-4 text-xs text-mist-600">
            {channels.length} {t("channelsAvailable")}
          </p>
        </section>
      )}

      {!isSearching && <PremiumBanner />}

      {!isSearching && <RecentlyWatched />}

      {!isSearching && favoriteChannels.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-mist-300">{t("favorites")}</h2>
          <ChannelGrid channels={favoriteChannels.slice(0, 12)} />
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-mist-300">{t("liveChannels")}</h2>
        </div>
        {!isSearching && (
          <div className="mb-4">
            <CategoryTabs categories={categories} />
          </div>
        )}
        <ChannelGrid channels={visibleChannels} />
      </section>
    </div>
  );
}
