"use client";

import { Home, Tv, Heart, LayoutGrid, Settings, Info } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { APP_NAME } from "@/config";

const NAV_ITEMS = [
  { view: "home" as const, icon: Home, labelKey: "home" as const },
  { view: "home" as const, icon: Tv, labelKey: "liveTv" as const },
  { view: "favorites" as const, icon: Heart, labelKey: "favorites" as const },
  { view: "categories" as const, icon: LayoutGrid, labelKey: "categories" as const },
  { view: "settings" as const, icon: Settings, labelKey: "settings" as const },
  { view: "about" as const, icon: Info, labelKey: "about" as const },
];

export function Sidebar() {
  const { t } = useI18n();
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);

  return (
    <nav
      aria-label={APP_NAME}
      className="hidden w-56 shrink-0 flex-col gap-1 border-r border-white/5 p-3 sm:p-4 md:flex"
    >
      {NAV_ITEMS.map(({ view, icon: Icon, labelKey }, i) => (
        <button
          key={`${view}-${i}`}
          type="button"
          onClick={() => setActiveView(view)}
          aria-current={activeView === view ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 sm:px-3 sm:py-2.5 text-sm transition-colors focus:outline-none focus-visible:shadow-focus ${
            activeView === view
              ? "bg-ink-700 text-marigold-400"
              : "text-mist-300 hover:bg-ink-700/60 hover:text-mist-100"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {t(labelKey)}
        </button>
      ))}
    </nav>
  );
}
