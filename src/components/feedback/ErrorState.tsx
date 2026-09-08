"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/translations";

interface ErrorStateProps {
  titleKey: TranslationKey;
  onRetry: () => void;
}

export function ErrorState({ titleKey, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="rounded-full bg-ink-700 p-4">
        <AlertTriangle className="h-6 w-6 text-marigold-500" aria-hidden="true" />
      </div>
      <p className="max-w-sm text-sm text-mist-300">{t(titleKey)}</p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-full bg-marigold-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-marigold-400 focus:outline-none focus-visible:shadow-focus"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        {t("retry")}
      </button>
    </div>
  );
}
