"use client";

import { useI18n } from "@/i18n";
import { APP_NAME } from "@/config";

export function AboutView() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      <h1 className="text-lg font-medium text-mist-100">
        {t("about")} {APP_NAME}
      </h1>
      <p className="text-sm text-mist-400">{t("winstonTvAbout")}</p>
      <p className="text-sm text-mist-400">{t("poweredByPublicPlaylist")}</p>
      <p className="text-xs text-mist-700">
        Playlist source: iptv-org (github.com/iptv-org/iptv). Individual streams are
        provided by third parties and may vary in availability.
      </p>
    </div>
  );
}
