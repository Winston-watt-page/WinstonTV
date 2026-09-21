"use client";

import { useI18n } from "@/i18n";
import { PremiumBanner } from "../premium/PremiumBanner";

export function PremiumView() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-lg font-medium text-mist-100">{t("premium")}</h1>
      <PremiumBanner />
      
      <div className="rounded-2xl border border-white/5 bg-ink-800 p-4 sm:p-6">
        <h2 className="text-base font-semibold text-mist-100 mb-3">{t("premiumPrice")}</h2>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-marigold-400">$4.99</span>
          <span className="text-sm text-mist-400">/month</span>
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-marigold-500 px-4 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-marigold-400 focus:outline-none focus-visible:shadow-focus"
        >
          {t("subscribeNow")}
        </button>
      </div>
    </div>
  );
}
