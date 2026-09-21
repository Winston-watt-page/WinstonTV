"use client";

import { useI18n } from "@/i18n";

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-mist-500">{t("language")}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLang("ta")}
          aria-pressed={lang === "ta"}
          className={`flex-1 rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-tamil transition-colors ${
            lang === "ta"
              ? "border-marigold-500 bg-marigold-500/15 text-marigold-400"
              : "border-white/10 text-mist-300 hover:border-white/20"
          }`}
        >
          {t("tamil")}
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
          className={`flex-1 rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm transition-colors ${
            lang === "en"
              ? "border-marigold-500 bg-marigold-500/15 text-marigold-400"
              : "border-white/10 text-mist-300 hover:border-white/20"
          }`}
        >
          {t("english")}
        </button>
      </div>
    </div>
  );
}
