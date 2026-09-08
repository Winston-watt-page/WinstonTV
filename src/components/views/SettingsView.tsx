"use client";

import { useI18n } from "@/i18n";
import { SettingsPanel } from "../settings/SettingsPanel";

export function SettingsView() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-lg font-medium text-mist-100">{t("settings")}</h1>
      <SettingsPanel />
    </div>
  );
}
