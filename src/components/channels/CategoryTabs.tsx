"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/translations";

const CATEGORY_LABEL_KEYS: Record<string, TranslationKey> = {
  All: "all",
};

interface CategoryTabsProps {
  categories: string[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const { t } = useI18n();
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setCategory = useAppStore((s) => s.setCategory);

  return (
    <div
      role="tablist"
      aria-label={t("categories")}
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {categories.map((cat) => {
        const isActive = cat === selectedCategory;
        const label = CATEGORY_LABEL_KEYS[cat] ? t(CATEGORY_LABEL_KEYS[cat]) : cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors focus:outline-none focus-visible:shadow-focus ${
              isActive
                ? "border-marigold-500 bg-marigold-500/15 text-marigold-400"
                : "border-white/5 bg-ink-700 text-mist-300 hover:border-white/15"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
