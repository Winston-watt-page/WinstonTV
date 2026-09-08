"use client";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { Channel, HlsVariant, QualityLevel } from "@/types/channel";
import { QualitySelector } from "./QualitySelector";
import { ChannelLogo } from "../channels/ChannelLogo";
import { useI18n } from "@/i18n";

interface PlayerControlsProps {
  channel: Channel;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isPipSupported: boolean;
  variants: HlsVariant[];
  activeQuality: QualityLevel;
  visible: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  onToggleFullscreen: () => void;
  onTogglePip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onQualityChange: (q: QualityLevel) => void;
}

export function PlayerControls({
  channel,
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  isPipSupported,
  variants,
  activeQuality,
  visible,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  onTogglePip,
  onPrevious,
  onNext,
  onQualityChange,
}: PlayerControlsProps) {
  const { t } = useI18n();

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/50 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top: channel info */}
      <div className="pointer-events-auto flex items-center gap-3 p-4">
        <ChannelLogo src={channel.logo} name={channel.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{channel.name}</p>
          <span className="flex items-center gap-1.5 text-[11px] text-signal-live">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-live animate-pulseLive" />
            {t("live")}
          </span>
        </div>
      </div>

      {/* Bottom: controls */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-3 sm:gap-2 sm:p-4">
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? t("pause") : t("play")}
          className="rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={onPrevious}
          aria-label={t("previousChannel")}
          className="hidden rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus sm:inline-flex"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={t("nextChannel")}
          className="hidden rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus sm:inline-flex"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? t("unmute") : t("mute")}
          className="rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          aria-label={t("volume")}
          className="hidden w-16 accent-marigold-500 sm:block md:w-24"
        />

        <span className="flex-1" />

        <QualitySelector variants={variants} activeQuality={activeQuality} onSelect={onQualityChange} />

        {isPipSupported && (
          <button
            type="button"
            onClick={onTogglePip}
            aria-label={t("pictureInPicture")}
            className="rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus"
          >
            <PictureInPicture2 className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? t("exitFullscreen") : t("fullscreen")}
          className="rounded-full p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:shadow-focus"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
