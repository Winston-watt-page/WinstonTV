"use client";

import { useState } from "react";
import { Settings2, Check } from "lucide-react";
import type { HlsVariant, QualityLevel } from "@/types/channel";
import { useI18n } from "@/i18n";

interface QualitySelectorProps {
  variants: HlsVariant[];
  activeQuality: QualityLevel;
  onSelect: (q: QualityLevel) => void;
}

export function QualitySelector({ variants, activeQuality, onSelect }: QualitySelectorProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  // A single-quality (or non-adaptive) stream has nothing meaningful to switch between.
  if (variants.length <= 1) return null;

  const uniqueLabels = Array.from(new Set(variants.map((v) => v.label))).sort((a, b) => {
    const order = ["1080p", "720p", "576p", "480p", "360p"];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("videoQuality")}
        aria-expanded={open}
        className="rounded-full p-2 text-mist-100 hover:bg-white/10 focus:outline-none focus-visible:shadow-focus"
      >
        <Settings2 className="h-5 w-5" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 mb-2 w-36 overflow-hidden rounded-lg border border-white/10 bg-ink-800 py-1 shadow-xl"
        >
          <button
            role="menuitemradio"
            aria-checked={activeQuality === "auto"}
            onClick={() => {
              onSelect("auto");
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-mist-100 hover:bg-white/5"
          >
            {t("auto")}
            {activeQuality === "auto" && <Check className="h-3.5 w-3.5 text-marigold-400" />}
          </button>
          {uniqueLabels.map((label) => (
            <button
              key={label}
              role="menuitemradio"
              aria-checked={activeQuality === label}
              onClick={() => {
                onSelect(label as QualityLevel);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-mist-100 hover:bg-white/5"
            >
              {label}
              {activeQuality === label && <Check className="h-3.5 w-3.5 text-marigold-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
