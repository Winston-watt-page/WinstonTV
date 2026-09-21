"use client";

import { Heart, MoreVertical, Search as SearchIcon, Tv } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";
import { APP_NAME } from "@/config";
import { SearchBar } from "../search/SearchBar";

export function TopBar() {
  const { t } = useI18n();
  const setActiveView = useAppStore((s) => s.setActiveView);
  const activeView = useAppStore((s) => s.activeView);
  const isMobileMenuOpen = useAppStore((s) => s.isMobileMenuOpen);
  const setMobileMenuOpen = useAppStore((s) => s.setMobileMenuOpen);
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/90 backdrop-blur">
      <div className="flex h-12 sm:h-14 items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6">
        <button
          type="button"
          onClick={() => setActiveView("home")}
          className="flex items-center gap-2 focus:outline-none focus-visible:shadow-focus rounded-md"
          aria-label={`${APP_NAME}, ${t("home")}`}
        >
          <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-marigold-500 text-ink-950">
            <Tv className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-mist-100">{APP_NAME}</span>
        </button>

        {/* Desktop search */}
        <div className="ml-2 sm:ml-4 hidden max-w-sm flex-1 md:block">
          <SearchBar />
        </div>

        <span className="flex-1 md:hidden" />

        {/* Mobile search toggle */}
        <button
          type="button"
          onClick={() => setSearchOpen(!isSearchOpen)}
          aria-label={t("search")}
          className="rounded-full p-1.5 sm:p-2 text-mist-300 hover:bg-white/5 md:hidden"
        >
          <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveView("favorites")}
          aria-label={t("favorites")}
          className={`rounded-full p-1.5 sm:p-2 hover:bg-white/5 ${
            activeView === "favorites" ? "text-marigold-400" : "text-mist-300"
          }`}
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {/* Always-available three-dot menu, prominent on mobile */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={t("menu")}
          aria-haspopup="true"
          aria-expanded={isMobileMenuOpen}
          className="rounded-full p-1.5 sm:p-2 text-mist-300 hover:bg-white/5"
        >
          <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {isSearchOpen && (
        <div className="border-t border-white/5 p-3 md:hidden">
          <SearchBar autoFocus />
        </div>
      )}
    </header>
  );
}
