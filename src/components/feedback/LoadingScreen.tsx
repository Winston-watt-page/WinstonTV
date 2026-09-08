"use client";

import { useI18n } from "@/i18n";
import { APP_NAME } from "@/config";

export function LoadingScreen() {
  const { t } = useI18n();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-marigold-500 animate-pulseLive" />
        <h1 className="text-2xl font-semibold tracking-tight text-mist-100">{APP_NAME}</h1>
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-ink-700">
        <div className="h-full w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-marigold-400 to-transparent bg-[length:400px_100%]" />
      </div>
      <p className="text-sm text-mist-500">{t("loadingChannels")}</p>
    </div>
  );
}
