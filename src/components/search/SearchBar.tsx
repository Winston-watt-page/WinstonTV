"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useI18n } from "@/i18n";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const { t } = useI18n();
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function handleChange(next: string) {
    setValue(next);
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setSearchQuery(next), 150);
  }

  function handleClear() {
    setValue("");
    setSearchQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="w-full rounded-full border border-white/5 bg-ink-700 py-2.5 pl-9 pr-9 text-sm text-mist-100 placeholder:text-mist-700 focus:outline-none focus-visible:shadow-focus"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t("close")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-mist-500 hover:text-mist-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
