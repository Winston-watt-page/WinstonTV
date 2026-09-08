"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { deriveCategories, filterByCategory, filterBySearch } from "@/lib/channelUtils";
import { ChannelGrid } from "../channels/ChannelGrid";
import { CategoryTabs } from "../channels/CategoryTabs";

export function CategoriesView() {
  const { t } = useI18n();
  const channels = useAppStore((s) => s.channels);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const searchQuery = useAppStore((s) => s.searchQuery);

  const categories = useMemo(() => deriveCategories(channels), [channels]);

  const visible = useMemo(() => {
    const byCategory = filterByCategory(channels, selectedCategory);
    return filterBySearch(byCategory, searchQuery);
  }, [channels, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-medium text-mist-100">{t("categories")}</h1>
      <CategoryTabs categories={categories} />
      <ChannelGrid channels={visible} />
    </div>
  );
}
