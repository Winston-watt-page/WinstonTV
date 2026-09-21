"use client";

import { Crown, Check } from "lucide-react";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/translations";

export function PremiumBanner() {
  const { t } = useI18n();

  const features = [
    { key: "adFree" as TranslationKey, icon: Check },
    { key: "hdQuality" as TranslationKey, icon: Check },
    { key: "dvr" as TranslationKey, icon: Check },
    { key: "exclusiveChannels" as TranslationKey, icon: Check },
  ];

  return (
    <section className="rounded-2xl border border-marigold-500/30 bg-gradient-to-br from-marigold-500/10 via-marigold-500/5 to-ink-800 p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-marigold-500 text-ink-950">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-marigold-400 sm:text-xl">{t("premium")}</h2>
          <p className="text-xs text-mist-400">{t("premiumFeatures")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {features.map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-marigold-400 flex-shrink-0" />
            <span className="text-sm text-mist-300">{t(key)}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-marigold-500 px-4 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-marigold-400 focus:outline-none focus-visible:shadow-focus"
      >
        {t("getPremium")}
      </button>
    </section>
  );
}
