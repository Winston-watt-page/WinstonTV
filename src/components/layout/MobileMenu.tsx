"use client";

import { useEffect, useRef } from "react";
import { Home, Heart, LayoutGrid, Settings, Info, X } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";

const ITEMS = [
  { view: "home" as const, icon: Home, labelKey: "channelList" as const },
  { view: "categories" as const, icon: LayoutGrid, labelKey: "categories" as const },
  { view: "favorites" as const, icon: Heart, labelKey: "favorites" as const },
  { view: "settings" as const, icon: Settings, labelKey: "playerSettings" as const },
  { view: "about" as const, icon: Info, labelKey: "about" as const },
];

export function MobileMenu() {
  const { t } = useI18n();
  const isOpen = useAppStore((s) => s.isMobileMenuOpen);
  const setOpen = useAppStore((s) => s.setMobileMenuOpen);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={t("menu")}>
      <button
        type="button"
        aria-label={t("close")}
        className="absolute inset-0 bg-black/60 animate-fadeIn"
        onClick={() => setOpen(false)}
      />
      <div
        ref={sheetRef}
        className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-white/10 bg-ink-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] animate-fadeIn"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-mist-100">{t("menu")}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="rounded-full p-1.5 text-mist-400 hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ITEMS.map(({ view, icon: Icon, labelKey }) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/5 bg-ink-700 py-4 text-mist-200 hover:border-white/15"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
