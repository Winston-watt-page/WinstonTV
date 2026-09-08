"use client";

import { useState } from "react";
import { initialsFromName } from "@/lib/channelUtils";

interface ChannelLogoProps {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
};

export function ChannelLogo({ src, name, size = "md" }: ChannelLogoProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={`${SIZE_MAP[size]} shrink-0 rounded-lg bg-ink-600 flex items-center justify-center overflow-hidden ring-1 ring-white/5`}
      aria-hidden="true"
    >
      {showFallback ? (
        <span className="font-semibold text-marigold-400">{initialsFromName(name)}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
