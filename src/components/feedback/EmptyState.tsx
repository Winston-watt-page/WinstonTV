"use client";

import { Inbox } from "lucide-react";
import { useI18n } from "@/i18n";
import type { TranslationKey } from "@/i18n/translations";

interface EmptyStateProps {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}

export function EmptyState({ titleKey, bodyKey }: EmptyStateProps) {
  const { t } = useI18n();
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 py-16 text-center">
      <Inbox className="h-8 w-8 text-mist-700" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-mist-100">{t(titleKey)}</p>
        <p className="mt-1 text-xs text-mist-500">{t(bodyKey)}</p>
      </div>
    </div>
  );
}
